import {remove} from 'sr/utils/axios/index'
import {toast} from 'react-toastify'

export const deleteCrop = async (payload: string) => {
  try {
    const res = await remove<any>(`/crop-profile/${payload}`)
    return res
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
