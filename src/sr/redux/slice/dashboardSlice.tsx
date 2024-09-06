// src/reducers/userReducer.ts
import {createSlice} from '@reduxjs/toolkit'
import {fetchDashboardData} from '../action/dashboardActions'

interface DashobardDataType {
  data?: {
    farmerCount: number
    vleCount: number
    farmCount: number
    farmArea: number
    districtCount: number
    villageCount: number
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DashobardDataType = {
  data: undefined,
  status: 'idle',
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload.data
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch user data'
      })
  },
})

export default dashboardSlice.reducer
