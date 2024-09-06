import React from 'react'
import {toast} from 'react-toastify'
import {get} from 'sr/utils/axios'
interface PayloadType {
  getAll?: boolean
  isActive?: boolean
  farmProfileId?: string
  farmerId?: string
}
const filterPayload = (payload: PayloadType) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null)
  )
}
export const fetchCrop = async (payload: PayloadType) => {
  try {
    const filtetedPayload = filterPayload(payload)
    const res = await get<any>('/crop-profile', filtetedPayload)
    return res
  } catch (e: any) {
    toast.error(e.message)
  }
}
