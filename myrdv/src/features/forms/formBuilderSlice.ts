import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { formService } from '../../services/formService'

export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'time' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface AppointmentForm {
  id: string
  title: string
  description: string
  fields: FormField[]
  status: 'draft' | 'published' | 'archived'
  appointmentType: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface FormBuilderState {
  forms: AppointmentForm[]
  currentForm: AppointmentForm | null
  isLoading: boolean
  error: string | null
  draggedField: FormField | null
}

const initialState: FormBuilderState = {
  forms: [],
  currentForm: null,
  isLoading: false,
  error: null,
  draggedField: null,
}

// Async thunks
export const fetchForms = createAsyncThunk(
  'formBuilder/fetchForms',
  async () => {
    return await formService.getForms()
  }
)

export const saveForm = createAsyncThunk(
  'formBuilder/saveForm',
  async (form: Partial<AppointmentForm>) => {
    return await formService.createForm(form as any)
  }
)

export const updateForm = createAsyncThunk(
  'formBuilder/updateForm',
  async ({ id, ...form }: Partial<AppointmentForm> & { id: string }) => {
    return await formService.updateForm(id, form)
  }
)

export const publishForm = createAsyncThunk(
  'formBuilder/publishForm',
  async (id: string) => {
    return await formService.publishForm(id)
  }
)

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<AppointmentForm | null>) => {
      state.currentForm = action.payload
    },
    updateCurrentForm: (state, action: PayloadAction<Partial<AppointmentForm>>) => {
      if (state.currentForm) {
        state.currentForm = { ...state.currentForm, ...action.payload }
      }
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload)
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(
          field => field.id !== action.payload
        )
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.id)
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.field
          }
        }
      }
    },
    reorderFields: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      if (state.currentForm) {
        const { startIndex, endIndex } = action.payload
        const result = Array.from(state.currentForm.fields)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        state.currentForm.fields = result
      }
    },
    setDraggedField: (state, action: PayloadAction<FormField | null>) => {
      state.draggedField = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.isLoading = false
        state.forms = action.payload
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch forms'
      })
      .addCase(saveForm.fulfilled, (state, action) => {
        state.forms.push(action.payload)
        state.currentForm = action.payload
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        const index = state.forms.findIndex(f => f.id === action.payload.id)
        if (index !== -1) {
          state.forms[index] = action.payload
        }
        state.currentForm = action.payload
      })
      .addCase(publishForm.fulfilled, (state, action) => {
        const index = state.forms.findIndex(f => f.id === action.payload.id)
        if (index !== -1) {
          state.forms[index] = action.payload
        }
        if (state.currentForm?.id === action.payload.id) {
          state.currentForm = action.payload
        }
      })
  },
})

export const {
  setCurrentForm,
  updateCurrentForm,
  addField,
  removeField,
  updateField,
  reorderFields,
  setDraggedField,
  clearError,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer