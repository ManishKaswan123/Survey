import ApiResponse from 'sr/models/ApiResponse'
import {get} from 'sr/utils/axios/index'
import {toast} from 'react-toastify'

interface PayloadType {
  limit?: number
  page?: number
  role?: string
  firstName?: string
  isEmailVerified?: boolean
  sortBy?: string
  projectBy?: string
  getAll?: boolean
}

const filterPayload = (payload: PayloadType) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null)
  )
}

export const fetchUser = async (payload: PayloadType) => {
  try {
    const filteredPayload = filterPayload(payload)
    const res = await get<any>(`/users`, filteredPayload)
    console.log('res', res)
    if (res.status == 'success') {
      return res
    }
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
export const fetchSingleUser = async (payload: any) => {
  try {
    const res = await get<any>(`/users/${payload}`, {})
    return res
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
