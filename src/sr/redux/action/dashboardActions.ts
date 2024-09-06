// src/actions/userActions.ts
import {createAsyncThunk} from '@reduxjs/toolkit'
import {fetchDashboardCounts} from 'sr/utils/api/dashboard'
export const fetchDashboardData = createAsyncThunk('dashboard/fetchDashboardData', async () => {
  const response = await fetchDashboardCounts()

  return {
    data: response,
  }
})
