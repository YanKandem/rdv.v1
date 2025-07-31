import express from 'express';
import { AppointmentForm } from '../models/AppointmentForm';
import { auth, adminAuth } from '../middleware/auth';

// Extend Request interface to include user
interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Get all forms (published ones for regular users, all for admins)
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.header('Authorization'); // Simple check for auth
    const query = isAdmin ? {} : { status: 'published' };
    
    const forms = await AppointmentForm.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single form
router.get('/:id', async (req, res) => {
  try {
    const form = await AppointmentForm.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create form (admin only)
router.post('/', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, fields, appointmentType } = req.body;
    
    const form = new AppointmentForm({
      title,
      description,
      fields,
      appointmentType,
      createdBy: req.user?._id
    });
    
    await form.save();
    await form.populate('createdBy', 'name email');
    
    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update form (admin only)
router.put('/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, fields, appointmentType, status } = req.body;
    
    const form = await AppointmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    form.title = title || form.title;
    form.description = description || form.description;
    form.fields = fields || form.fields;
    form.appointmentType = appointmentType || form.appointmentType;
    form.status = status || form.status;
    
    await form.save();
    await form.populate('createdBy', 'name email');
    
    res.json(form);
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Publish form (admin only)
router.post('/:id/publish', adminAuth, async (req: AuthRequest, res) => {
  try {
    const form = await AppointmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    form.status = 'published';
    await form.save();
    await form.populate('createdBy', 'name email');
    
    res.json(form);
  } catch (error) {
    console.error('Publish form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete form (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const form = await AppointmentForm.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;