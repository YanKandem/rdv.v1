import api from './api';
import { AppointmentType } from '../features/appointments/appointmentSlice';

export interface CreateAppointmentTypeData {
  name: string;
  duration: number;
  description: string;
  formId?: string;
  active?: boolean;
}

export const appointmentService = {
  getAppointmentTypes: async (): Promise<AppointmentType[]> => {
    const response = await api.get('/appointment-types');
    return response.data;
  },

  getAppointmentType: async (id: string): Promise<AppointmentType> => {
    const response = await api.get(`/appointment-types/${id}`);
    return response.data;
  },

  createAppointmentType: async (data: CreateAppointmentTypeData): Promise<AppointmentType> => {
    const response = await api.post('/appointment-types', data);
    return response.data;
  },

  updateAppointmentType: async (id: string, data: Partial<CreateAppointmentTypeData>): Promise<AppointmentType> => {
    const response = await api.put(`/appointment-types/${id}`, data);
    return response.data;
  },

  deleteAppointmentType: async (id: string): Promise<void> => {
    await api.delete(`/appointment-types/${id}`);
  },

  getTimeSlots: async (date: string, appointmentTypeId: string) => {
    const response = await api.get(`/appointments/time-slots?date=${date}&appointmentTypeId=${appointmentTypeId}`);
    return response.data;
  },

  bookAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  cancelAppointment: async (id: string) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },
};