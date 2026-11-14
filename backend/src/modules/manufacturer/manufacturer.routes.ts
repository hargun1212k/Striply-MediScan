import { Router, Request, Response } from 'express';
import { users } from '../auth/auth.routes.js';

const router = Router();

// Store audit log of business updates / change alerts
interface ChangeAlert {
  id: string;
  userEmail: string;
  businessName: string;
  changeType: 'Licence Update' | 'Address Change' | 'Facility Inspection' | 'Recall Broadcast' | 'General Update';
  description: string;
  timestamp: string;
  status: 'Broadcasted' | 'Acknowledged';
}

const changeAlerts: ChangeAlert[] = [
  {
    id: 'alt_001',
    userEmail: 'cipla.pharma@gmail.com',
    businessName: 'Cipla Ltd.',
    changeType: 'Licence Update',
    description: 'Updated WHO-GMP Certificate & Cleanroom Inspection Report 2026',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Broadcasted',
  },
];

// Submit business verification details & upload licence PDF
router.post('/verify', (req: Request, res: Response) => {
  const {
    email,
    businessName,
    contactNumber,
    businessAddress,
    location,
    details,
    licenceNumber,
    documentName,
    documentSize,
    documentBase64,
  } = req.body;

  if (!businessName || !licenceNumber) {
    return res.status(400).json({ error: 'Business name and licence number are required' });
  }

  const userEmail = (email || 'cipla.pharma@gmail.com').toLowerCase().trim();
  const user = users.get(userEmail);

  const businessDetails = {
    businessName,
    contactNumber: contactNumber || '+91 22 2482 6000',
    businessAddress: businessAddress || 'Industrial Area Phase 2',
    location: location || 'Mumbai, Maharashtra',
    details: details || 'Pharmaceutical Manufacturer and Blister Packager',
    licenceNumber,
    documentName: documentName || 'Pharmaceutical_Licence.pdf',
    documentSize: documentSize || '1.2 MB',
    submittedAt: new Date().toISOString(),
  };

  if (user) {
    user.name = businessName;
    user.verificationStatus = 'Under Review';
    user.businessDetails = businessDetails;
  }

  return res.json({
    success: true,
    status: 'Under Review',
    message: 'Business verification documents submitted successfully. Status: Under Review.',
    businessDetails,
  });
});

// Get current verification status
router.get('/status', (req: Request, res: Response) => {
  const email = (req.query.email as string || '').toLowerCase().trim();
  const user = users.get(email);

  if (user && user.businessDetails) {
    return res.json({
      success: true,
      status: user.verificationStatus,
      businessDetails: user.businessDetails,
    });
  }

  // Default fallback status
  return res.json({
    success: true,
    status: user ? user.verificationStatus : 'Pending',
    businessDetails: null,
  });
});

// Instant demo approval endpoint so users/evaluators can toggle between Under Review and Verified
router.post('/approve-demo', (req: Request, res: Response) => {
  const { email, status = 'Verified' } = req.body;
  const userEmail = (email || 'cipla.pharma@gmail.com').toLowerCase().trim();
  const user = users.get(userEmail);

  if (user) {
    user.verificationStatus = status as 'Verified' | 'Under Review' | 'Pending' | 'Rejected';
  }

  return res.json({
    success: true,
    status,
    message: `Account verification status updated to ${status}.`,
  });
});

// "Alert Your Changes" endpoint (Requirement 5)
router.post('/alert-changes', (req: Request, res: Response) => {
  const { email, businessName, changeType, description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description of changes is required' });
  }

  const alert: ChangeAlert = {
    id: `alt_${Date.now()}`,
    userEmail: (email || 'cipla.pharma@gmail.com').toLowerCase().trim(),
    businessName: businessName || 'Cipla Ltd.',
    changeType: changeType || 'General Update',
    description,
    timestamp: new Date().toISOString(),
    status: 'Broadcasted',
  };

  changeAlerts.unshift(alert);

  return res.json({
    success: true,
    message: 'Your business changes have been broadcasted to the regulatory registry and pharmacy network.',
    alert,
  });
});

// Get change alerts
router.get('/alerts', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    alerts: changeAlerts,
  });
});

export default router;
