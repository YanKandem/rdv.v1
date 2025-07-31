import express from 'express';
import { Appointment } from '../models/Appointment';
import { AppointmentType } from '../models/AppointmentType';
import { auth, adminAuth } from '../middleware/auth';

// Extend Request interface to include user
interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Generate time slots for a specific date and appointment type
const generateTimeSlots = (date: string, duration: number) => {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      if (hour * 60 + minute + duration <= endHour * 60) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + duration;
        const endHour_ = hour + Math.floor(endMinute / 60);
        const endMin = endMinute % 60;
        const endTime = `${endHour_.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        
        slots.push({
          id: `${date}-${startTime}`,
          start: startTime,
          end: endTime,
          available: true
        });
      }
    }
  }
  
  return slots;
};

// Get time slots for a specific date and appointment type
router.get('/time-slots', async (req, res) => {
  try {
    const { date, appointmentTypeId } = req.query;
    
    if (!date || !appointmentTypeId) {
      return res.status(400).json({ error: 'Date and appointment type ID are required' });
    }
    
    const appointmentType = await AppointmentType.findById(appointmentTypeId);
    if (!appointmentType) {
      return res.status(404).json({ error: 'Appointment type not found' });
    }
    
    // Generate all possible time slots
    const allSlots = generateTimeSlots(date as string, appointmentType.duration);
    
    // Get booked appointments for this date
    const bookedAppointments = await Appointment.find({
      date: new Date(date as string),
      appointmentTypeId,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    // Mark booked slots as unavailable
    const availableSlots = allSlots.map(slot => {
      const isBooked = bookedAppointments.some(apt => 
        apt.timeSlot.start === slot.start && apt.timeSlot.end === slot.end
      );
      return {
        ...slot,
        available: !isBooked
      };
    });
    
    res.json(availableSlots);
  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all appointments (admin can see all, users see their own)
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const query = isAdmin ? {} : { userId: req.user?._id };
    
    const appointments = await Appointment.find(query)
      .populate('appointmentTypeId', 'name duration')
      .populate('userId', 'name email')
      .sort({ date: -1, 'timeSlot.start': 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { appointmentTypeId, clientInfo, date, timeSlot, formData, userId } = req.body;
    
    // Check if appointment type exists
    const appointmentType = await AppointmentType.findById(appointmentTypeId);
    if (!appointmentType) {
      return res.status(404).json({ error: 'Appointment type not found' });
    }
    
    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      appointmentTypeId,
      'timeSlot.start': timeSlot.start,
      'timeSlot.end': timeSlot.end,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ error: 'Time slot is not available' });
    }
    
    const appointment = new Appointment({
      appointmentTypeId,
      userId,
      clientInfo,
      date: new Date(date),
      timeSlot,
      formData: formData || {},
      status: 'pending'
    });
    
    await appointment.save();
    await appointment.populate('appointmentTypeId', 'name duration');
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update appointment status (admin only)
router.put('/:id/status', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointment.status = status;
    await appointment.save();
    await appointment.populate('appointmentTypeId', 'name duration');
    await appointment.populate('userId', 'name email');
    
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel appointment
router.put('/:id/cancel', auth, async (req: AuthRequest, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user owns this appointment or is admin
    if (appointment.userId?.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    await appointment.populate('appointmentTypeId', 'name duration');
    
    res.json(appointment);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;