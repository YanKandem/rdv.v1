import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { appointmentService } from '../../services/appointmentService'

export interface TimeSlot {
  id: string
  start: string
  end: string
  available: boolean
  appointmentId?: string
}

export interface AppointmentType {
  id: string
  name: string
  duration: number // in minutes
  description: string
  formId?: string
  active: boolean
}

export interface Appointment {
  id: string
  appointmentTypeId: string
  userId?: string
  clientInfo: {
    name: string
    email: string
    phone: string
    [key: string]: any // Additional form data
  }
  date: string
  timeSlot: TimeSlot
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  formData: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface AppointmentState {
  appointments: Appointment[]
  appointmentTypes: AppointmentType[]
  timeSlots: Record<string, TimeSlot[]> // date -> slots
  currentAppointment: Appointment | null
  isLoading: boolean
  error: string | null
}

const initialState: AppointmentState = {
  appointments: [],
  appointmentTypes: [],
  timeSlots: {},
  currentAppointment: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchAppointmentTypes = createAsyncThunk(
  'appointments/fetchAppointmentTypes',
  async () => {
    return await appointmentService.getAppointmentTypes()
  }
)

export const fetchTimeSlots = createAsyncThunk(
  'appointments/fetchTimeSlots',
  async ({ date, appointmentTypeId }: { date: string; appointmentTypeId: string }) => {
    const slots = await appointmentService.getTimeSlots(date, appointmentTypeId)
    return { date, slots }
  }
)

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    return await appointmentService.bookAppointment(appointmentData)
  }
)

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    return await appointmentService.getAppointments()
  }
)

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ id, status }: { id: string; status: Appointment['status'] }) => {
    return await appointmentService.updateAppointmentStatus(id, status)
  }
)

export const createAppointmentType = createAsyncThunk(
  'appointments/createAppointmentType',
  async (appointmentType: Omit<AppointmentType, 'id'>) => {
    return await appointmentService.createAppointmentType(appointmentType)
  }
)

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearTimeSlots: (state) => {
      state.timeSlots = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentTypes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAppointmentTypes.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointmentTypes = action.payload
      })
      .addCase(fetchAppointmentTypes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch appointment types'
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.timeSlots[action.payload.date] = action.payload.slots
      })
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments.push(action.payload)
        state.currentAppointment = action.payload
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to book appointment'
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
      })
      .addCase(createAppointmentType.fulfilled, (state, action) => {
        state.appointmentTypes.push(action.payload)
      })
  },
})

export const {
  setCurrentAppointment,
  clearError,
  clearTimeSlots,
} = appointmentSlice.actions

export default appointmentSlice.reducer