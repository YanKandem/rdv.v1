import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlot {
  start: string;
  end: string;
  available: boolean;
  appointmentId?: mongoose.Types.ObjectId;
}

export interface IAppointment extends Document {
  appointmentTypeId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
  date: Date;
  timeSlot: ITimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  formData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  start: { type: String, required: true },
  end: { type: String, required: true },
  available: { type: Boolean, default: true },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }
});

const appointmentSchema = new Schema<IAppointment>({
  appointmentTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'AppointmentType',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  clientInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: timeSlotSchema,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  formData: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);