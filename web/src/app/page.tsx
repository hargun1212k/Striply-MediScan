'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  TrendingDown,
  MessageCircle,
  Camera,
  Calendar,
  Search,
  Plus,
  Filter,
  FileText,
  HeartPulse,
  AlertTriangle,
  X,
  Zap,
  ChevronRight,
  Check,
  Sun,
  Moon,
  Trash2,
  Edit2,
  Download,
  Printer,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  CheckSquare,
  Layers,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  HelpCircle,
  Activity,
  ArrowUpRight,
  Sliders,
  UserCheck,
  Building2,
  QrCode,
  Package,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Share2,
  Stethoscope,
  Pill,
  Smartphone,
  ExternalLink,
  Phone,
  Mail,
  User,
  Shield,
  UploadCloud,
  FileCheck,
  CheckCircle,
  SlidersHorizontal,
  Copy,
  AlertCircle
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
───────────────────────────────────────────────────────────── */
export interface BatchEntry {
  id: string;
  medicine_name: string;
  medicine_id: string;
  composition: string;
  strength: string;
  manufacturer: string;
  manufacturer_batch_number: string;
  manufacturing_date: string;
  expiry_date: string;
  available_quantity: number;
  unit: string;
  striply_batch_id: string;
  status: 'pending' | 'generating' | 'generated';
}

export interface CustomerScanResult {
  medicine_name: string;
  medicine_id: string;
  composition: string;
  strength: string;
  manufacturer: string;
  batch_number: string;
  manufacturing_date: string;
  expiry_date: string;
  days_remaining: number;
  verification_status: string;
  state: 'verified' | 'near_expiry' | 'expired' | 'unverified';
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  status: 'currently_taking' | 'upcoming' | 'completed' | 'discontinued';
  days_left: number;
  schedule: string;
  batch_no: string;
  expiry: string;
  composition: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'intake' | 'near_expiry' | 'recall';
  time: string;
  read: boolean;
}

export interface PrintSettingsConfig {
  foilWidth: number;
  repeatLength: number;
  printScale: number;
  orientation: 'portrait' | 'landscape';
  copies: number;
  showAnchor: boolean;
  showCutLines: boolean;
  activeBatchId: string;
}

