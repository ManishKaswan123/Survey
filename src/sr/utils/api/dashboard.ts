import {toast} from 'react-toastify'
import {get} from '../axios'

export const fetchDashboardCounts = async () => {
  try {
    const res = await get<any>(`/dashboard/summary`, {})
    if (res.status != 'success') {
      toast.error('error while fetching counts')
      return null
    }
    return res.results
  } catch (e: any) {
    toast.error(e.message)
    return []
  }
}
