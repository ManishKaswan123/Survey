import DashboardWrapper from 'app/pages/dashboard/DashboardWrapper'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {AiOutlineFilter, AiOutlinePlus} from 'react-icons/ai'
import {Button, Spinner} from 'sr/helpers'
import Pagination from 'sr/helpers/ui-components/dashboardComponents/Pagination'
import Filter from 'sr/helpers/ui-components/Filter'
import FarmerTable from './FarmerTable'
import DynamicModal from 'sr/helpers/ui-components/DynamicPopUpModal'
import {FieldsArray} from 'sr/constants/fields'
import {FarmDetails} from './component/FarmDetails'
import {fetchUser} from 'sr/utils/api/fetchUser'
import {useSelector} from 'react-redux'
import {RootState} from 'sr/redux/store'
// import {fetchStateData} from 'sr/redux/action/stateActions'
import {fetchDistrict} from 'sr/utils/api/fetchDistrict'
import {fetchVillage} from 'sr/utils/api/fetchVillage'
import {fetchSubDistrict} from 'sr/utils/api/fetchSubDistrict'
import {updateUser} from 'sr/utils/api/updateUser'
import {toast} from 'react-toastify'
import {useActions} from 'sr/utils/helpers/useActions'
import {deleteUser} from 'sr/utils/api/deleteUser'
import {CropDetails} from './component/CropDetails'
// import {updateFarmer} from 'sr/utils/api/farmer/updateFarmer'
// import {isPlainObject} from '@reduxjs/toolkit'

