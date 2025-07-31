import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointmentType extends Document {
  name: string;
  duration: number; // in minutes
  description: string;
  formId?: mongoose.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentTypeSchema = new Schema<IAppointmentType>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    trim: true
  },
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'AppointmentForm'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const AppointmentType = mongoose.model<IAppointmentType>('AppointmentType', appointmentTypeSchema);