import mongoose, { Document, Schema } from 'mongoose';

export interface IFormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'time' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface IAppointmentForm extends Document {
  title: string;
  description: string;
  fields: IFormField[];
  status: 'draft' | 'published' | 'archived';
  appointmentType: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'phone', 'select', 'textarea', 'date', 'time', 'checkbox', 'radio'],
    required: true
  },
  label: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String],
  validation: {
    min: Number,
    max: Number,
    pattern: String
  }
});

const appointmentFormSchema = new Schema<IAppointmentForm>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fields: [formFieldSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  appointmentType: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const AppointmentForm = mongoose.model<IAppointmentForm>('AppointmentForm', appointmentFormSchema);