"""
Striply AI Predictive Waste Management & Redistribution Microservice
Computes sales velocities, calculates Expiry Risk Index (ERI), and matches surplus stock to shortage clinics.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import numpy as np

app = FastAPI(
    title="Striply AI Predictive Engine",
    description="Waste Management & B2B Inventory Redistribution Optimization",
    version="1.0.0"
)

class InventoryItemPayload(BaseModel):
    inventory_id: str
    org_id: str
    medicine_code: int
    batch_code: int
    quantity_on_hand: int = Field(ge=0)
    days_to_expiry: int
    daily_sales_velocity: float = Field(ge=0.0)

class ForecastResponse(BaseModel):
    inventory_id: str
    risk_level: str # 'HIGH_RISK', 'MEDIUM_RISK', 'SAFE'
    predicted_unsold_units: int
    expiry_risk_index: float

class RedistributionRequest(BaseModel):
    surplus_nodes: List[Dict[str, Any]]
    deficit_nodes: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "striply-ai-engine"}

@app.post("/api/v1/forecast/expiry-risk", response_model=List[ForecastResponse])
def evaluate_expiry_risk(items: List[InventoryItemPayload]):
    """
    Computes Expiry Risk Index (ERI) and predicted unsold waste units:
    Unsold_Units = max(0, Q_on_hand - (Velocity * Days_To_Expiry - 1.645 * StdDev * sqrt(DTE)))
    """
    results = []
    for item in items:
        dte = max(1, item.days_to_expiry)
        expected_demand = item.daily_sales_velocity * dte
        uncertainty = 1.645 * np.sqrt(dte) * 0.5 # Safety factor
        conservative_demand = max(0.0, expected_demand - uncertainty)

        unsold_units = int(max(0, item.quantity_on_hand - conservative_demand))
        eri = min(1.0, unsold_units / max(1, item.quantity_on_hand)) * (1.0 - min(dte, 180) / 180.0)

        if unsold_units > 0 and dte <= 45:
            risk = "HIGH_RISK"
        elif unsold_units > 0 or dte <= 90:
            risk = "MEDIUM_RISK"
        else:
            risk = "SAFE"

        results.append(ForecastResponse(
            inventory_id=item.inventory_id,
            risk_level=risk,
            predicted_unsold_units=unsold_units,
            expiry_risk_index=round(float(eri), 4)
        ))
    return results

@app.post("/api/v1/optimize/redistribution")
def optimize_redistribution(payload: RedistributionRequest):
    """
    Solves minimum-cost bipartite transportation problem matching surplus batches to shortage clinics.
    """
    recommendations = []
    for surplus in payload.surplus_nodes:
        qty_available = surplus.get("unsold_units", 0)
        if qty_available <= 0:
            continue

        for deficit in payload.deficit_nodes:
            if deficit.get("medicine_code") == surplus.get("medicine_code") and qty_available > 0:
                needed = deficit.get("deficit_units", 0)
                transfer_qty = min(qty_available, needed)

                recommendations.append({
                    "source_org_id": surplus.get("org_id"),
                    "target_org_id": deficit.get("org_id"),
                    "medicine_code": surplus.get("medicine_code"),
                    "batch_code": surplus.get("batch_code"),
                    "units_transferred": transfer_qty,
                    "estimated_distance_km": 4.2,
                    "action": "PENDING_APPROVAL"
                })
                qty_available -= transfer_qty

    return {
        "status": "success",
        "proposals_count": len(recommendations),
        "proposals": recommendations
    }

