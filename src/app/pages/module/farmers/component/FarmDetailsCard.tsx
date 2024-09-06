import React, { useEffect, useMemo, useState } from 'react'
import { FarmType } from './FarmType'
import ViewFarmLocation from 'sr/layout/GoogleMap/ViewFarmLocation'
import { fetchCrop } from 'sr/utils/api/farmer/fetchCrop'
import formatDate from 'sr/utils/helpers/formatDate'
import DynamicModal from 'sr/helpers/ui-components/DynamicPopUpModal'
import { FieldsArray } from 'sr/constants/fields'
import { fetchSeason } from 'sr/utils/api/fetchSeason'
import { updateCrop } from 'sr/utils/api/farmer/updateCrop'
import { useSelector } from 'react-redux'
import { RootState } from 'sr/redux/store'
import { useActions } from 'sr/utils/helpers/useActions'
interface PropsType {
  item: FarmType
  type: string
}
interface FarmLandPlotting {
  type: 'Polygon'
  coordinates: number[][][]
}

interface PinFarmLocation {
  type: 'Point'
  coordinates: number[]
}

interface FarmProfile {
  farmLandPlotting: FarmLandPlotting
  pinFarmLocation: PinFarmLocation
  farmName: string
  area: number
  isActive: boolean
  farmerId: string
  createdAt: string
  updatedAt: string
  id: string
}

interface Season {
  seasonName: string
  year: number
  details: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  id: string
}

interface Crop {
  cropName: string
  seedType: string
  sowingDate: string
  transplantationDate: string
  expectedHarvestDate: string
  fertilizerUsed: string
  pesticideWeedicideFungicideUsed: string
  isActive: boolean
  farmerId: string
  farmProfileId: FarmProfile
  seasonId: Season
  createdAt: string
  updatedAt: string
  id: string
}

