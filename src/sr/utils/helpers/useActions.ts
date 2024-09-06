// src/hooks/useActions.ts
import {useDispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUserData} from '../../redux/action/userActions'
import {fetchStateData} from 'sr/redux/action/stateActions'
import {fetchDistrict} from '../api/fetchDistrict'
import {fetchDistrictData} from 'sr/redux/action/districtActions'
import {fetchAppConfigData} from 'sr/redux/action/appConfigActions'
import {fetchDashboardData} from 'sr/redux/action/dashboardActions'
import {setGoogleMapData} from 'sr/redux/slice/googleMapSlice'

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(
    {
      fetchUserData,
      fetchDistrictData,
      fetchStateData,
      fetchAppConfigData,
      fetchDashboardData,
      setGoogleMapData,
    },
    dispatch
  )
}
