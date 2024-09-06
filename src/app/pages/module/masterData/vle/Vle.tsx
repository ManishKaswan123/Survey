import React, {createElement, useCallback, useEffect, useMemo, useState} from 'react'
import {AiOutlinePlus, AiOutlineFilter} from 'react-icons/ai'
import Table from 'sr/helpers/ui-components/dashboardComponents/Table'
import Pagination from 'sr/helpers/ui-components/dashboardComponents/Pagination'
import {Spinner} from 'sr/helpers/ui-components/Spinner'
import DashboardWrapper from 'app/pages/dashboard/DashboardWrapper'
import {fetchState} from 'sr/utils/api/fetchState'
import {toast} from 'react-toastify'
import {Button} from 'sr/helpers'
import Filter from 'sr/helpers/ui-components/Filter'
import DynamicModal from 'sr/helpers/ui-components/DynamicPopUpModal'
import {FieldsArray} from 'sr/constants/fields'
import {fetchUser} from 'sr/utils/api/fetchUser'
import VleTable from './VleTable'
import {updateUser} from 'sr/utils/api/updateUser'
import {createUser} from 'sr/utils/api/createUser'
import {deleteUser} from 'sr/utils/api/deleteUser'
import {fetchSubDistrict} from 'sr/utils/api/fetchSubDistrict'
import {fetchVillage} from 'sr/utils/api/fetchVillage'
import {fetchDistrict} from 'sr/utils/api/fetchDistrict'
import {useSelector} from 'react-redux'
import {useActions} from 'sr/utils/helpers/useActions'
import {RootState} from 'sr/redux/store'
import {formatDateForInput} from 'sr/helpers/functions'