export const Custom: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [selectedData, setSelectedData] = useState<any>({})
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filters, setFilters] = useState<any>({})
  // const [isDataModified, setIsDataModified] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [data, setData] = useState<any>([])
  const [totalPages, setTotalPages] = useState(5)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewFarm, setViewFarm] = useState('')
  const [viewFarmerName, setViewFarmerName] = useState('')
  const [viewCrop, setViewCrop] = useState('')
  const [isChanged, setisChanged] = useState<any>(false)
  const [type, setType] = useState<string>('')
  const [district, setDistrict] = useState<any>([])
  const [subDistrict, setSubDistrict] = useState<any>([])
  const [village, setVillage] = useState<any>([])
  const [selectedState, setSelectedState] = useState<any>()
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<any>(null)
  const AllState = useSelector((state: RootState) => state.state.data)
  const AllStateStatus = useSelector((state: RootState) => state.state.status)
  const userData = useSelector((state: RootState) => state.user.data)
  const userStatus = useSelector((state: RootState) => state.user.status)
  const {fetchUserData, fetchStateData} = useActions()
  const fields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'First Name',
      },
      // {
      //   type: 'dropdown',
      //   label: 'isEmailVerified',
      //   name: [
      //     {
      //       id: true,
      //       name: 'Verified',
      //     },
      //     {
      //       id: false,
      //       name: 'Not Verified',
      //     },
      //   ],
      //   topLabel: 'Email Verification',
      //   placeholder: 'Select Email Verification',
      // },
      {
        type: 'dropdown',
        label: 'isActive',
        name: [
          {
            id: true,
            name: 'Active',
          },
          {
            id: false,
            name: 'Inactive',
          },
        ],
        topLabel: 'Status',
        placeholder: 'Select Status',
      },
      {
        type: 'dropdown',
        label: 'createdBy',
        name: userData?.results,
        topLabel: 'VLE',
        placeholder: 'Select VLE',
        labelKey: 'firstName',
        id: 'id',
      },
      {
        type: 'dropdown',
        label: 'isDraft',
        name: [
          {
            id: false,
            name: 'Yes',
          },
          {
            id: true,
            name: 'No',
          },
        ],
        topLabel: 'Application Submitted',
        placeholder: 'Select Application Submitted',
      },
      {
        type: 'dropdown',
        label: 'isFarmerProfileSubmitted',
        name: [
          {
            id: true,
            name: 'Yes',
          },
          {
            id: false,
            name: 'No',
          },
        ],
        topLabel: 'Farmer Profile Submitted',
        placeholder: 'Select Farmer Profile Submitted',
      },
      {
        type: 'dropdown',
        label: 'isCropProfileSubmitted',
        name: [
          {
            id: true,
            name: 'Yes',
          },
          {
            id: false,
            name: 'No',
          },
        ],
        topLabel: 'Crop Profile Submitted',
        placeholder: 'Select Crop Profile Submitted',
      },
      // {
      //   type: 'dropdown',
      //   label: 'sortBy',
      //   name: [
      //     {
      //       name: 'First Name',
      //       id: 'firstName',
      //     },
      //     {
      //       name: 'Last Name',
      //       id: 'lastName',
      //     },

      //     {
      //       name: 'Email',
      //       id: 'email',
      //     },
      //     {
      //       name: 'State',
      //       id: 'stateId',
      //     },
      //     {
      //       name: 'District',
      //       id: 'districtId',
      //     },
      //     {
      //       name: 'Sub District',
      //       id: 'subDistrictId',
      //     },
      //     {
      //       name: 'Village',
      //       id: 'villageId',
      //     },
      //     {
      //       name: 'Phone',
      //       id: 'mobile',
      //     },
      //   ],
      //   topLabel: 'Sort By',
      //   placeholder: 'Select Sort By',
      // },
    ],
    [userData]
  )
  const updateFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'Enter First Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Last Name',
        name: 'lastName',
        placeholder: 'Last Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Mobile Number',
        name: 'mobile',
        placeholder: 'Mobile Number',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'stateCode',
        name: AllState?.results,
        topLabel: 'State',
        placeholder: 'Select State',
        labelKey: 'stateName',
        id: 'stateCode',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'districtCode',
        name: district,
        topLabel: 'District',
        placeholder: 'Select District',
        labelKey: 'districtName',
        id: 'districtCode',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'subDistrictCode',
        name: subDistrict,
        topLabel: 'Sub District',
        placeholder: 'Select Sub District',
        labelKey: 'subDistrictName',
        id: 'subDistrictCode',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'villageCode',
        name: village,
        topLabel: 'Village',
        placeholder: 'Select Village',
        labelKey: 'villageName',
        id: 'villageCode',
        required: true,
      },
    ],
    [AllState?.results, district, village, subDistrict]
  )

  const onPageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  const onLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }
  const onDeleteFarmer = async (id: string) => {
    setLoading(true)
    await deleteUser(id)
    setLoading(false)
    setisChanged(!isChanged)
    toast.success(`Farmer deleted successfully`)
  }
  const handleApplyFilter = (newFilters: any) => {
    // console.log('applying filter', newFilters)
    setFilters(newFilters)
    setCurrentPage(1)
    setIsFilterVisible(false) // Hide filter after applying
  }
  const handleEditFarmer = async (payload: FormData | Record<string, any>) => {
    try {
      const res = await updateUser(payload, selectedData?.id)
      if (res?.status === 'success') {
        toast.success('Data Updated Successfully')
        setisChanged((prev: boolean) => !prev)
      }
    } catch (e) {}
  }
  const fetchData = useCallback(async () => {
    // setLoading(true)
    console.log('filters ', filters)
    try {
      const payload = {
        limit: itemsPerPage,
        page: currentPage,
        role: 'farmer',
        isActive: filters.isActive ? filters.isActive : true,
        ...filters,
      }
      // console.log('Fetching data with payload:', payload) // Debug statement
      const response = await fetchUser(payload)
      setData(response.results.results)
      setTotalPages(response.results.totalPages)
      setTotalResults(response.results.totalResults)
      if (response.results.results.length === 0) {
        setCurrentPage((prev: number) => {
          if (prev > 1) {
            return prev - 1
          }
          return 1
        })
      }
    } catch (error) {
      toast.error('Error fetching user data')
    }
  }, [itemsPerPage, currentPage, filters, isChanged])
  const fetchDataIfNeeded = useCallback(() => {
    if (userStatus != 'succeeded') fetchUserData({})
    if (AllStateStatus != 'succeeded') fetchStateData()
  }, [userStatus])
  useEffect(() => {
    fetchDataIfNeeded()
  }, [])
  useEffect(() => {
    setLoading(true)
    fetchData().then((res) => {
      setLoading(false)
      // console.log('res', res)
    })
  }, [currentPage, isChanged, filters, itemsPerPage])
  useEffect(() => {
    if (selectedState) {
      fetchDistrict({
        getAll: true,
        stateCode: parseInt(selectedState),
        projectBy: 'districtCode,districtName',
      }).then((response) => {
        setDistrict(response.results)
        if (selectedData.stateCode !== parseInt(selectedState)) {
          setSelectedData({
            ...selectedData,
            stateCode: parseInt(selectedState),
            districtCode: undefined,
            subDistrictCode: undefined,
            villageCode: undefined,
          })
        }
      })
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedDistrict) {
      fetchSubDistrict({
        getAll: true,
        districtCode: parseInt(selectedDistrict),
        projectBy: 'subDistrictCode,subDistrictName',
      }).then((response) => {
        setSubDistrict(response.results)
        if (selectedData.districtCode !== parseInt(selectedDistrict)) {
          setSelectedData({
            ...selectedData,
            districtCode: parseInt(selectedDistrict),
            subDistrictCode: undefined,
            villageCode: undefined,
          })
        }
      })
    }
  }, [selectedDistrict])

  useEffect(() => {
    if (selectedSubDistrict) {
      fetchVillage({
        getAll: true,
        subDistrictCode: parseInt(selectedSubDistrict),
        projectBy: 'villageCode,villageName',
      }).then((response) => {
        setVillage(response.results)
        if (selectedData.subDistrictCode !== parseInt(selectedSubDistrict)) {
          setSelectedData({
            ...selectedData,
            subDistrictCode: parseInt(selectedSubDistrict),
            villageCode: undefined,
          })
        }
      })
    }
  }, [selectedSubDistrict])

  return (
    <>
      {viewFarm ? (
        <FarmDetails setViewFarm={setViewFarm} viewFarm={viewFarm} type={type} />
      ) : viewCrop ? (
        <CropDetails
          setViewCrop={setViewCrop}
          viewCrop={viewCrop}
          type={type}
          viewFarmerName={viewFarmerName}
        />
      ) : (
        <div className='container mx-auto px-4 sm:px-8'>
          <div className='py-4'>
            <div className='flex justify-between items-center flex-wrap mb-4'>
              <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>Farmers</h2>
              <div className='flex items-center'>
                {/* <Button
                  label='Create new'
                  Icon={AiOutlinePlus}
                  onClick={() => {
                    setSelectedData({})
                    setDistrict([])
                    setSubDistrict([])
                    setIsCreateModalOpen(true)
                  }}
                  className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center mb-2 sm:mb-0 sm:mr-3'
                ></Button> */}
                <Button
                  label='Filter'
                  Icon={AiOutlineFilter}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center'
                ></Button>
              </div>
            </div>
            {isFilterVisible && (
              <div className='relative'>
                <Filter
                  onApplyFilter={handleApplyFilter}
                  setIsFilterVisible={setIsFilterVisible}
                  preFilters={filters}
                  fields={fields}
                  setSelectedState={setSelectedState}
                  setSelectedDistrict={setSelectedDistrict}
                />
              </div>
            )}
            {loading ? (
              <Spinner />
            ) : (
              <FarmerTable
                setSelectedData={setSelectedData}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                categoriesData={data}
                handleDelete={onDeleteFarmer}
                setViewFarm={setViewFarm}
                setViewFarmerName={setViewFarmerName}
                setViewCrop={setViewCrop}
                setType={setType}
                topicName='Farmers'
              />
            )}
          </div>
          {!loading && (
            <>
              {totalResults > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  itemsPerPage={itemsPerPage}
                  name='Farmers'
                  onLimitChange={onLimitChange}
                  disabled={loading}
                  totalResults={totalResults}
                />
              )}
            </>
          )}
        </div>
      )}

      {isUpdateModalOpen && (
        <DynamicModal
          label='Update Farmer'
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={updateFields}
          defaultValues={selectedData}
          onSubmit={handleEditFarmer}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedSubDistrict={setSelectedSubDistrict}
        />
      )}
    </>
  )
}

const Farmers: React.FC = () => {
  return (
    <>
      <DashboardWrapper customComponent={Custom} selectedItem={'/farmers'}></DashboardWrapper>
    </>
  )
}
export default Farmers
