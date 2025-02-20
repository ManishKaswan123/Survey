import ApiResponse from 'sr/models/ApiResponse'
import {get, patch, post} from 'sr/utils/axios/index'
import {alertService} from 'sr/utils/services/alert.service'
import {toast} from 'react-toastify'

export const updateUser = async (payload: any, id: string) => {
  try {
    const res = await patch<any>(`/users/${id}`, payload)
    // console.log('update response is : ', res)
    if (res.status == 'success') {
      toast.success('Data updated successfully')
      return res
    }
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