const Custom: React.FC = () => {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<any>({})
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [isChanged, setisChanged] = useState<any>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedData, setSelectedData] = useState<any>({})
  const [district, setDistrict] = useState<any>([])
  const [subDistrict, setSubDistrict] = useState<any>([])
  const [village, setVillage] = useState<any>([])
  const [rerender, setRerender] = useState(false)
  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<any>(null)
  const stateData = useSelector((state: RootState) => state.state.data)
  const stateStatus = useSelector((state: RootState) => state.state.status)
  const {fetchStateData} = useActions()

  const fields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'First Name',
      },
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
    ],
    []
  )

  const createFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Role',
        name: 'role',
        placeholder: 'Role',
        required: true,
        disabled: true,
      },
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'First Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Last Name',
        name: 'lastName',
        placeholder: 'Last Name',
      },
      {
        type: 'text',
        label: 'Mobile Number',
        name: 'mobile',
        placeholder: 'Mobile Number',
        required: true,
      },

      {
        type: 'text',
        label: 'Fathers Name',
        name: 'fathersName',
        placeholder: 'Fathers Name',
      },
      {
        type: 'datetime-local',
        label: 'DOB',
        name: 'dob',
        placeholder: 'DOB',
      },
      {
        type: 'number',
        label: 'Pin Code',
        name: 'pinCode',
        placeholder: 'Pin Code',
      },
      {
        type: 'text',
        label: 'Equipment Ownership',
        name: 'equipmentOwnership',
        placeholder: 'Equipment Ownership',
      },
      {
        type: 'text',
        label: 'Language Preference',
        name: 'languagePreference',
        placeholder: 'Language Preference',
      },
      {
        type: 'dropdown',
        label: 'stateCode',
        name: stateData?.results,
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
        topLabel: 'Village Code',
        placeholder: 'Select Village',
        labelKey: 'villageName',
        id: 'villageCode',
        required: true,
      },
      // {
      //   type: 'file',
      //   label: 'Image',
      //   name: 'image',
      //   wrapperLabel: 'Upload image',
      //   topLabel: 'Image',
      //   placeholder: 'Select Image',
      //   required: true,
      // },
    ],
    [stateData, district, subDistrict, village]
  )
  const updateFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Role',
        name: 'role',
        placeholder: 'Role',
        required: true,
        disabled: true,
      },
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'First Name',
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
        type: 'text',
        label: 'Fathers Name',
        name: 'fathersName',
        placeholder: 'Fathers Name',
        required: true,
      },
      {
        type: 'datetime-local',
        label: 'DOB',
        name: 'dob',
        placeholder: 'DOB',
      },
      {
        type: 'number',
        label: 'Pin Code',
        name: 'pinCode',
        placeholder: 'Pin Code',
        required: true,
      },
      {
        type: 'text',
        label: 'Equipment Ownership',
        name: 'equipmentOwnership',
        placeholder: 'Equipment Ownership',
        required: true,
      },

      {
        type: 'text',
        label: 'Language Preference',
        name: 'languagePreference',
        placeholder: 'Language Preference',
      },
      {
        type: 'dropdown',
        label: 'stateCode',
        name: stateData?.results,
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
      // {
      //   type: 'file',
      //   label: 'Image',
      //   name: 'image',
      //   wrapperLabel: 'Upload image',
      //   topLabel: 'Image',
      //   placeholder: 'Select Image',
      //   required: true,
      // },
    ],
    [stateData, district, subDistrict, village]
  )

  console.log('village', village)
  const onPageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const onLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const onDeleteVle = async (id: string) => {
    setLoading(true)
    await deleteUser(id)
    setLoading(false)
    setisChanged(!isChanged)
    toast.success(`Vle deleted successfully`)
  }
  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setIsFilterVisible(false) // Hide filter after applying
  }
  const handleCreateVle = async (payload: any) => {
    try {
      const VleData: {[key: string]: any} = {
        role: 'vle',
        mobile: payload.mobile,
        // dob: payload.dob,
        dob: payload.dob ? new Date(payload.dob).toISOString() : undefined,
        firstName: payload.firstName,
        stateCode: parseInt(payload.stateCode),
        districtCode: parseInt(payload.districtCode),
        subDistrictCode: parseInt(payload.subDistrictCode),
        villageCode: parseInt(payload.villageCode),
      }

      // Dynamically add optional fields if they have a value
      const optionalFields = [
        'dob',
        'lastName',
        'fathersName',
        'pinCode',
        'equipmentOwnership',
        'languagePreference',
      ]

      optionalFields.forEach((field) => {
        if (payload[field]) {
          VleData[field] = field === 'languagePreference' ? [payload[field]] : payload[field]
        }
      })

      console.log('VleData', VleData)
      await createUser(VleData)
      setRerender((prev) => !prev)
      toast.success('Vle created successfully')
    } catch (e) {
      console.error('Failed to create Vle', e)
    } finally {
      setIsCreateModalOpen(false)
    }
  }

  const handleEditVle = async (payload: any) => {
    try {
      const VleData: {[key: string]: any} = {
        role: 'vle',
        mobile: payload.mobile,
        firstName: payload.firstName,
        // dob: payload.dob,
        dob: payload.dob ? new Date(payload.dob).toISOString() : undefined,
        lastName: payload.lastName,
        fathersName: payload.fathersName,
        pinCode: parseInt(payload.pinCode),
        equipmentOwnership: payload.equipmentOwnership,
        languagePreference: [payload.languagePreference],
        stateCode: parseInt(payload.stateCode),
        districtCode: parseInt(payload.districtCode),
        subDistrictCode: parseInt(payload.subDistrictCode),
        villageCode: parseInt(payload.villageCode),
      }

      // Dynamically add properties to VleData if they have a value
      const optionalFields = [
        'dob',
        'lastName',
        'fathersName',
        'pinCode',
        'equipmentOwnership',
        'languagePreference',
      ]

      optionalFields.forEach((field) => {
        if (payload[field]) {
          VleData[field] = field === 'languagePreference' ? [payload[field]] : payload[field]
        }
      })

      console.log('VleData', VleData)
      console.log('selectedData', selectedData)

      await updateUser(VleData, selectedData.id)
      setRerender((prev) => !prev)
      toast.success('Vle updated successfully')
    } catch (e) {
      console.error('Failed to update Vle', e)
    } finally {
      setIsUpdateModalOpen(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const payload = {
          role: 'vle',
          limit: itemsPerPage,
          page: currentPage,
          isActive: filters.isActive ? filters.isActive : true,
          ...filters,
        }
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
        toast.error('Error fetching state')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, rerender, filters, itemsPerPage, isChanged])

  const fetchDataIfNeeded = useCallback(() => {
    if (stateStatus != 'succeeded') fetchStateData()
  }, [stateStatus])

  useEffect(() => {
    fetchDataIfNeeded()
  }, [])

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
  useEffect(() => {
    if (selectedData) {
      setSelectedData({
        ...selectedData,
        dob: selectedData.dob ? formatDateForInput(selectedData.dob) : undefined,
      })
    }
  }, [selectedData])

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-4'>
          <div className='flex justify-between items-center flex-wrap mb-4'>
            <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>VLE</h2>
            <div className='flex items-center'>
              <Button
                label='Create new'
                Icon={AiOutlinePlus}
                onClick={() => {
                  setIsCreateModalOpen(true)
                }}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md inline-flex items-center mb-2 sm:mb-0 sm:mr-3'
              ></Button>
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
              />
            </div>
          )}
          {loading ? (
            <Spinner />
          ) : (
            <VleTable
              setSelectedData={setSelectedData}
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              vleData={data}
              handleDelete={onDeleteVle}
              topicName='Vle'
            />
          )}
        </div>
        {!loading && (
          <>
            {totalResults > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                itemsPerPage={itemsPerPage}
                name='Vle'
                onLimitChange={onLimitChange}
                disabled={loading}
                totalResults={totalResults}
              />
            ) : (
              <div className='items-center text-center text-xl mt-auto'>No Result Found</div>
            )}
          </>
        )}
      </div>
      {isCreateModalOpen && (
        <DynamicModal
          label='Create Vle'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          fields={createFields}
          onSubmit={handleCreateVle}
          defaultValues={{role: 'vle'}}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedSubDistrict={setSelectedSubDistrict}
        />
      )}
      {isUpdateModalOpen && (
        <DynamicModal
          label='Update Vle'
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={updateFields}
          defaultValues={selectedData}
          onSubmit={handleEditVle}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedSubDistrict={setSelectedSubDistrict}
        />
      )}
    </>
  )
}
const Vle: React.FC = () => {
  return (
    <>
      <DashboardWrapper customComponent={Custom} selectedItem={'/admin'}></DashboardWrapper>
    </>
  )
}

export default Vle
