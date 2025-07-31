import express from 'express';
import { AppointmentType } from '../models/AppointmentType';
import { adminAuth } from '../middleware/auth';

// Extend Request interface to include user
interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Get all appointment types
router.get('/', async (req, res) => {
  try {
    const appointmentTypes = await AppointmentType.find({ active: true })
      .populate('formId')
      .sort({ createdAt: -1 });
    
    res.json(appointmentTypes);
  } catch (error) {
    console.error('Get appointment types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single appointment type
router.get('/:id', async (req, res) => {
  try {
    const appointmentType = await AppointmentType.findById(req.params.id)
      .populate('formId');
    
    if (!appointmentType) {
      return res.status(404).json({ error: 'Appointment type not found' });
    }
    
    res.json(appointmentType);
  } catch (error) {
    console.error('Get appointment type error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create appointment type (admin only)
router.post('/', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { name, duration, description, formId, active } = req.body;
    
    const appointmentType = new AppointmentType({
      name,
      duration,
      description,
      formId,
      active: active !== undefined ? active : true
    });
    
    await appointmentType.save();
    await appointmentType.populate('formId');
    
    res.status(201).json(appointmentType);
  } catch (error) {
    console.error('Create appointment type error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update appointment type (admin only)
router.put('/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { name, duration, description, formId, active } = req.body;
    
    const appointmentType = await AppointmentType.findById(req.params.id);
    if (!appointmentType) {
      return res.status(404).json({ error: 'Appointment type not found' });
    }
    
    appointmentType.name = name || appointmentType.name;
    appointmentType.duration = duration || appointmentType.duration;
    appointmentType.description = description || appointmentType.description;
    appointmentType.formId = formId || appointmentType.formId;
    appointmentType.active = active !== undefined ? active : appointmentType.active;
    
    await appointmentType.save();
    await appointmentType.populate('formId');
    
    res.json(appointmentType);
  } catch (error) {
    console.error('Update appointment type error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete appointment type (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const appointmentType = await AppointmentType.findByIdAndDelete(req.params.id);
    if (!appointmentType) {
      return res.status(404).json({ error: 'Appointment type not found' });
    }
    
    res.json({ message: 'Appointment type deleted successfully' });
  } catch (error) {
    console.error('Delete appointment type error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;