import mongoose, { Document } from 'mongoose';
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
export declare const AppointmentForm: mongoose.Model<IAppointmentForm, {}, {}, {}, mongoose.Document<unknown, {}, IAppointmentForm, {}, {}> & IAppointmentForm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AppointmentForm.d.ts.map