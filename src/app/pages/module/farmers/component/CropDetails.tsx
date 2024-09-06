import {useEffect, useMemo, useState} from 'react'
import {Button, Spinner} from 'sr/helpers'
import {fetchFarms} from 'sr/utils/api/farmer/fetchFarms'
import {FarmType} from './FarmType'
import {fetchCrop} from 'sr/utils/api/farmer/fetchCrop'
import {CropDetailsCard} from './CropDetailsCard'
import DynamicModal from 'sr/helpers/ui-components/DynamicPopUpModal'
import {FieldsArray} from 'sr/constants/fields'
import {toast} from 'react-toastify'
import {updateCrop} from 'sr/utils/api/farmer/updateCrop'
import {fetchSeason} from 'sr/utils/api/fetchSeason'
import {deleteCrop} from 'sr/utils/api/farmer/deleteCrop'
import {AiOutlinePlus} from 'react-icons/ai'
import {createCrop} from 'sr/utils/api/farmer/createCrop'
import {formatDateForInput} from 'sr/helpers/functions'
import {NoResults} from 'sr/helpers/ui-components/NoResults'
import {set} from 'react-hook-form'

export const CropDetails = ({setViewCrop, viewCrop, type, viewFarmerName}: any) => {
  const [loading, setLoading] = useState(false)
  const [farmIds, setFarmIds] = useState<any[]>([])
  const [data, setData] = useState<FarmType[]>([])
  const [selectedData, setSelectedData] = useState<any>()
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDataModified, setIsDataModified] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [season, setSeason] = useState<any>()
  const [farm, setFarm] = useState<any[]>([])

  const pesticideWeedicideFungicideUsed = useMemo(
    () => [
      {id: 'no', name: 'No'},
      {id: 'yes', name: 'Yes'},
    ],
    []
  )

  const fertilizerUsed = useMemo(
    () => [
      {id: 'no', name: 'No'},
      {id: 'yes', name: 'Yes'},
    ],
    []
  )

  const createFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Crop Name',
        name: 'cropName',
        placeholder: 'Enter Crop Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Seed Type',
        name: 'seedType',
        placeholder: 'Enter Seed Type',
        required: true,
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
        name: fertilizerUsed,
        topLabel: 'Fertilizer Used',
        placeholder: 'Enter Fertilizers Used',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'pesticideWeedicideFungicideUsed',
        name: pesticideWeedicideFungicideUsed,
        topLabel: 'Pesticide Weedicide Fungicide Used',
        placeholder: 'Select Pesticide Weedicide Fungicide',
      },

      {
        type: 'dropdown',
        label: 'farmProfileId',
        name: farm,
        topLabel: 'Farm Profile',
        placeholder: 'Select Farm',
        labelKey: 'farmName',
        id: 'id',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'seasonId',
        name: season,
        topLabel: 'Season',
        placeholder: 'Select Season',
        labelKey: 'seasonName',
        id: 'id',
      },
      {
        type: 'text',
        label: 'Farmer ',
        name: 'farmerId',
        placeholder: 'Farmer',
        required: true,
        disabled: true,
      },
    ],
    [season]
  )

  const updateFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Crop Name',
        name: 'cropName',
        placeholder: 'Enter Crop Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Seed Type',
        name: 'seedType',
        placeholder: 'Enter Seed Type',
        required: true,
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
        type: 'text',
        label: 'Fertilizers Used',
        name: 'fertilizerUsed',
        placeholder: 'Enter Fertilizers Used',
        required: true,
      },
      {
        type: 'text',
        label: 'Pesticide Weedicide Fungicide Used',
        name: 'pesticideWeedicideFungicideUsed',
        placeholder: 'Enter Pesticide Weedicide Fungicide Used',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'seasonId',
        name: season,
        topLabel: 'Season',
        placeholder: 'Select Season',
        labelKey: 'seasonName',
        id: 'id',
      },
    ],
    [season]
  )
  useEffect(() => {
    if (selectedData) {
      // console.log('selectedData', selectedData)
      setDefaultValues({
        ...selectedData,
        seasonId: selectedData?.seasonId?.id,
        sowingDate: formatDateForInput(selectedData.sowingDate),
        transplantationDate: formatDateForInput(selectedData.transplantationDate),
        expectedHarvestDate: formatDateForInput(selectedData.expectedHarvestDate),
      })
    }
  }, [selectedData])
  useEffect(() => {
    const getSeason = async () => {
      setLoading(true)
      const res = await fetchSeason({getAll: true, sortBy: 'seasonName'})
      if (res?.status === 'success') {
        setSeason(res?.results?.results)
      }
      // setLoading(false)
    }
    // setLoading(true)
    getSeason().then()
  }, [])

  useEffect(() => {
    setLoading(true)
    const getFarm = async () => {
      const res = await fetchFarms({
        farmerId: viewCrop,
        getAll: true,
        isActive: true,
        projectBy: 'farmName',
      })
      if (res?.status === 'success') {
        setFarm(res?.results?.results)
      }
      // setLoading(false)
    }
    if (viewCrop) {
      // setLoading(true)
      getFarm().then()
    }
  }, [viewCrop])

  const getFarm = async () => {
    // setLoading(true)
    const res = await fetchFarms({farmerId: viewCrop, getAll: true, isActive: true})

    const ids = res?.results?.results?.map((farm: any) => farm?.id)
    if (ids.length == 0) setLoading(false)
    setFarmIds(ids)
    // setLoading(false)
  }

  const getCrop = async () => {
    // setLoading(true)
    let allResults = []
    for (let i = 0; i < farmIds?.length; i++) {
      const res = await fetchCrop({
        farmProfileId: farmIds[i],
        farmerId: viewCrop,
        getAll: true,
        isActive: true,
      })

      if (res?.status === 'success') {
        allResults.push(res?.results?.results)
      }
    }
    setData(allResults)
    setLoading(false)
  }

  useEffect(() => {
    if (viewCrop) {
      // setLoading(true)
      getFarm().then()
    }
  }, [viewCrop])

  useEffect(() => {
    if (farmIds.length > 0) {
      // setLoading(true)
      getCrop().then()
    }
  }, [farmIds, isChanged])
  // useEffect(() => {
  //   if (season && farm.length > 0 && farmIds.length > 0 && data.length > 0) setLoading(false)
  // }, [season, farm, farmIds, data])

  const handleCreateCrop = async (payload: any) => {
    try {
      // setLoading(true)
      payload = {
        ...payload,
        sowingDate: new Date(payload.sowingDate).toISOString(),
        transplantationDate: new Date(payload.transplantationDate).toISOString(),
        expectedHarvestDate: new Date(payload.expectedHarvestDate).toISOString(),
        farmerId: viewCrop,
      }
      await createCrop(payload)

      setIsChanged(!isChanged)
    } catch (e) {
      console.error('Failed to create crop', e)
    } finally {
      // setLoading(false)
      setIsCreateModalOpen(false)
    }
  }

  const handleEditCrop = async (payload: any) => {
    try {
      payload = {
        ...payload,
        sowingDate: new Date(payload.sowingDate).toISOString(),
        transplantationDate: new Date(payload.transplantationDate).toISOString(),
        expectedHarvestDate: new Date(payload.expectedHarvestDate).toISOString(),
        farmerId: selectedData?.farmerId,
        farmProfileId: selectedData?.farmProfileId.id,
      }
      await updateCrop(payload, selectedData?.id)
      setIsChanged(!isChanged)
    } catch (e) {
      console.error('Failed to Update Crop', e)
    } finally {
      setIsCreateModalOpen(false)
    }
  }

  const onDeleteState = async (id: string) => {
    setLoading(true)
    await deleteCrop(id)
    setLoading(false)
    setIsChanged(!isChanged)
    toast.success(`Crop deleted successfully`)
  }
  // console.log('defaultValues', defaultValues)
  // console.log('defalutValues', defaultValues)
  // console.log('season', season)

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-4'>
          <div className='flex justify-between items-center flex-wrap mb-4'>
            <div className='flex space-x-3 items-center'>
              <svg
                onClick={() => setViewCrop('')}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6 cursor-pointer '
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
                />
              </svg>
              <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>
                Crop Details
              </h2>
            </div>
            <div className='flex items-center'>
              <Button
                label='Create new'
                Icon={AiOutlinePlus}
                onClick={() => {
                  setSelectedData({})
                  setIsCreateModalOpen(true)
                }}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center mb-2 sm:mb-0 sm:mr-3'
              ></Button>
              {/* <Button
                label='Filter'
                Icon={AiOutlineFilter}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center'
              ></Button> */}
            </div>
          </div>
          {/* {loading ? (
            <Spinner />
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <CropDetailsCard
                data={item}
                type={type}
                setSelectedData={setSelectedData}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                onDeleteState={onDeleteState}
              />
            ))
          ) : (
            <NoResults title='Crop' />
          )} */}
          {loading && (
            <div className='d-flex justify-content-center my-2'>
              <Spinner />
            </div>
          )}
          {!loading && data.length === 0 ? (
            <NoResults title='Crop' />
          ) : (
            data?.map((crop: any, index) => (
              <CropDetailsCard
                data={crop}
                type={type}
                setSelectedData={setSelectedData}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                onDeleteState={onDeleteState}
              />
            ))
          )}
        </div>
      </div>
      {isCreateModalOpen && (
        <DynamicModal
          label='Create Crop'
          isOpen={isCreateModalOpen}
          onClose={() => {
            // setDistrictData({})
            // setSubDistrictData({})
            setIsCreateModalOpen(false)
          }}
          fields={createFields}
          defaultValues={{farmerId: viewFarmerName}}
          onSubmit={handleCreateCrop}
        />
      )}
      {isUpdateModalOpen && Object.keys(defaultValues).length != 0 && (
        <DynamicModal
          label='Update Crop'
          isOpen={isUpdateModalOpen}
          onClose={() => {
            // setDistrictData({})
            // setSubDistrictData({})
            setSelectedData(undefined)
            setDefaultValues({})

            setIsUpdateModalOpen(false)
          }}
          fields={updateFields}
          defaultValues={defaultValues}
          onSubmit={handleEditCrop}
        />
      )}
    </>
  )
}
