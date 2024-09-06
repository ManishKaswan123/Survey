import React from 'react'
import {toast} from 'react-toastify'
import {get} from 'sr/utils/axios'
interface PayloadType {
  getAll?: boolean
  isActive?: boolean
  farmerId?: string
  projectBy?: string
}
const filterPayload = (payload: PayloadType) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null)
  )
}
export const fetchFarms = async (payload: PayloadType) => {
  try {
    const filtetedPayload = filterPayload(payload)
    const res = await get<any>('/farm-profile', filtetedPayload)
    return res
  } catch (e: any) {
    toast.error(e.message)
  }
}
