import mongoose, { Document } from 'mongoose';
export interface IAppointmentType extends Document {
    name: string;
    duration: number;
    description: string;
    formId?: mongoose.Types.ObjectId;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AppointmentType: mongoose.Model<IAppointmentType, {}, {}, {}, mongoose.Document<unknown, {}, IAppointmentType, {}, {}> & IAppointmentType & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AppointmentType.d.ts.map