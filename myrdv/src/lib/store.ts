import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import formBuilderSlice from '../features/forms/formBuilderSlice'
import appointmentSlice from '../features/appointments/appointmentSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    formBuilder: formBuilderSlice,
    appointments: appointmentSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch