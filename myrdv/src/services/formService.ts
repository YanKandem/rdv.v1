import api from './api';
import { AppointmentForm } from '../features/forms/formBuilderSlice';

export interface CreateFormData {
  title: string;
  description: string;
  appointmentType: string;
  fields: any[];
}

export const formService = {
  getForms: async (): Promise<AppointmentForm[]> => {
    const response = await api.get('/forms');
    return response.data;
  },

  getForm: async (id: string): Promise<AppointmentForm> => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  createForm: async (data: CreateFormData): Promise<AppointmentForm> => {
    const response = await api.post('/forms', data);
    return response.data;
  },

  updateForm: async (id: string, data: Partial<CreateFormData>): Promise<AppointmentForm> => {
    const response = await api.put(`/forms/${id}`, data);
    return response.data;
  },

  publishForm: async (id: string): Promise<AppointmentForm> => {
    const response = await api.post(`/forms/${id}/publish`);
    return response.data;
  },

  deleteForm: async (id: string): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },
};