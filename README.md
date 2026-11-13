# Striply — Custom Visual Encoding & Computer Vision Recognition System

> **Product Name:** Striply *(Every Strip. Every Dose. Less Waste.)*  
> **Brand Identity:** 70% White / 20% Blue Gradient Glass / 10% Dark  
> **Typography:** Manrope (Display & Wordmark Logo) + Inter (Functional UI & Reading)  
> **Logo:** Typographic Wordmark ONLY — **Striply** (no icons or medical crosses)

---

## 📌 Executive Overview

**Striply** is an intelligent pharmaceutical visual traceability and waste reduction ecosystem. It solves the critical healthcare crisis of **"Cut-Blister Amnesia"**—where cutting blister packs separates medicine pockets from their printed manufacturer text (name, batch number, expiry date).

Instead of relying on text or OCR, Striply introduces a **custom, machine-readable 4-colour line-based visual identification system**:

$$\text{Medicine Batch Details} \longrightarrow \text{Unique Striply ID} \longrightarrow \text{Visual Pattern Generation} \longrightarrow \text{Foil Printing} \longrightarrow \text{Computer Vision Scanning} \longrightarrow \text{Database Retrieval}$$

### 🎨 4-Colour Channel Mapping

| Colour | Role | Information Represented |
| :--- | :--- | :--- |
| **Red** | Channel 1 (`#EF4444`) | **Medicine Identity** (Medicine Name / Medicine ID) |
| **Blue** | Channel 2 (`#2563EB`) | **Batch Identity** (Manufacturer Batch Number / Striply Batch ID) |
| **Green** | Channel 3 (`#10B981`) | **Manufacturing Date** (Year & Month token) |
| **Yellow** | Channel 4 (`#F59E0B`) | **Expiry Date** (Year & Month token) |

> **Note:** Active composition and full medical instructions are fetched securely from the central database using the decoded Medicine ID.

---

## 🌐 Live System URLs & Localhost Endpoints

| Service | Environment | Access URL | Description |
| :--- | :--- | :--- | :--- |
| **Web Dashboard** | Localhost | [**`http://localhost:3000`**](http://localhost:3000) | **Next.js 14 Glassmorphic Portal:** Customer App, Pharmacy Multiple Batch Entry & Blister-Foil Artwork Preview. |
| **Backend API** | Localhost | [**`http://localhost:5000`**](http://localhost:5000) | **Express 5 + TypeScript Gateway:** Striply ID generator (`ST-xxxxxx`), 4-color pattern vector generator, and CV decoding service. |
| **Health Check** | Localhost | [**`http://localhost:5000/health`**](http://localhost:5000/health) | Immediate status ping: `{"status": "ok", "service": "striply-backend"}`. |
| **Supabase Cloud Core** | Cloud | [**`https://dretomzcwefweppazfme.supabase.co`**](https://dretomzcwefweppazfme.supabase.co) | **Live PostgreSQL 16 Cloud Core:** 14 relational tables, RLS policies, and database triggers. |

---

## 🚀 Quick-Start Development Guide

### 1. Start Central Express Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
# API Gateway live on http://localhost:5000
```

### 2. Start Next.js 14 Web Portal (Port 3000)
```bash
cd web
npm install
npm run dev
# Portal live on http://localhost:3000
```

---

## 📚 Complete Project Documentation Index

| File | Purpose & Contents |
| :--- | :--- |
| [**`PRD.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/PRD.md) | **Product Requirements Document v5.0:** 4-colour encoding system, batch-level identification (`ST-000001`), blister-foil repeat layout specs, and dual-persona journeys. |
| [**`TRD.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/TRD.md) | **Technical Requirements Document v5.0:** Next.js 14 + Express 5 + Supabase PostgreSQL architecture, complete DDL schemas, Modulo-11 parity formulas, and API endpoints. |
| [**`HANDOVER.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/HANDOVER.md) | **Living Session Continuity Record:** What's done, in progress, tested milestones, and strict guardrails. |
| [**`DECISIONS.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/DECISIONS.md) | **Architecture Decision Records (ADRs):** Comprehensive log of trade-offs and tech choices (ADR-001 through ADR-010). |
| [**`FLOW.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/FLOW.md) | **End-to-End Execution Flow:** Sequence diagrams across camera capture, CV edge decoding, DB triggers, and blister-foil repeat rendering. |
| [**`FEATURE.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/FEATURE.md) | **Feature Lifecycle Tracker:** Scoping and verification logs for all MVP modules. |
| [**`BUG.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/BUG.md) | **Root Cause Analysis (RCA):** Deep investigation and resolution traces for engineering challenges. |
| [**`GUIDELINES.md`**](file:///c:/Users/hargu/OneDrive/Desktop/Striply/GUIDELINES.md) | **Code Commenting Standards:** Philosophy of commenting non-obvious logic (spectral line modulation, RLS policies). |