export default function StriplyApp() {
  /* ─────────────────────────────────────────────────────────────
     VIEW & NAVIGATION STATE
     Workflow: Splash (Screen 1) -> Auth (Screen 2) -> User Type (Screen 3) -> Role App
  ───────────────────────────────────────────────────────────── */
  const [currentView, setCurrentView] = useState<
    'splash' | 'auth' | 'user_type_selection' | 'customer_app' | 'pharmacy_app' | 'landing'
  >('splash');

  // Splash Screen Timer & Progress Animation
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    if (currentView === 'splash') {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentView('auth'), 350);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  /* ─────────────────────────────────────────────────────────────
     AUTHENTICATION STATE (SCREEN 2)
  ───────────────────────────────────────────────────────────── */
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  /* ─────────────────────────────────────────────────────────────
     CUSTOMER PERSONA & STATE
  ───────────────────────────────────────────────────────────── */
  const [customerTab, setCustomerTab] = useState<'home' | 'medicines' | 'scanner' | 'alerts' | 'profile'>('home');
  const [customerMedicineFilter, setCustomerMedicineFilter] = useState<'currently_taking' | 'upcoming' | 'completed' | 'discontinued'>('currently_taking');

  const [customerProfile, setCustomerProfile] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    allergies: 'Penicillin (Severe Rash / Anaphylactoid Risk)',
    conditions: 'Hypertension, Seasonal Allergic Rhinitis',
  });

  // Customer Saved Medicines
  const [savedMedicines, setSavedMedicines] = useState<MedicineItem[]>([
    {
      id: 'med-1',
      name: 'Paracetamol 500 mg',
      dosage: '1 tablet after breakfast',
      status: 'currently_taking',
      days_left: 10,
      schedule: '08:00 AM • Daily',
      batch_no: 'B24-89745',
      expiry: '31 Dec 2026',
      composition: 'Paracetamol IP 500 mg',
    },
    {
      id: 'med-2',
      name: 'Metformin 500 mg',
      dosage: '1 tablet with dinner',
      status: 'currently_taking',
      days_left: 28,
      schedule: '08:30 PM • Daily',
      batch_no: 'MTF-2024-B9',
      expiry: '15 Dec 2027',
      composition: 'Metformin Hydrochloride IP 500 mg',
    },
    {
      id: 'med-3',
      name: 'Cardil AM 50 mg',
      dosage: '1 tablet morning',
      status: 'upcoming',
      days_left: 60,
      schedule: 'Starts Next Monday',
      batch_no: 'CRD-2025-11',
      expiry: '30 Nov 2027',
      composition: 'Amlodipine 5mg + Atenolol 50mg',
    },
    {
      id: 'med-4',
      name: 'Azithromycin 250 mg',
      dosage: 'Course completed',
      status: 'completed',
      days_left: 0,
      schedule: 'Completed on 10 Nov',
      batch_no: 'AZI-2024-04',
      expiry: '28 Nov 2026',
      composition: 'Azithromycin Dihydrate IP 250 mg',
    },
    {
      id: 'med-5',
      name: 'Amoxicillin 500 mg',
      dosage: 'Discontinued per physician instruction',
      status: 'discontinued',
      days_left: 0,
      schedule: 'Replaced with Cefixime',
      batch_no: 'AMX-2023-88',
      expiry: '15 Jan 2025',
      composition: 'Amoxicillin Trihydrate 500 mg',
    },
  ]);

  // Customer Notifications & Alarms
  const [notifications, setNotifications] = useState<AlertNotification[]>([
    {
      id: 'notif-1',
      title: 'Daily Intake Reminder: Metformin 500 mg',
      message: 'Scheduled dose at 08:30 PM. Please take with a meal.',
      type: 'intake',
      time: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Near-Expiry Warning: Azithromycin 250 mg',
      message: 'Batch AZI-2024-04 expires in 15 days. Inspect before ingestion.',
      type: 'near_expiry',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Batch Safety Advisory: Ciprofloxacin 500 mg',
      message: 'Manufacturer Cipla Ltd issued a precautionary recall for Lot CIP-2025.',
      type: 'recall',
      time: '1 day ago',
      read: true,
    },
  ]);

  /* ─────────────────────────────────────────────────────────────
     SCANNER STATES & SIMULATION (CAMERA CV ENGINE)
  ───────────────────────────────────────────────────────────── */
  const [isScanningModalOpen, setIsScanningModalOpen] = useState(false);
  const [scannerStep, setScannerStep] = useState<
    'idle' | 'permission' | 'scanning' | 'detected' | 'decoding' | 'result'
  >('idle');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanResult, setScanResult] = useState<CustomerScanResult>({
    medicine_name: 'Paracetamol 500 mg',
    medicine_id: 'MED-2024-49081',
    composition: 'Paracetamol IP 500 mg, Sodium Propylparaben 0.05% w/w',
    strength: '500 mg',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    batch_number: 'B24-89745',
    manufacturing_date: '15 Jan 2024',
    expiry_date: '31 Dec 2026',
    days_remaining: 48,
    verification_status: 'REGISTERED & VERIFIED IN STRIPLY REGISTRY',
    state: 'verified',
  });

  /* ─────────────────────────────────────────────────────────────
     PHARMACY / MANUFACTURER STATE
  ───────────────────────────────────────────────────────────── */
  const [pharmacyWorkflow, setPharmacyWorkflow] = useState<
    'overview' | 'inventory' | 'register_batch' | 'foil_preview' | 'fefo_recalls' | 'profile'
  >('overview');

  const [inventoryCategory, setInventoryCategory] = useState<'all' | 'active' | 'near_expiry' | 'critical' | 'expired'>('all');
  const [inventorySearch, setInventorySearch] = useState('');

  const [manufacturerProfile, setManufacturerProfile] = useState({
    companyName: 'Cipla Ltd.',
    licenseNumber: 'DL-2024-MH-99410',
    verificationStatus: 'Verified Official Manufacturer',
    representative: 'Dr. Rajesh Sharma, VP Quality Assurance',
    email: 'regulatory@cipla.com',
    phone: '+91 22 2493 5522',
    address: 'Cipla House, Peninsula Business Park, Ganpatrao Kadam Marg, Lower Parel, Mumbai, Maharashtra 400013',
    documentsOnFile: 'Drug_Manufacturing_Licence_2024.pdf',
    activeBatchesCount: 4,
    circulationCount: 4,
    nearExpiryAlerts: 1,
    expiredBatches: 1,
  });

  // Batch Entry Form Fields (Screen 5b / 5c)
  const [batchForm, setBatchForm] = useState({
    medicine_name: 'Paracetamol 500 mg',
    medicine_id: 'MED-2024-49081',
    composition: 'Paracetamol IP 500 mg, Excipients q.s.',
    strength: '500 mg',
    manufacturer: 'Cipla Ltd.',
    manufacturer_batch_number: 'B24-F112',
    manufacturing_date: '2024-01-15',
    expiry_date: '2027-11-19',
    available_quantity: 2500,
    unit: 'Tablets',
  });

  // Editable Excel-like Batch Entry Table (Screen 7.3)
  const [batchEntries, setBatchEntries] = useState<BatchEntry[]>([
    {
      id: 'entry-1',
      medicine_name: 'Metformin 500 mg',
      medicine_id: 'MED-2024-10294',
      composition: 'Metformin Hydrochloride IP 500 mg',
      strength: '500 mg',
      manufacturer: 'Cipla Ltd.',
      manufacturer_batch_number: 'B24-89745',
      manufacturing_date: '2024-02-10',
      expiry_date: '2027-12-15',
      available_quantity: 5000,
      unit: 'Tablets',
      striply_batch_id: 'ST-000001',
      status: 'generated',
    },
    {
      id: 'entry-2',
      medicine_name: 'Paracetamol 500 mg',
      medicine_id: 'MED-2024-49081',
      composition: 'Paracetamol IP 500 mg',
      strength: '500 mg',
      manufacturer: 'Cipla Ltd.',
      manufacturer_batch_number: 'B24-F112',
      manufacturing_date: '2024-01-15',
      expiry_date: '2026-12-31',
      available_quantity: 4200,
      unit: 'Tablets',
      striply_batch_id: 'ST-000002',
      status: 'generated',
    },
    {
      id: 'entry-3',
      medicine_name: 'Vitamin B12 1500 mcg',
      medicine_id: 'MED-2023-77102',
      composition: 'Methylcobalamin 1500 mcg',
      strength: '1500 mcg',
      manufacturer: 'Cipla Ltd.',
      manufacturer_batch_number: 'B23-99120',
      manufacturing_date: '2023-09-01',
      expiry_date: '2024-09-30',
      available_quantity: 850,
      unit: 'Capsules',
      striply_batch_id: 'ST-000003',
      status: 'generated',
    },
    {
      id: 'entry-4',
      medicine_name: 'Azithromycin 250 mg',
      medicine_id: 'MED-2024-33104',
      composition: 'Azithromycin Dihydrate IP 250 mg',
      strength: '250 mg',
      manufacturer: 'Cipla Ltd.',
      manufacturer_batch_number: 'AZI-2024-04',
      manufacturing_date: '2024-05-12',
      expiry_date: '2026-11-28',
      available_quantity: 2200,
      unit: 'Tablets',
      striply_batch_id: 'ST-000004',
      status: 'generated',
    },
  ]);

  const [foilZoomLevel, setFoilZoomLevel] = useState<number>(100);
  const [isPatternsGeneratedBanner, setIsPatternsGeneratedBanner] = useState(false);

  /* ─────────────────────────────────────────────────────────────
     NEW INDUSTRIAL PRINTING WORKFLOW STATE (STEP 4 & STEP 5)
  ───────────────────────────────────────────────────────────── */
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [printSettings, setPrintSettings] = useState<PrintSettingsConfig>({
    foilWidth: 160,
    repeatLength: 240,
    printScale: 100,
    orientation: 'portrait',
    copies: 5,
    showAnchor: true,
    showCutLines: true,
    activeBatchId: 'ST-000001',
  });

  /* ─────────────────────────────────────────────────────────────
     ACTION HANDLERS
  ───────────────────────────────────────────────────────────── */
  // 1. Auth Submission -> Advances to Screen 3 (User Type Selection)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Please enter valid email and password.');
      return;
    }
    setAuthError('');
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      // Strictly follows rule: Splash -> Login/Signup -> Choose User Type
      setCurrentView('user_type_selection');
    }, 600);
  };

  // Demo Login Fast-tracks
  const handleQuickDemo = (role: 'customer' | 'pharmacy') => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      if (role === 'customer') {
        setCurrentView('customer_app');
        setCustomerTab('home');
      } else {
        setCurrentView('pharmacy_app');
        setPharmacyWorkflow('overview');
      }
    }, 400);
  };

  // Camera Scanner Simulation
  const startCameraScan = (targetState: 'verified' | 'near_expiry' | 'expired' | 'unverified' = 'verified') => {
    setIsScanningModalOpen(true);
    setScannerStep('permission');

    setTimeout(() => setScannerStep('scanning'), 600);
    setTimeout(() => setScannerStep('detected'), 1600);
    setTimeout(() => setScannerStep('decoding'), 2400);

    setTimeout(() => {
      if (targetState === 'verified') {
        setScanResult({
          medicine_name: 'Paracetamol 500 mg',
          medicine_id: 'MED-2024-49081',
          composition: 'Paracetamol IP 500 mg, Sodium Propylparaben 0.05% w/w',
          strength: '500 mg',
          manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
          batch_number: 'B24-89745',
          manufacturing_date: '15 Jan 2024',
          expiry_date: '31 Dec 2026',
          days_remaining: 48,
          verification_status: 'REGISTERED PATTERN MATCHED IN CENTRAL REGISTRY',
          state: 'verified',
        });
      } else if (targetState === 'near_expiry') {
        setScanResult({
          medicine_name: 'Azithromycin 250 mg',
          medicine_id: 'MED-2024-33104',
          composition: 'Azithromycin Dihydrate IP 250 mg',
          strength: '250 mg',
          manufacturer: 'Cipla Ltd.',
          batch_number: 'AZI-2024-04',
          manufacturing_date: '12 May 2024',
          expiry_date: '28 Nov 2026',
          days_remaining: 15,
          verification_status: 'NEAR EXPIRY WARNING (15 DAYS REMAINING)',
          state: 'near_expiry',
        });
      } else if (targetState === 'expired') {
        setScanResult({
          medicine_name: 'Vitamin B12 1500 mcg',
          medicine_id: 'MED-2023-77102',
          composition: 'Methylcobalamin 1500 mcg',
          strength: '1500 mcg',
          manufacturer: 'Cipla Ltd.',
          batch_number: 'B23-99120',
          manufacturing_date: '01 Sep 2023',
          expiry_date: '30 Sep 2024',
          days_remaining: -45,
          verification_status: 'EXPIRED PRODUCT — DO NOT DISPENSE OR CONSUME',
          state: 'expired',
        });
      } else {
        setScanResult({
          medicine_name: 'Unrecognized Optical Pattern',
          medicine_id: 'UNKNOWN',
          composition: 'Not verifiable in registered database',
          strength: 'N/A',
          manufacturer: 'Unregistered Source',
          batch_number: 'INVALID_OR_CORRUPT',
          manufacturing_date: 'N/A',
          expiry_date: 'N/A',
          days_remaining: 0,
          verification_status: 'UNVERIFIED PATTERN / DAMAGED FOIL',
          state: 'unverified',
        });
      }
      setScannerStep('result');
    }, 3200);
  };

  // Add Batch Entry
  const handleAddBatchEntry = () => {
    if (!batchForm.medicine_name || !batchForm.manufacturer_batch_number) return;
    const newEntry: BatchEntry = {
      id: `entry-${Date.now()}`,
      ...batchForm,
      striply_batch_id: `ST-${String(batchEntries.length + 1).padStart(6, '0')}`,
      status: 'pending',
    };
    setBatchEntries([...batchEntries, newEntry]);
  };

  // Generate RP Lines Patterns
  const handleGeneratePatterns = () => {
    const updated = batchEntries.map((b) => ({ ...b, status: 'generated' as const }));
    setBatchEntries(updated);
    setIsPatternsGeneratedBanner(true);
  };

  // Export SVG File
  const handleExportSvg = () => {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
      <rect width="800" height="600" fill="#FFFFFF"/>
      <text x="30" y="40" font-family="monospace" font-size="14" fill="#10131B">STRIPLY PHARMACEUTICAL FOIL REPEAT ARTWORK — 160mm REEL</text>
      <text x="30" y="65" font-family="monospace" font-size="11" fill="#64748B">BATCH: ${printSettings.activeBatchId} | SPECIFICATION: RP-LINES-v2.4 | ROTOGRAVURE WEB PROOF</text>
      <line x1="30" y1="80" x2="770" y2="80" stroke="#CBD5E1" stroke-width="1"/>
      <g transform="translate(40, 110)">
        <rect width="220" height="140" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <rect x="20" y="25" width="180" height="8" rx="2" fill="#EF4444"/>
        <rect x="20" y="45" width="180" height="8" rx="2" fill="#10B981"/>
        <rect x="20" y="65" width="180" height="8" rx="2" fill="#1454E8"/>
        <rect x="20" y="85" width="180" height="8" rx="2" fill="#F59E0B"/>
        <rect x="195" y="25" width="6" height="68" fill="#10131B"/>
      </g>
    </svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Striply_Foil_Artwork_${printSettings.activeBatchId}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download PDF Proof Sheet
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] text-[#10131B] font-sans antialiased selection:bg-[#1454E8] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          UNIVERSAL PORTAL SWITCHER (COLLAPSIBLE TOP PERSISTENT GLASS BAR)
      ───────────────────────────────────────────────────────────── */}
      <div className="no-print fixed top-0 inset-x-0 z-50 flex justify-center py-2 px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-[#DCE7FF] rounded-full px-4 py-1.5 shadow-glass flex items-center gap-2 text-xs">
          <span className="font-display font-extrabold text-[#1454E8] flex items-center gap-1.5 pr-2 border-r border-[#DCE7FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#1454E8]" /> Striply
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentView('splash')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'splash' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Splash
            </button>
            <button
              onClick={() => setCurrentView('auth')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'auth' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Auth
            </button>
            <button
              onClick={() => setCurrentView('user_type_selection')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'user_type_selection' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Role Picker
            </button>
            <button
              onClick={() => setCurrentView('customer_app')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'customer_app' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Customer App
            </button>
            <button
              onClick={() => setCurrentView('pharmacy_app')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'pharmacy_app' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Manufacturer Hub
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${currentView === 'landing' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1454E8] hover:bg-white'}`}
            >
              Landing Page
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 1: ANIMATED SPLASH SCREEN (INITIAL APP OPENING)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'splash' && (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-[#F4F6FC] via-[#FFFFFF] to-[#E9F0FE] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#1454E8]/10 blur-[100px] pointer-events-none top-1/4"></div>
          <div className="absolute w-[350px] h-[350px] rounded-full bg-[#8BAAFF]/15 blur-[80px] pointer-events-none bottom-1/4"></div>

          <div className="animate-splash max-w-sm w-full flex flex-col items-center relative z-10">
            {/* Striply Emblem / Logo Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1454E8] to-[#3B82F6] p-0.5 shadow-glass-elevated mb-6 relative group">
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center relative overflow-hidden">
                {/* 4 RP Lines Graphic Emblem */}
                <div className="space-y-1.5 w-10">
                  <div className="h-1.5 bg-[#EF4444] rounded-full w-full"></div>
                  <div className="h-1.5 bg-[#10B981] rounded-full w-3/4"></div>
                  <div className="h-1.5 bg-[#1454E8] rounded-full w-full"></div>
                  <div className="h-1.5 bg-[#F59E0B] rounded-full w-5/6"></div>
                </div>
                {/* Animated Optical Sweep Line */}
                <div className="absolute inset-y-0 w-2 bg-gradient-to-r from-transparent via-[#1454E8]/40 to-transparent animate-sweep"></div>
              </div>
            </div>

            {/* Brand Wordmark in Manrope Typography */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-[#10131B] mb-2">
              Striply
            </h1>

            {/* Official Product Tagline */}
            <p className="font-sans font-medium text-sm text-[#173B70] mb-8 tracking-wide">
              Smarter Medicine. Safer Tracking.
            </p>

            {/* Animated Recognition Optical Beam */}
            <div className="w-48 h-1 bg-[#DCE7FF] rounded-full overflow-hidden relative mb-8">
              <div
                className="h-full bg-gradient-to-r from-[#1454E8] via-[#8BAAFF] to-[#1454E8] rounded-full transition-all duration-150"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>

            {/* Direct Skip / Enter Action */}
            <button
              onClick={() => setCurrentView('auth')}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#1454E8] bg-white/80 hover:bg-white border border-[#DCE7FF] shadow-sm transition-all hover:scale-105 flex items-center gap-2"
            >
              Enter Application <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-6 text-[11px] text-slate-400 font-mono">
            RP Lines Recognition Pattern v2.4 • Clinical Precision
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2: LOGIN / SIGN UP (FIRST ACTUAL INTERACTION SCREEN)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'auth' && (
        <div className="min-h-screen bg-[#F4F6FC] flex items-center justify-center p-4 relative pt-16">
          <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-[#DCE7FF] shadow-glass-elevated relative z-10">
            {/* Logo & Welcome Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1454E8]/10 text-[#1454E8] mb-3">
                <Pill className="w-6 h-6" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-[#10131B] tracking-tight">
                {authMode === 'login' ? 'Welcome to Striply' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login'
                  ? 'Sign in to access your medicine cabinet and verify RP Lines.'
                  : 'Join the clinical traceability network for patients and pharmacies.'}
              </p>
            </div>

            {/* Auth Switcher Tabs */}
            <div className="flex p-1 bg-[#F4F6FC] rounded-2xl mb-6 border border-[#DCE7FF]">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${authMode === 'login' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${authMode === 'signup' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCE7FF] text-sm text-[#10131B] focus:border-[#1454E8] focus:outline-none transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCE7FF] text-sm text-[#10131B] focus:border-[#1454E8] focus:outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCE7FF] text-sm text-[#10131B] focus:border-[#1454E8] focus:outline-none transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-xs text-[#1454E8] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#DCE7FF] text-sm text-[#10131B] focus:border-[#1454E8] focus:outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 bg-[#1454E8] hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isAuthLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {authMode === 'login' ? 'Sign In to Striply' : 'Create Free Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fast-Tracks */}
            <div className="mt-6 pt-6 border-t border-[#DCE7FF] text-center">
              <span className="text-xs text-slate-500 block mb-3 font-medium">Or explore instantly as a demo persona:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-blue-50/50 text-xs font-semibold text-[#1454E8] border border-[#DCE7FF] shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Smartphone className="w-3.5 h-3.5" /> Customer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('pharmacy')}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50/50 text-xs font-semibold text-[#173B70] border border-[#DCE7FF] shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Building2 className="w-3.5 h-3.5" /> Pharmacy Demo
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {isForgotPasswordOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE7FF]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-[#10131B]">Reset Password</h3>
                  <button onClick={() => setIsForgotPasswordOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {forgotSubmitted ? (
                  <div className="text-center py-4 space-y-3">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="text-xs text-slate-600">
                      Reset instructions have been dispatched to <b>{forgotEmail}</b>. Please check your inbox.
                    </p>
                    <button
                      onClick={() => {
                        setIsForgotPasswordOpen(false);
                        setForgotSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-[#1454E8] text-white rounded-xl text-xs font-semibold"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setForgotSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-slate-500">
                      Enter your registered email address and we'll send a secure password reset link.
                    </p>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7FF] text-sm focus:outline-none focus:border-[#1454E8]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1454E8] text-white font-semibold text-xs rounded-xl shadow-sm"
                    >
                      Send Reset Link
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 3: CHOOSE YOUR USER TYPE (POST-AUTHENTICATION SCREEN)
          Matches Wireframe screen: "Who are you signing in as?"
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'user_type_selection' && (
        <div className="min-h-screen bg-[#F4F6FC] flex items-center justify-center p-4 relative pt-16">
          <div className="max-w-xl w-full">
            <div className="text-center mb-8">
              <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#10131B] block mb-2">
                Who are you signing in as?
              </span>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Striply gives each medicine pocket a verifiable identity. Select the experience that matches your role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: I'm a Customer */}
              <div
                onClick={() => {
                  setCurrentView('customer_app');
                  setCustomerTab('home');
                }}
                className="bg-white/80 backdrop-blur-md p-6 rounded-3xl cursor-pointer hover:border-[#1454E8] hover:shadow-glass-elevated hover:scale-[1.02] transition-all group border border-[#DCE7FF] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1454E8]/10 text-[#1454E8] flex items-center justify-center mb-4 group-hover:bg-[#1454E8] group-hover:text-white transition-all">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#10131B] mb-2">
                    I'm a Customer
                  </h3>
                  <ul className="text-xs text-slate-600 space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1454E8]" /> Scan RP Lines on your medicine pockets
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1454E8]" /> Track active medications & adherence
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1454E8]" /> Receive instant expiry and recall alerts
                    </li>
                  </ul>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1454E8]">
                  Open Customer Mobile App <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2: I'm a Pharmacy / Manufacturer */}
              <div
                onClick={() => {
                  setCurrentView('pharmacy_app');
                  setPharmacyWorkflow('overview');
                }}
                className="bg-white/80 backdrop-blur-md p-6 rounded-3xl cursor-pointer hover:border-[#1454E8] hover:shadow-glass-elevated hover:scale-[1.02] transition-all group border border-[#DCE7FF] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#173B70]/10 text-[#173B70] flex items-center justify-center mb-4 group-hover:bg-[#173B70] group-hover:text-white transition-all">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#10131B] mb-2">
                    I'm a Pharmacy | Manufacturer
                  </h3>
                  <ul className="text-xs text-slate-600 space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#173B70]" /> Register medicine batches with RP Lines
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#173B70]" /> Generate repeating blister foil artwork
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#173B70]" /> Manage inventory, FEFO dispatch & recalls
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manufacturer accounts require verification before issuing official patterns.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#173B70]">
                    Open Manufacturer Portal <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 4: CUSTOMER MOBILE EXPERIENCE APP (MATCHES WIREFRAME)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'customer_app' && (
        <div className="min-h-screen bg-[#F4F6FC] pb-24 pt-14">
          <div className="max-w-md mx-auto min-h-screen bg-[#F4F6FC] flex flex-col shadow-2xl relative border-x border-[#DCE7FF]">
            {/* Top Bar Greeting */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-b border-[#DCE7FF] sticky top-10 z-30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">Good morning</span>
                <span className="font-display font-bold text-base text-[#10131B]">
                  {customerProfile.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomerTab('alerts')}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative"
                  title="Alerts"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1454E8]"></span>
                </button>
                <button
                  onClick={() => setCustomerTab('profile')}
                  className="w-8 h-8 rounded-full bg-[#1454E8] text-white flex items-center justify-center font-bold text-xs"
                >
                  PS
                </button>
              </div>
            </div>

            {/* TAB 1: CUSTOMER HOME */}
            {customerTab === 'home' && (
              <div className="p-4 space-y-5 flex-1">
                {/* PROMINENT SCAN MEDICINE BANNER */}
                <div className="bg-gradient-to-r from-[#1454E8] to-[#1E3A8A] rounded-3xl p-5 text-white shadow-glass relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold uppercase tracking-wider mb-2 inline-block">
                      Optical RP Lines Reader
                    </span>
                    <h3 className="font-display font-extrabold text-xl mb-1">
                      Scan a medicine
                    </h3>
                    <p className="text-xs text-blue-100 mb-4">
                      Hold individual pocket pattern inside viewfinder to decode batch & expiry.
                    </p>
                    <button
                      onClick={() => startCameraScan('verified')}
                      className="px-5 py-2.5 bg-white text-[#1454E8] hover:bg-blue-50 font-bold rounded-2xl text-xs shadow-md flex items-center gap-2 transition-all"
                    >
                      <Camera className="w-4 h-4 text-[#1454E8]" />
                      Scan medicine pocket
                    </button>
                  </div>
                  {/* Decorative Optical Stripes in Background */}
                  <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform rotate-12 translate-x-4 translate-y-2">
                    <div className="w-32 h-3 bg-red-400 mb-1 rounded-full"></div>
                    <div className="w-28 h-3 bg-green-400 mb-1 rounded-full"></div>
                    <div className="w-36 h-3 bg-blue-300 mb-1 rounded-full"></div>
                    <div className="w-24 h-3 bg-yellow-300 rounded-full"></div>
                  </div>
                </div>

                {/* Pill Intake Status Pill */}
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-900 block">Metformin 500 mg</span>
                      <span className="text-emerald-700 text-[11px]">Taken at 08:30 AM today</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200/60 text-emerald-800 text-[10px] font-bold">
                    Taken
                  </span>
                </div>

                {/* Currently Taking Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-bold text-sm text-[#10131B]">Currently taking</h4>
                    <button
                      onClick={() => setCustomerTab('medicines')}
                      className="text-xs text-[#1454E8] font-semibold hover:underline"
                    >
                      See all
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {savedMedicines
                      .filter((m) => m.status === 'currently_taking')
                      .map((med) => (
                        <div
                          key={med.id}
                          className="bg-white p-3.5 rounded-2xl border border-[#DCE7FF] shadow-sm hover:border-[#1454E8] transition-all"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1454E8] flex items-center justify-center mb-2">
                            <Pill className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-[#10131B] block truncate">
                            {med.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block mb-2">{med.days_left} days left</span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1454E8] text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Scans Section with Badges */}
                <div>
                  <h4 className="font-display font-bold text-sm text-[#10131B] mb-3">Recent scans</h4>
                  <div className="space-y-2.5">
                    {/* Item 1: Verified */}
                    <div
                      onClick={() => startCameraScan('verified')}
                      className="p-3.5 bg-white rounded-2xl border border-[#DCE7FF] shadow-sm flex items-center justify-between hover:border-[#1454E8] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#10131B] block">Paracetamol 500 mg</span>
                          <span className="text-[11px] text-slate-500">Batch: B24-89745 • Dec 2026</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Verified
                      </span>
                    </div>

                    {/* Item 2: Near Expiry */}
                    <div
                      onClick={() => startCameraScan('near_expiry')}
                      className="p-3.5 bg-white rounded-2xl border border-[#DCE7FF] shadow-sm flex items-center justify-between hover:border-amber-400 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#10131B] block">Azithromycin 250 mg</span>
                          <span className="text-[11px] text-slate-500">Batch: AZI-2024-04 • 15 days left</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Near expiry
                      </span>
                    </div>

                    {/* Item 3: Expired */}
                    <div
                      onClick={() => startCameraScan('expired')}
                      className="p-3.5 bg-white rounded-2xl border border-[#DCE7FF] shadow-sm flex items-center justify-between hover:border-red-400 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#10131B] block">Vitamin B12 1500 mcg</span>
                          <span className="text-[11px] text-slate-500">Batch: B23-99120 • Expired</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                        Expired
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY MEDICINES */}
            {customerTab === 'medicines' && (
              <div className="p-4 space-y-4 flex-1">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-[#10131B]">My Medicines</h3>
                  <p className="text-xs text-slate-500">Manage ongoing courses, prescriptions, and dose logs.</p>
                </div>

                {/* Filter Pills */}
                <div className="flex bg-white p-1 rounded-2xl border border-[#DCE7FF] text-xs font-semibold">
                  {(['currently_taking', 'upcoming', 'completed', 'discontinued'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCustomerMedicineFilter(filter)}
                      className={`flex-1 py-1.5 rounded-xl capitalize transition-all text-[11px] ${customerMedicineFilter === filter ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                    >
                      {filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Medicine Cards */}
                <div className="space-y-3">
                  {savedMedicines
                    .filter((m) => m.status === customerMedicineFilter)
                    .map((med) => (
                      <div
                        key={med.id}
                        className="bg-white p-4 rounded-2xl border border-[#DCE7FF] shadow-sm space-y-2 hover:border-[#1454E8] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-sm text-[#10131B] block">{med.name}</span>
                            <span className="text-xs text-slate-500">{med.composition}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1454E8] font-bold text-[10px]">
                            {med.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
                          <span>{med.schedule}</span>
                          <span className="font-mono text-slate-500">{med.batch_no}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: SCANNER */}
            {customerTab === 'scanner' && (
              <div className="p-4 space-y-4 flex-1">
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#1454E8]/10 text-[#1454E8] flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[#10131B] mb-1">
                    Scan RP Lines
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                    Position your camera over the 4-colour pattern printed on the blister foil pocket.
                  </p>
                  <button
                    onClick={() => startCameraScan('verified')}
                    className="px-6 py-3 bg-[#1454E8] hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md inline-flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> Open Camera Viewfinder
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: ALERTS */}
            {customerTab === 'alerts' && (
              <div className="p-4 space-y-4 flex-1">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-[#10131B]">Alerts & Recalls</h3>
                  <p className="text-xs text-slate-500">Live clinical notices, intake alarms, and expiry warnings.</p>
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border text-xs space-y-1.5 ${notif.type === 'recall' ? 'bg-red-50 border-red-200' : notif.type === 'near_expiry' ? 'bg-amber-50 border-amber-200' : 'bg-white border-[#DCE7FF]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#10131B] block">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE */}
            {customerTab === 'profile' && (
              <div className="p-4 space-y-5 flex-1">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#1454E8] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md">
                    PS
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#10131B]">
                    {customerProfile.name}
                  </h3>
                  <span className="text-xs text-slate-500">{customerProfile.email}</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#DCE7FF] divide-y divide-slate-100 text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Push Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded text-[#1454E8]" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">WhatsApp Intake Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded text-[#1454E8]" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Dark Mode</span>
                    <input type="checkbox" className="rounded text-[#1454E8]" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#DCE7FF] divide-y divide-slate-100 text-xs">
                  <button className="w-full p-3.5 text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                    <span>Edit Profile Details</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full p-3.5 text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                    <span>Help & Clinical Support</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full p-3.5 text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                    <span>Terms & Privacy Policy</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentView('auth')}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition-all border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* 5-ITEM MOBILE BOTTOM NAVIGATION BAR */}
            <div className="fixed bottom-0 max-w-md w-full bg-white/90 backdrop-blur-lg border-t border-[#DCE7FF] px-4 py-2 flex items-center justify-around z-30 shadow-lg">
              <button
                onClick={() => setCustomerTab('home')}
                className={`flex flex-col items-center gap-1 py-1 ${customerTab === 'home' ? 'text-[#1454E8]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Pill className="w-5 h-5" />
                <span className="text-[10px] font-bold">Home</span>
              </button>

              <button
                onClick={() => setCustomerTab('medicines')}
                className={`flex flex-col items-center gap-1 py-1 ${customerTab === 'medicines' ? 'text-[#1454E8]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-bold">My Medicines</span>
              </button>

              {/* Central Elevated Scan Action */}
              <button
                onClick={() => startCameraScan('verified')}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-13 h-13 rounded-full bg-[#1454E8] group-hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 p-3 transition-transform group-hover:scale-105 border-4 border-white">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#1454E8] mt-1">Scan</span>
              </button>

              <button
                onClick={() => setCustomerTab('alerts')}
                className={`flex flex-col items-center gap-1 py-1 ${customerTab === 'alerts' ? 'text-[#1454E8]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold">Alerts</span>
              </button>

              <button
                onClick={() => setCustomerTab('profile')}
                className={`flex flex-col items-center gap-1 py-1 ${customerTab === 'profile' ? 'text-[#1454E8]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-bold">Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 5: PHARMACY / MANUFACTURER EXPERIENCE (WORKSPACE)
          Matches Wireframe: Overview, Inventory, Add Stock/Batch Table, Foil Artwork Preview
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'pharmacy_app' && (
        <div className="min-h-screen bg-[#F4F6FC] pb-16 pt-14">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header & Sub-Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#DCE7FF] shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1454E8] font-bold text-[10px] uppercase tracking-wider">
                    Manufacturer Workspace
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Manufacturer
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#10131B] tracking-tight">
                  {manufacturerProfile.companyName}
                </h2>
              </div>

              {/* Workspace Navigation Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F6FC] p-1.5 rounded-2xl border border-[#DCE7FF] text-xs font-semibold">
                <button
                  onClick={() => setPharmacyWorkflow('overview')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'overview' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setPharmacyWorkflow('inventory')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'inventory' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  Inventory
                </button>
                <button
                  onClick={() => setPharmacyWorkflow('register_batch')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'register_batch' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  Add Stock / Batches
                </button>
                <button
                  onClick={() => setPharmacyWorkflow('foil_preview')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'foil_preview' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  Foil Artwork Preview
                </button>
                <button
                  onClick={() => setPharmacyWorkflow('fefo_recalls')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'fefo_recalls' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  FEFO & Recalls
                </button>
                <button
                  onClick={() => setPharmacyWorkflow('profile')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${pharmacyWorkflow === 'profile' ? 'bg-[#1454E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#10131B]'}`}
                >
                  Profile
                </button>
              </div>
            </div>

            {/* WORKFLOW 1: OVERVIEW DASHBOARD */}
            {pharmacyWorkflow === 'overview' && (
              <div className="space-y-6">
                {/* 4 Metric Cards (Matching Screenshot) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Active Batches</span>
                    <span className="font-display font-extrabold text-3xl text-[#10131B]">
                      {manufacturerProfile.activeBatchesCount}
                    </span>
                    <span className="text-[11px] text-emerald-600 block mt-2 font-medium">● Normal verification</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm">
                    <span className="text-xs text-slate-500 font-medium block mb-1">In Circulation</span>
                    <span className="font-display font-extrabold text-3xl text-[#1454E8]">
                      {manufacturerProfile.circulationCount}
                    </span>
                    <span className="text-[11px] text-blue-600 block mt-2 font-medium">● Across 14 distributors</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Near-Expiry Alerts</span>
                    <span className="font-display font-extrabold text-3xl text-amber-500">
                      {manufacturerProfile.nearExpiryAlerts}
                    </span>
                    <span className="text-[11px] text-amber-600 block mt-2 font-medium">● Within 90-day threshold</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Expired Batches</span>
                    <span className="font-display font-extrabold text-3xl text-red-500">
                      {manufacturerProfile.expiredBatches}
                    </span>
                    <span className="text-[11px] text-red-600 block mt-2 font-medium">● Quarantined</span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setPharmacyWorkflow('register_batch')}
                    className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm cursor-pointer hover:border-[#1454E8] hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#10131B] block">Register new batch</span>
                      <span className="text-xs text-slate-500">Add drug metadata and generate RP patterns</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1454E8]" />
                  </div>

                  <div
                    onClick={() => setPharmacyWorkflow('inventory')}
                    className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm cursor-pointer hover:border-[#1454E8] hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#10131B] block">Browse batch records</span>
                      <span className="text-xs text-slate-500">Filter registered stocks & expiry status</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1454E8]" />
                  </div>

                  <div
                    onClick={() => setPharmacyWorkflow('foil_preview')}
                    className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm cursor-pointer hover:border-[#1454E8] hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#10131B] block">Foil Artwork & Printing</span>
                      <span className="text-xs text-slate-500">Inspect repeating cylinder & print proofs</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1454E8]" />
                  </div>
                </div>

                {/* Needs Attention Alert */}
                <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-900 block">Needs attention this week</span>
                      <span className="text-amber-800">Batch AZI-2024-04 (Azithromycin 250 mg) is within 15 days of shelf-life expiration.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPharmacyWorkflow('fefo_recalls')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                  >
                    View FEFO Priority
                  </button>
                </div>
              </div>
            )}

            {/* WORKFLOW 2: INVENTORY & STOCK MANAGEMENT */}
            {pharmacyWorkflow === 'inventory' && (
              <div className="space-y-5">
                <div className="bg-white rounded-3xl p-5 border border-[#DCE7FF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Search by medicine name, batch number, or Striply ID..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DCE7FF] text-xs focus:outline-none focus:border-[#1454E8]"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
                    {(['all', 'active', 'near_expiry', 'critical', 'expired'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setInventoryCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${inventoryCategory === cat ? 'bg-[#1454E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Inventory Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batchEntries.map((batch) => (
                    <div
                      key={batch.id}
                      className="bg-white p-5 rounded-3xl border border-[#DCE7FF] shadow-sm space-y-3 hover:border-[#1454E8] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-base text-[#10131B] block">{batch.medicine_name}</span>
                          <span className="text-xs text-slate-500 font-mono">Striply ID: {batch.striply_batch_id}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#1454E8] border border-blue-200">
                          {batch.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Manufacturer Lot:</span>
                          <span className="font-mono font-medium">{batch.manufacturer_batch_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Expiry Date:</span>
                          <span className="font-medium">{batch.expiry_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Available Units:</span>
                          <span className="font-semibold text-[#10131B]">{batch.available_quantity.toLocaleString()} {batch.unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Pattern Status:</span>
                          <span className="text-emerald-600 font-semibold">4 Channels Encoded</span>
                        </div>
                      </div>

                      {/* Mini RP Lines Pattern Strip */}
                      <div className="pt-2">
                        <div className="h-4 bg-slate-100 rounded-md p-0.5 flex gap-1 items-center">
                          <span className="h-full flex-1 bg-[#EF4444] rounded-sm"></span>
                          <span className="h-full flex-1 bg-[#10B981] rounded-sm"></span>
                          <span className="h-full flex-1 bg-[#1454E8] rounded-sm"></span>
                          <span className="h-full flex-1 bg-[#F59E0B] rounded-sm"></span>
                          <span className="h-full w-2 bg-black rounded-sm" title="Calibration Anchor"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WORKFLOW 3: ADD STOCK & EDITABLE EXCEL-LIKE BATCH TABLE */}
            {pharmacyWorkflow === 'register_batch' && (
              <div className="space-y-6">
                {/* Generation Success Banner */}
                {isPatternsGeneratedBanner && (
                  <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-900 block">RP Lines Patterns Successfully Generated!</span>
                        <span className="text-emerald-700">All batch entries have been signed and mapped to continuous blister artwork.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPharmacyWorkflow('foil_preview')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm"
                    >
                      Open Foil Artwork Preview →
                    </button>
                  </div>
                )}

                {/* Batch Registration Form */}
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm">
                  <div className="mb-5">
                    <span className="text-xs font-bold text-[#1454E8] uppercase tracking-wider block mb-1">
                      New Batch Registration
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-[#10131B]">
                      Enter Pharmaceutical Batch Data
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Medicine Name *</label>
                      <input
                        type="text"
                        value={batchForm.medicine_name}
                        onChange={(e) => setBatchForm({ ...batchForm, medicine_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Medicine ID *</label>
                      <input
                        type="text"
                        value={batchForm.medicine_id}
                        onChange={(e) => setBatchForm({ ...batchForm, medicine_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Composition *</label>
                      <input
                        type="text"
                        value={batchForm.composition}
                        onChange={(e) => setBatchForm({ ...batchForm, composition: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                      <input
                        type="text"
                        value={batchForm.strength}
                        onChange={(e) => setBatchForm({ ...batchForm, strength: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Manufacturer Batch Number *</label>
                      <input
                        type="text"
                        value={batchForm.manufacturer_batch_number}
                        onChange={(e) => setBatchForm({ ...batchForm, manufacturer_batch_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Available Quantity</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={batchForm.available_quantity}
                          onChange={(e) => setBatchForm({ ...batchForm, available_quantity: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                        />
                        <select
                          value={batchForm.unit}
                          onChange={(e) => setBatchForm({ ...batchForm, unit: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-[#DCE7FF] bg-white text-xs"
                        >
                          <option>Tablets</option>
                          <option>Capsules</option>
                          <option>Strips</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Manufacturing Date</label>
                      <input
                        type="date"
                        value={batchForm.manufacturing_date}
                        onChange={(e) => setBatchForm({ ...batchForm, manufacturing_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expiry Date *</label>
                      <input
                        type="date"
                        value={batchForm.expiry_date}
                        onChange={(e) => setBatchForm({ ...batchForm, expiry_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none"
                      />
                    </div>

                    {/* Live Pattern Preview */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">RP Lines Optical Preview</label>
                      <div className="h-10 bg-slate-50 border border-[#DCE7FF] rounded-xl p-2 flex flex-col justify-around">
                        <div className="h-1 bg-[#EF4444] rounded-full w-full"></div>
                        <div className="h-1 bg-[#10B981] rounded-full w-3/4"></div>
                        <div className="h-1 bg-[#1454E8] rounded-full w-full"></div>
                        <div className="h-1 bg-[#F59E0B] rounded-full w-5/6"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddBatchEntry}
                      className="px-5 py-2.5 bg-[#1454E8] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add to Batch Table
                    </button>
                  </div>
                </div>

                {/* Editable Excel-like Batch Entry Table */}
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-display font-bold text-lg text-[#10131B]">
                        Batch Entries Queue ({batchEntries.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Review and edit rows before generating official deterministic RP Lines patterns.
                      </p>
                    </div>

                    <button
                      onClick={handleGeneratePatterns}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Generate RP Lines Patterns
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Medicine Name</th>
                          <th className="py-3 px-4">Medicine ID</th>
                          <th className="py-3 px-4">Lot Number</th>
                          <th className="py-3 px-4">Expiry</th>
                          <th className="py-3 px-4">Quantity</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {batchEntries.map((entry, idx) => (
                          <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-[#10131B]">{entry.medicine_name}</td>
                            <td className="py-3 px-4 font-mono text-slate-500">{entry.medicine_id}</td>
                            <td className="py-3 px-4 font-mono font-medium">{entry.manufacturer_batch_number}</td>
                            <td className="py-3 px-4">{entry.expiry_date}</td>
                            <td className="py-3 px-4 font-semibold">{entry.available_quantity.toLocaleString()} {entry.unit}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.status === 'generated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {entry.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setBatchEntries(batchEntries.filter((b) => b.id !== entry.id))}
                                className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* WORKFLOW 4: FOIL ARTWORK PREVIEW WITH PRINT ACTION */}
            {pharmacyWorkflow === 'foil_preview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#1454E8] uppercase tracking-wider block mb-1">
                      Continuous Repeating Pharmaceutical Blister Foil (160mm)
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-[#10131B] tracking-tight">
                      Foil Artwork Preview • Batch {batchEntries[0]?.manufacturer_batch_number || 'B24-89745'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard Reel Width: 160.00 mm • Repeat Cylinder Length: 240.00 mm • 3 Continuous Lanes
                    </p>
                  </div>

                  {/* Actions: Zoom, Back, Export, and NEW PRINT ARTWORK BUTTON */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <button
                        onClick={() => setFoilZoomLevel(Math.max(60, foilZoomLevel - 20))}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="font-mono px-2 text-xs">{foilZoomLevel}%</span>
                      <button
                        onClick={() => setFoilZoomLevel(Math.min(180, foilZoomLevel + 20))}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setPharmacyWorkflow('register_batch')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Back to entries
                    </button>

                    <button
                      onClick={handleExportSvg}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Export SVG
                    </button>

                    {/* NEW PRINT ARTWORK BUTTON (STEP 3 OF PRINT WORKFLOW) */}
                    <button
                      onClick={() => setIsPrintSettingsOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#1454E8] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                    >
                      <Printer className="w-4 h-4" /> Print Artwork
                    </button>
                  </div>
                </div>

                {/* 4-Colour RP Lines Legend */}
                <div className="bg-white p-4 rounded-2xl border border-[#DCE7FF] shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#EF4444]"></span>
                      <span className="font-semibold text-slate-700">Red: Medicine ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#10B981]"></span>
                      <span className="font-semibold text-slate-700">Green: Batch Number Code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#1454E8]"></span>
                      <span className="font-semibold text-slate-700">Blue: Expiry Year Code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#F59E0B]"></span>
                      <span className="font-semibold text-slate-700">Yellow: Expiry Month Code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-black"></span>
                      <span className="font-semibold text-slate-700">Black/White: Calibration Anchor</span>
                    </div>
                  </div>
                </div>

                {/* Repeating Blister Canvas */}
                <div className="foil-canvas-pattern p-8 rounded-3xl border border-slate-300 min-h-[500px] overflow-auto flex items-center justify-center bg-white shadow-inner">
                  <div
                    style={{ transform: `scale(${foilZoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="transition-transform duration-200 bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl space-y-6 w-full max-w-3xl"
                  >
                    {/* Machine Registration Eye-Marks */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-200 pb-2">
                      <span>EYEMARK 01 • LEFT WEB SLITTER</span>
                      <span className="text-[#1454E8] font-bold">REEL WIDTH: 160.00 mm • CONTINUOUS REPEAT 240mm</span>
                      <span>EYEMARK 02 • RIGHT WEB SLITTER</span>
                    </div>

                    {/* 3 Continuous Repeating Lanes of Pockets */}
                    <div className="grid grid-cols-3 gap-5">
                      {[1, 2, 3].map((lane) => (
                        <div key={lane} className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                          <div className="text-[10px] font-mono text-[#1454E8] flex justify-between">
                            <span className="font-bold">POCKET LANE 0{lane}</span>
                            <span>{batchEntries[0]?.striply_batch_id || 'ST-000001'}</span>
                          </div>

                          {/* 4 Optical Channels */}
                          <div className="space-y-1.5 py-2 bg-white p-3 rounded-xl border border-slate-200 relative">
                            {/* Red Channel (Medicine ID) */}
                            <div className="h-2 bg-[#EF4444] rounded flex gap-1 px-1 items-center">
                              <span className="w-3 h-1 bg-white/60"></span>
                            </div>
                            {/* Green Channel (Batch #) */}
                            <div className="h-2 bg-[#10B981] rounded flex gap-1 px-1 items-center">
                              <span className="w-4 h-1 bg-white/60"></span>
                            </div>
                            {/* Blue Channel (Expiry Year) */}
                            <div className="h-2 bg-[#1454E8] rounded flex gap-1 px-1 items-center">
                              <span className="w-2 h-1 bg-white/60"></span>
                            </div>
                            {/* Yellow Channel (Expiry Month) */}
                            <div className="h-2 bg-[#F59E0B] rounded flex gap-1 px-1 items-center">
                              <span className="w-5 h-1 bg-white/60"></span>
                            </div>
                            {/* Calibration Anchor */}
                            <div className="absolute right-2 top-2 bottom-2 w-1.5 bg-black rounded-sm" title="Fiducial"></div>
                          </div>

                          <div className="text-[10px] font-mono text-slate-600 flex justify-between pt-1">
                            <span className="font-bold">{batchEntries[0]?.medicine_name || 'Metformin 500'}</span>
                            <span>EXP: {batchEntries[0]?.expiry_date || '2027-12'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-[10px] font-mono text-slate-400 border-t border-slate-200 pt-2">
                      --- 240.00 mm CONTINUOUS CYLINDER REPEAT SEAMLESS JOIN ---
                    </div>
                  </div>
                </div>

                {/* Industrial Regulatory Disclaimer */}
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 text-xs text-[#173B70] flex items-center gap-3">
                  <Info className="w-5 h-5 text-[#1454E8] shrink-0" />
                  <span>
                    Notice: The generated artwork is intended for pharmaceutical rotogravure / flexographic lidding foil production. Actual manufacturing requires certified industrial web printing equipment and registered blister heat-sealing tooling.
                  </span>
                </div>
              </div>
            )}

            {/* WORKFLOW 5: FEFO & RECALLS */}
            {pharmacyWorkflow === 'fefo_recalls' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm">
                  <h3 className="font-display font-extrabold text-2xl text-[#10131B] tracking-tight mb-1">
                    FEFO Dispatch Queue & Safety Quarantine
                  </h3>
                  <p className="text-xs text-slate-500">
                    First-Expiry First-Out algorithm automatically prioritizes inventory nearing expiration boundaries.
                  </p>
                </div>

                {/* Urgent Recall Banner */}
                <div className="p-5 bg-red-50 rounded-3xl border border-red-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-red-900 block text-sm">URGENT RECALL: CIPROFLOXACIN 500 MG</span>
                      <span className="text-red-700">Affected Lot CIP-2025 • Striply ID ST-000005 • 20 Strips in Stock</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm">
                    Quarantine Stock
                  </button>
                </div>

                {/* Active FEFO Queue */}
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm divide-y divide-slate-100 text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#10131B] block">Azithromycin 250 mg (ST-000004)</span>
                      <span className="text-slate-500">Lot: AZI-2024-04 • 2,200 Tablets</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                      15 Days to Expiry • PRIORITY 1 DISPATCH
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#10131B] block">Paracetamol 500 mg (ST-000002)</span>
                      <span className="text-slate-500">Lot: B24-F112 • 4,200 Tablets</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-[#1454E8] font-bold">
                      48 Days to Expiry • PRIORITY 2 DISPATCH
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#10131B] block">Metformin 500 mg (ST-000001)</span>
                      <span className="text-slate-500">Lot: B24-89745 • 5,000 Tablets</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      365+ Days to Expiry • NORMAL DISPATCH
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WORKFLOW 6: MANUFACTURER PROFILE */}
            {pharmacyWorkflow === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#DCE7FF] shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#1454E8]/10 text-[#1454E8] flex items-center justify-center font-bold text-xl">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-2xl text-[#10131B]">
                        {manufacturerProfile.companyName}
                      </h3>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Verified Pharmaceutical Manufacturer
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Drug Manufacturing Licence</span>
                      <span className="font-mono font-bold text-[#10131B]">{manufacturerProfile.licenseNumber}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Corporate Representative</span>
                      <span className="font-semibold text-[#10131B]">{manufacturerProfile.representative}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Regulatory Email</span>
                      <span className="font-semibold text-[#10131B]">{manufacturerProfile.email}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-1">Registered Address</span>
                      <span className="text-slate-700">{manufacturerProfile.address}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-500">Document on File: {manufacturerProfile.documentsOnFile}</span>
                    <button
                      onClick={() => setCurrentView('auth')}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-all border border-red-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          NEW FEATURE: STEP 4 — PRINT SETTINGS MODAL
      ───────────────────────────────────────────────────────────── */}
      {isPrintSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE7FF]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#1454E8] uppercase tracking-wider block">
                  Industrial Print Workflow • Step 1 of 2
                </span>
                <h3 className="font-display font-bold text-xl text-[#10131B]">
                  Foil Print Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsPrintSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Foil Web Width (mm)</label>
                  <input
                    type="number"
                    value={printSettings.foilWidth}
                    onChange={(e) => setPrintSettings({ ...printSettings, foilWidth: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Standard reel: 160.00 mm</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Repeat Length (mm)</label>
                  <input
                    type="number"
                    value={printSettings.repeatLength}
                    onChange={(e) => setPrintSettings({ ...printSettings, repeatLength: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE7FF] focus:border-[#1454E8] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Cylinder repeat: 240.00 mm</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number of Repeats</label>
                  <select
                    value={printSettings.copies}
                    onChange={(e) => setPrintSettings({ ...printSettings, copies: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE7FF] bg-white"
                  >
                    <option value={1}>1 Repeat (Single Proof)</option>
                    <option value={5}>5 Repeats (Production Test)</option>
                    <option value={10}>10 Repeats</option>
                    <option value={50}>50 Repeats (Web Run)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Print Orientation</label>
                  <select
                    value={printSettings.orientation}
                    onChange={(e) => setPrintSettings({ ...printSettings, orientation: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE7FF] bg-white capitalize"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Include Optical Calibration Anchor</span>
                  <input
                    type="checkbox"
                    checked={printSettings.showAnchor}
                    onChange={(e) => setPrintSettings({ ...printSettings, showAnchor: e.target.checked })}
                    className="rounded text-[#1454E8]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Include Slitter Cut Boundaries & Eye-Marks</span>
                  <input
                    type="checkbox"
                    checked={printSettings.showCutLines}
                    onChange={(e) => setPrintSettings({ ...printSettings, showCutLines: e.target.checked })}
                    className="rounded text-[#1454E8]"
                  />
                </label>
              </div>

              {/* Real-time Web Length Calculation */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[#173B70] text-[11px] flex justify-between">
                <span>Total Web Run Length:</span>
                <span className="font-mono font-bold">
                  {(printSettings.copies * printSettings.repeatLength).toLocaleString()} mm ({((printSettings.copies * printSettings.repeatLength) / 1000).toFixed(2)} m)
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPrintSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPrintSettingsOpen(false);
                  setIsPrintPreviewOpen(true);
                }}
                className="px-5 py-2 bg-[#1454E8] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                Proceed to Print Preview <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          NEW FEATURE: STEP 5 — DEDICATED INDUSTRIAL PRINT PREVIEW
      ───────────────────────────────────────────────────────────── */}
      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#DCE7FF] space-y-5 my-8">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#1454E8] uppercase tracking-wider block">
                  Industrial Print Workflow • Step 2 of 2
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#10131B]">
                  Print-Ready Artwork Proof
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPrintPreviewOpen(false);
                    setIsPrintSettingsOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Adjust Settings
                </button>
                <button
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Artwork Proof Container */}
            <div className="printable-artwork-container bg-white border-2 border-dashed border-slate-300 p-6 rounded-2xl space-y-4">
              {/* Header Details */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 text-xs">
                <div>
                  <span className="font-display font-bold text-lg text-[#10131B] block">
                    STRIPLY PHARMACEUTICAL FOIL REPEAT PROOF
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Drug: {batchEntries[0]?.medicine_name} • ID: {batchEntries[0]?.medicine_id} • Batch: {batchEntries[0]?.manufacturer_batch_number}
                  </span>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  <div>WIDTH: {printSettings.foilWidth}.00 mm</div>
                  <div>REPEAT: {printSettings.repeatLength}.00 mm ({printSettings.copies} REPEATS)</div>
                  <div>SIGNATURE: SHA256-RP-PRO-v2.4</div>
                </div>
              </div>

              {/* Visualized Print Web with Repeats */}
              <div className="space-y-4 py-2">
                {Array.from({ length: Math.min(3, printSettings.copies) }).map((_, rIdx) => (
                  <div key={rIdx} className="border border-slate-300 rounded-xl p-4 bg-[#FAFCFF] space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>EYEMARK L-{rIdx + 1}</span>
                      <span className="text-[#1454E8] font-bold">CYLINDER REPEAT 0{rIdx + 1} OF 0{printSettings.copies}</span>
                      <span>EYEMARK R-{rIdx + 1}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((col) => (
                        <div key={col} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative">
                          <div className="text-[9px] font-mono text-slate-400 flex justify-between mb-1.5">
                            <span>LANE {col}</span>
                            <span>{batchEntries[0]?.striply_batch_id || 'ST-000001'}</span>
                          </div>
                          <div className="space-y-1 py-1">
                            <div className="h-1.5 bg-[#EF4444] rounded-sm"></div>
                            <div className="h-1.5 bg-[#10B981] rounded-sm"></div>
                            <div className="h-1.5 bg-[#1454E8] rounded-sm"></div>
                            <div className="h-1.5 bg-[#F59E0B] rounded-sm"></div>
                          </div>
                          {printSettings.showAnchor && (
                            <div className="absolute right-1.5 top-2 bottom-2 w-1 bg-black rounded-sm"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Regulatory Pharmaceutical Warning */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 font-mono">
                NOTICE: FOR INDUSTRIAL ROTOGRAVURE / FLEXOGRAPHIC LIDDING FOIL WEB PRESSES ONLY. CONFORMS TO ISO 15378 & 21 CFR 211. DESKTOP PRINTERS ARE INADEQUATE FOR PHYSICAL PHARMACEUTICAL REPETITION.
              </div>
            </div>

            {/* Print & Export Actions */}
            <div className="no-print pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Print resolution: 600+ DPI vector equivalent
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSvg}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Export Vector SVG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-[#1454E8] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print Proof Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CAMERA SCANNER MODAL (LIVE COMPUTER VISION HUD)
      ───────────────────────────────────────────────────────────── */}
      {isScanningModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 text-white shadow-2xl relative">
            <button
              onClick={() => setIsScanningModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Viewfinder Frame */}
            <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              {/* Corner Reticle Brackets */}
              <div className="absolute inset-8 pointer-events-none border-2 border-blue-500/50 rounded-2xl">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#1454E8] -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#1454E8] -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#1454E8] -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#1454E8] -mb-0.5 -mr-0.5"></div>
              </div>

              {/* Laser Scanning Bar */}
              <div className="absolute inset-x-8 h-0.5 bg-[#1454E8] shadow-[0_0_12px_#1454e8] animate-pulse"></div>

              {/* Viewfinder Telemetry */}
              <div className="text-center z-10 px-4">
                {scannerStep === 'permission' && (
                  <div className="text-xs text-blue-300 font-mono">Calibrating Camera Sensor & Optical Homography...</div>
                )}
                {scannerStep === 'scanning' && (
                  <div className="text-xs text-slate-300 font-mono">Align 4-colour RP Lines pattern within frame</div>
                )}
                {scannerStep === 'detected' && (
                  <div className="text-xs text-emerald-400 font-mono">Calibration Anchor Located • De-glaring Foil...</div>
                )}
                {scannerStep === 'decoding' && (
                  <div className="text-xs text-amber-400 font-mono">Sampling CIE L*a*b* Channels & Signature...</div>
                )}
                {scannerStep === 'result' && (
                  <div className="text-xs text-emerald-400 font-mono font-bold">Pattern Resolved</div>
                )}
              </div>
            </div>

            {/* Result Panel with 4 Explicit States */}
            <div className="p-6 space-y-4">
              {scannerStep === 'result' ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        Striply ID: {scanResult.medicine_id}
                      </span>
                      <h3 className="font-display font-bold text-xl text-white mt-1">
                        {scanResult.medicine_name}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scanResult.state === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : scanResult.state === 'near_expiry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : scanResult.state === 'expired' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-700 text-slate-300'}`}>
                      {scanResult.state.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  {/* Verification Detail Table */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Composition:</span>
                      <span className="font-medium text-slate-200">{scanResult.composition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Manufacturer:</span>
                      <span className="font-medium text-slate-200">{scanResult.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Manufacturer Lot:</span>
                      <span className="font-mono text-slate-200">{scanResult.batch_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certified Expiry:</span>
                      <span className="font-medium text-slate-200">{scanResult.expiry_date}</span>
                    </div>
                  </div>

                  {/* Safety Guidance */}
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-200">
                    Important: Always follow dosage and medical advice prescribed by your doctor. RP Lines certifies packaging identity and shelf life.
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsScanningModalOpen(false);
                        setCustomerTab('medicines');
                      }}
                      className="flex-1 py-3 bg-[#1454E8] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all text-center"
                    >
                      Save to My Medicines
                    </button>
                    <button
                      onClick={() => startCameraScan('verified')}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
                    >
                      Scan Another
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#1454E8] mx-auto mb-2" />
                  <span className="text-xs text-slate-400">Demodulating 4 optical lines and anchor...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          OPTIONAL: PUBLIC LANDING PAGE (ACCESSIBLE VIA PORTAL SWITCHER)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'landing' && (
        <div className="min-h-screen bg-[#F4F6FC] pt-16">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-[#1454E8] font-bold text-xs uppercase tracking-wider mb-4 inline-block">
              Clinical Drug Traceability Platform
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#10131B] tracking-tight mb-4">
              Every Strip. Every Dose. Less Waste.
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Striply prints deterministic RP Lines (Recognition Pattern Lines) directly onto blister foils, giving every cut pocket an independent machine-readable identity.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCurrentView('auth')}
                className="px-6 py-3 bg-[#1454E8] text-white font-bold rounded-2xl text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                Sign In to Striply <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('splash')}
                className="px-6 py-3 bg-white text-[#10131B] font-bold rounded-2xl text-sm border border-[#DCE7FF] shadow-sm hover:bg-slate-50 transition-all"
              >
                View Splash Animation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