export const FarmDetailsCard = ({ item, type }: PropsType) => {
  const [showDetails, setShowDetails] = useState(false)
  const [pinFarmLocation, setpinFarmLocation] = useState<any>()
  const [formLandPlotting, setFormLandPlotting] = useState<any>()
  const [farmId, setFarmid] = useState<string>('')
  const [cropData, setCropData] = useState<Crop[]>([])
  const [selectedData, setSelectedData] = useState<any>({})
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [season, setSeason] = useState()
  const appConfigData = useSelector((state: RootState) => state.appConfig)
  const [dropdownData, setDropDownData] = useState<any>()
  const { fetchAppConfigData } = useActions()
  const isAppSubmitted = true
  useEffect(() => {
    if (item?.pinFarmLocation?.coordinates?.length > 1) {
      setpinFarmLocation({
        lng: item?.pinFarmLocation?.coordinates[1],
        lat: item?.pinFarmLocation?.coordinates[0],
      })
    }
  }, [item?.pinFarmLocation])
  useEffect(() => {
    if (item?.farmLandPlotting?.coordinates?.length > 0) {
      /* const googleMapsCoordinates = item?.farmLandPlotting?.coordinates[0].map(
        (coordPair, index) => ({
          lat: coordPair[0],
          lng: coordPair[1],
        })
      ) */
      setFormLandPlotting(item?.farmLandPlotting?.coordinates)
    }
  }, [item?.farmLandPlotting])

  const fetchDataIfNeeded = async () => {
    // console.log('insode fetch data if needed')
    if (appConfigData.status != 'succeeded') {
      // console.log('insode fetch data if needed')
      fetchAppConfigData()
      // console.log('appConfigData', appConfigData)
    }
  }
  useEffect(() => {
    fetchDataIfNeeded().then(() => {
      setDropDownData(appConfigData?.data.config?.DROP_DOWN_DATA?.en)
    })
  }, [appConfigData.status])
  const getCrop = async (farmId: string) => {
    try {
      const res = await fetchCrop({
        farmProfileId: farmId,
        farmerId: item?.farmerId,
        getAll: true,
        isActive: true,
      })
      if (res?.status === 'success') {
        setCropData(res?.results?.results)
      }
    } catch (e: any) { }
  }
  useEffect(() => {
    if (farmId) {
      getCrop(farmId)
    }
  }, [farmId])
  useEffect(() => {
    console.log(type)
  }, [type])
  const handleEditData = async (payload: any) => {
    // Ensure the dates are converted to ISO 8601 format strings
    payload = {
      ...payload,
      sowingDate: new Date(payload.sowingDate).toISOString(),
      transplantationDate: new Date(payload.transplantationDate).toISOString(),
      expectedHarvestDate: new Date(payload.expectedHarvestDate).toISOString(),
      farmerId: selectedData?.farmerId,
      farmProfileId: selectedData?.farmProfileId.id,
    }

    console.log('payload is  : ', payload)

    try {
      // Assume updateCrop is a function that updates crop data
      const res = await updateCrop(payload, selectedData?.id)
      if (res?.status === 'success') {
        // Refresh the crop data after successful update
        getCrop(farmId)
      }
    } catch (e) {
      // Handle errors here, e.g., show an error message
      console.error('Error updating crop:', e)
    }
  }

  useEffect(() => {
    const getSeason = async () => {
      try {
        const res = await fetchSeason({ getAll: true, sortBy: 'seasonName' })
        if (res?.status === 'success') {
          setSeason(res?.results?.results)
        }
      } catch (e) { }
    }
    getSeason()
  }, [])
  const updateFields: FieldsArray = useMemo(
    () => [
      {
        type: 'dropdown',
        label: 'cropName',
        name: dropdownData?.cropName,
        topLabel: 'cropName',
        placeholder: 'Select Crop',
        labelKey: 'label',
        id: 'value',
        // type: 'text',
        // label: 'Crop Name',
        // name: 'cropName',
        // placeholder: 'Enter Crop Name',
        // required: true,
      },
      {
        type: 'dropdown',
        label: 'seedType',
        name: dropdownData?.seedType,
        topLabel: 'seedType',
        placeholder: 'Select Seed Type',
        labelKey: 'label',
        id: 'value',
        // type: 'text',
        // label: 'Seed Type',
        // name: 'seedType',
        // placeholder: 'Enter Seed Type',
        // required: true,
      },
      {
        type: 'datetime-local',
        label: 'Sowing Date',
        name: 'sowingDate',
        placeholder: 'Enter Sowing Date',
      },
      {
        type: 'datetime-local',
        label: 'Transplantation Date',
        name: 'transplantationDate',
        placeholder: 'Enter Transplantation Date',
      },
      {
        type: 'datetime-local',
        label: 'Expected Harvest Date',
        name: 'expectedHarvestDate',
        placeholder: 'Enter Transplantation Date',
      },
      {
        type: 'dropdown',
        label: 'fertilizerUsed',
        name: dropdownData?.fertilizerUsed,
        topLabel: 'fertilizerUsed',
        placeholder: 'Select fertilizer',
        labelKey: 'label',
        id: 'value',
        // type: 'text',
        // label: 'Fertilizers Used',
        // name: 'fertilizerUsed',
        // placeholder: 'Enter Fertilizers Used',
        // required: true,
      },
      {
        type: 'dropdown',
        label: 'pesticideWeedicideFungicideUsed',
        name: dropdownData?.pesticideWeedicideFungicideUsed,
        topLabel: 'Pesticide Weedicide Fungicide Used',
        placeholder: 'Select Pesticide Weedicide Fungicide',
        labelKey: 'label',
        id: 'value',
        // type: 'text',
        // label: 'Pesticide Weedicide Fungicide Used',
        // name: 'pesticideWeedicideFungicideUsed',
        // placeholder: 'Enter Pesticide Weedicide Fungicide Used',
        // required: true,
      },
      {
        type: 'dropdown',
        label: 'seasonId',
        name: season,
        topLabel: 'Season',
        placeholder: 'Select Season',
        labelKey: 'seasonName',
        id: 'id',
        // type: 'text',
        // label: 'Season Id',
        // name: 'seasonId',
        // placeholder: 'Enter Season Id',
        // required: true,
      },
    ],
    [season, dropdownData]
  )

  return (
    <div className='bg-white rounded-lg p-3 w-full mx-6 my-3'>
      <div onClick={() => setFarmid(item?.id)} className='flex justify-between space-x-4 mx-6'>
        <div className='flex justify-between flex-1'>
          <div>
            <span className='font-semibold'>Farm Name:</span> {item?.farmName}
          </div>
          <div>
            <span className='font-semibold'>Area(in acres):</span> {item?.area}
          </div>
        </div>
        <div onClick={() => setShowDetails(!showDetails)} className='cursor-pointer'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
          </svg>
        </div>
      </div>
      {showDetails && (
        <div>
          {type === 'Crop Profile' ? (
            cropData?.map((data) => (
              <div className='relative rounded-lg p-3 w-full mx-6 my-3 border-t-4 border-gray-100'>
                <div className='absolute top-3 right-5'>
                  <svg
                    onClick={() => {
                      setSelectedData(data)
                      setIsUpdateModalOpen(true)
                    }}
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 cursor-pointer'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                    />
                  </svg>
                </div>
                <div className='flex flex-wrap justify-between'>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Crop Name:</span> {data?.cropName}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Seed Type:</span> {data?.seedType}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Sowing Date:</span>{' '}
                    {formatDate(data?.sowingDate)}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Transplant Date:</span>{' '}
                    {formatDate(data?.transplantationDate)}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Expected Harvest Date:</span>{' '}
                    {formatDate(data?.expectedHarvestDate)}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Fertilizer Used:</span> {data?.fertilizerUsed}
                  </div>
                  <div className='w-full lg:w-1/3 mb-4'>
                    <span className='font-semibold'>Pesticide Weedicide Fungicide Used:</span>{' '}
                    {data?.pesticideWeedicideFungicideUsed}
                  </div>
                </div>
                <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                  <table className='min-w-full leading-normal'>
                    <thead>
                      <tr>
                        <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                          Season Name
                        </th>
                        <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                          Year
                        </th>
                        <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='odd:bg-white even:bg-gray-50'>
                        <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                          {data?.seasonId?.seasonName}
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                          {data?.seasonId?.year}
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                          {data?.seasonId?.details}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className='flex justify-between space-x-3 mt-3'>
              {pinFarmLocation && <ViewFarmLocation
                pinFarmLocation={pinFarmLocation}
                currentModel={''}
              />}
              {formLandPlotting?.length > 0 && <ViewFarmLocation
                farmLandPlotting={formLandPlotting}
                currentModel={'FarmLandPlotting'}
              />}
            </div>
          )}
        </div>
      )}
      {isUpdateModalOpen && (
        <DynamicModal
          label='Update Crop'
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={updateFields}
          defaultValues={selectedData}
          onSubmit={handleEditData}
        />
      )}
    </div>
  )
}
