import React from "react";
import { toast } from "react-toastify";
import { get } from "sr/utils/axios";
interface PayloadType {
    getAll?:boolean
    sortBy?:string
    limit?: Number
    page?: Number
}
const filterPayload = (payload: PayloadType) => {
    return Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null)
    )
  }
export const fetchSeason = async (payload:PayloadType) => {
    try {
        const filtetedPayload = filterPayload(payload)
      const res = await get<any>('/season', filtetedPayload)
      return res
        }
        catch(e:any){
            toast.error(e.message)
        }
};
