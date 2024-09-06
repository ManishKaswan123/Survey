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
import AdminTable from './AdminTable'
import {fetchUser} from 'sr/utils/api/fetchUser'
import {deleteUser} from 'sr/utils/api/deleteUser'
import {updateUser} from 'sr/utils/api/updateUser'
import {createUser} from 'sr/utils/api/createUser'
// import {fetchDistrict} from 'sr/utils/api/fetchDistrict'
// import {fetchSubDistrict} from 'sr/utils/api/fetchSubDistrict'
// import {fetchVillage} from 'sr/utils/api/fetchVillage'
import {useActions} from 'sr/utils/helpers/useActions'
// import {useSelector} from 'react-redux'
// import {RootState} from 'sr/redux/store'
// import TotalCard from '../../dashboard/TotalResults'

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
  // const [isDataModified, setIsDataModified] = useState(false)
  // const [states, useStates] = useState<any>([])
  // const [district, setDistrict] = useState<any>([])
  // const [subDistrict, setSubDistrict] = useState<any>([])
  // const [village, setVillage] = useState<any>([])
  const [rerender, setRerender] = useState(false)

  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<any>(null)
  // const stateData = useSelector((state: RootState) => state.state.data)
  // const stateStatus = useSelector((state: RootState) => state.state.status)
  const {fetchStateData} = useActions()

  const fields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Role',
        name: 'role',
        placeholder: 'Role',
      },
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
        placeholder: 'Enter Role',
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
        label: 'Email',
        name: 'email',
        placeholder: 'Enter Email',
        required: true,
      },
      {
        type: 'password',
        label: 'Password',
        name: 'password',
        placeholder: 'Password',
        required: true,
      },
      {
        type: 'password',
        label: 'Confirm Password',
        name: 'confirmPassword',
        placeholder: 'Confirm Password',
        required: true,
      },

      // {
      //   type: 'text',
      //   label: 'Phone Number',
      //   name: 'mobile',
      //   placeholder: 'Enter Phone Number',
      //   required: true,
      // },

      // {
      //   type: 'text',
      //   label: 'Fathers Name',
      //   name: 'fathersName',
      //   placeholder: 'Enter Fathers Name',
      // },
      // {
      //   type: 'text',
      //   label: 'DOB',
      //   name: 'dob',
      //   placeholder: 'Enter DOB',
      // },
      // {
      //   type: 'number',
      //   label: 'pinCode',
      //   name: 'pinCode',
      //   placeholder: 'Enter PinCode',
      // },
      // {
      //   type: 'text',
      //   label: 'Equipment Ownership',
      //   name: 'equipmentOwnership',
      //   placeholder: 'Enter Equipment Ownership',
      // },
      // {
      //   type: 'text',
      //   label: 'languagePreference',
      //   name: 'languagePreference',
      //   placeholder: 'Enter Language Preference',
      // },
      // {
      //   type: 'text',
      //   label: 'Address',
      //   name: 'address',
      //   placeholder: 'Enter Address',
      // },
    ],
    []
  )

  const onPageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const onLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const onDeleteAdmin = async (id: string) => {
    setLoading(true)
    await deleteUser(id)
    setLoading(false)
    setisChanged(!isChanged)
    toast.success(`Admin deleted successfully`)
  }
  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setIsFilterVisible(false) // Hide filter after applying
  }

  const handleCreateAdmin = async (payload: any) => {
    if (payload.password !== payload.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const adminData: {
        role: string
        email: string
        password: string
        firstName: string
        lastName?: string
      } = {
        role: 'admin',
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
      }

      await createUser(adminData)
      setRerender((prev) => !prev)
      // toast.success('Admin created successfully')
    } catch (e) {
      console.error('Failed to create Admin', e)
    } finally {
      setIsCreateModalOpen(false)
    }
  }

  const handleEditAdmin = async (payload: any) => {
    if (payload.password !== payload.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const adminData: {
        role: string
        email: string
        password: string
        firstName: string
        lastName?: string
      } = {
        role: 'admin',
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
      }

      await updateUser(adminData, selectedData.id)
      setRerender((prev) => !prev)
      // toast.success('Admin updated successfully')
    } catch (e) {
      console.error('Failed to update Admin', e)
    } finally {
      setIsUpdateModalOpen(false)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const payload = {
          role: 'admin',
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

  // const fetchDataIfNeeded = useCallback(() => {
  //   if (stateStatus != 'succeeded') fetchStateData()
  // }, [stateStatus])

  // useEffect(() => {
  //   fetchDataIfNeeded()
  // }, [])

  // useEffect(() => {
  //   if (selectedState) {
  //     fetchDistrict({
  //       getAll: true,
  //       stateCode: parseInt(selectedState),
  //       projectBy: 'districtCode,districtName',
  //     }).then((response) => {
  //       setDistrict(response.results)
  //       if (selectedData.stateCode !== parseInt(selectedState)) {
  //         setSelectedData({
  //           ...selectedData,
  //           stateCode: parseInt(selectedState),
  //           districtCode: undefined,
  //           subDistrictCode: undefined,
  //           villageCode: undefined,
  //         })
  //       }
  //     })
  //   }
  // }, [selectedState])

  // useEffect(() => {
  //   if (selectedDistrict) {
  //     fetchSubDistrict({
  //       getAll: true,
  //       districtCode: parseInt(selectedDistrict),
  //       projectBy: 'subDistrictCode,subDistrictName',
  //     }).then((response) => {
  //       setSubDistrict(response.results)
  //       if (selectedData.districtCode !== parseInt(selectedDistrict)) {
  //         setSelectedData({
  //           ...selectedData,
  //           districtCode: parseInt(selectedDistrict),
  //           subDistrictCode: undefined,
  //           villageCode: undefined,
  //         })
  //       }
  //     })
  //   }
  // }, [selectedDistrict])

  // useEffect(() => {
  //   if (selectedSubDistrict) {
  //     fetchVillage({
  //       getAll: true,
  //       subDistrictCode: parseInt(selectedSubDistrict),
  //       projectBy: 'villageCode,villageName',
  //     }).then((response) => {
  //       setVillage(response.results)
  //       if (selectedData.subDistrictCode !== parseInt(selectedSubDistrict)) {
  //         setSelectedData({
  //           ...selectedData,
  //           subDistrictCode: parseInt(selectedSubDistrict),
  //           villageCode: undefined,
  //         })
  //       }
  //     })
  //   }
  // }, [selectedDistrict])

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-4'>
          <div className='flex justify-between items-center flex-wrap mb-4'>
            <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>Admin</h2>
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
            <AdminTable
              setSelectedData={setSelectedData}
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              adminData={data}
              handleDelete={onDeleteAdmin}
              topicName='Admin'
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
                name='Admin'
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
          label='Create Admin'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          fields={createFields}
          onSubmit={handleCreateAdmin}
          defaultValues={{role: 'admin'}}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedSubDistrict={setSelectedSubDistrict}
        />
      )}
      {isUpdateModalOpen && (
        <DynamicModal
          label='Update Admin'
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={createFields}
          defaultValues={selectedData}
          onSubmit={handleEditAdmin}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedSubDistrict={setSelectedSubDistrict}
        />
      )}
    </>
  )
}
const Admin: React.FC = () => {
  return (
    <>
      <DashboardWrapper customComponent={Custom} selectedItem={'/admin'}></DashboardWrapper>
    </>
  )
}

export default Admin
