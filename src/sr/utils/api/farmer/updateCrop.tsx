import React from 'react'
import {toast} from 'react-toastify'
import {patch} from 'sr/utils/axios'
export const updateCrop = async (payload: any, id: any) => {
  try {
    const res = await patch<any>(`/crop-profile/${id}`, payload)
    if (res?.status === 'success') {
      toast.success('Crop Updated Successfully')
    }
    return res
  } catch (e: any) {
    toast.error(e.message)
  }
}
