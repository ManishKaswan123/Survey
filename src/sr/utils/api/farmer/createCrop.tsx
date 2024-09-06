import React from 'react'
import {toast} from 'react-toastify'
import {patch, post} from 'sr/utils/axios'

export const createCrop = async (payload: any) => {
  try {
    const res = await post<any>(`/crop-profile`, payload)
    if (res?.status === 'success') {
      toast.success('Crop created Successfully')
    }
    return res
  } catch (e: any) {
    toast.error(e.message)
  }
}
