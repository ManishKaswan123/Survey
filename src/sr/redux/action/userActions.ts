// src/actions/userActions.ts
import {createAsyncThunk} from '@reduxjs/toolkit'
import {fetchUser} from 'sr/utils/api/fetchUser'
interface PayloadType {
  role?: string
  getAll?: boolean
  projectBy?: string
}

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (payload: PayloadType) => {
    const response = await fetchUser({
      role: payload.role || 'vle',
      getAll: payload.getAll || true,
      projectBy: payload.projectBy || 'firstName,lastName,id',
    })

    return {
      data: response.results,
      totalUsers: response.results.results.length,
    }
  }
)
