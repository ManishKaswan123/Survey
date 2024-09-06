import {get, post} from 'sr/utils/axios/index'
import {toast} from 'react-toastify'

export const createContactUs = async (payload: any) => {
  try {
    const res = await post<any>('/contact-us', payload)
    return res
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
