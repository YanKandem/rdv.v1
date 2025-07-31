import mongoose, { Document } from 'mongoose';
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
export declare const Appointment: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Appointment.d.ts.map