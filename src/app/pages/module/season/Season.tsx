import React, {useState, useEffect, useMemo, useCallback} from 'react'
import Pagination from 'sr/helpers/ui-components/dashboardComponents/Pagination'
import {Spinner} from 'sr/helpers/ui-components/Spinner'
import {AiOutlineFilter, AiOutlinePlus} from 'react-icons/ai'
import {Button} from 'sr/helpers'
import Filter from 'sr/helpers/ui-components/Filter'
import {toast} from 'react-toastify'
import DashboardWrapper from 'app/pages/dashboard/DashboardWrapper'
import {FieldsArray} from 'sr/constants/fields'
import DynamicModal from 'sr/helpers/ui-components/DynamicPopUpModal'
import { fetchSeason } from 'sr/utils/api/fetchSeason'
import SeasonTable from './SeasonTable'
import { createSeason } from 'sr/utils/api/createSeason'
import { updateSeason } from 'sr/utils/api/updateSeason'
import { deleteSeason } from 'sr/utils/api/deleteSeason'

interface SeasonData {
  seasonName: string
  year: number
  details: string
  isActive: boolean
  createdBy: {
      firstName: string
      lastName: string
  }
  id: string
}

const Custom: React.FC = () => {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [filters, setFilters] = useState({})
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isChanged, setisChanged] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedData, setSelectedData] = useState<any>({})
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const isActive = useMemo(
    () => [
      {id: true, name: 'Active'},
      {id: false, name: 'Inactive'},
    ],
    []
  )

  const filterFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Season Name',
        name: 'seasonName',
        placeholder: 'Season Name',
      },
      {
        type: 'dropdown',
        label: 'sortBy',
        name: [
          {
            name: 'seasonName',
            id: 'seasonName',
          },
          {
            name: 'year',
            id: 'year',
          },
        ],
        topLabel: 'Sort By',
        placeholder: 'Select Sort By',
      },
    ],
    []
  )
  
  const createUpdateFields: FieldsArray = useMemo(
    () => [
      {
        type: 'text',
        label: 'Season Name',
        name: 'seasonName',
        placeholder: 'Season Name',
        required: true,
      },
      {
        type: 'text',
        label: 'Details',
        name: 'details',
        placeholder: 'Details',
      },
      {
        type: 'number',
        label: 'Year',
        name: 'year',
        placeholder: 'Year',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'isActive',
        name: isActive,
        topLabel: 'Status',
        placeholder: 'Select Status',
        required: true,
      },
    ],
    []
  )

  const fetchData = useCallback(async () => {
    try {
      const payload = {
        limit: itemsPerPage,
        page: currentPage,
        ...filters,
      }

      console.log("Filters ", filters)
      const response = await fetchSeason(payload)
      setData(response?.results?.results)
      setTotalResults(response?.results?.totalResults)
      setTotalPages(response?.results?.totalPages)
    } catch (error) {
      console.error('Error fetching Seasons:', error)
    } finally {
    }
  }, [currentPage, filters, itemsPerPage])

  useEffect(() => {
    setLoading(true)
    fetchData().then(() => setLoading(false))
  }, [currentPage, filters, itemsPerPage, isChanged])

  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setIsFilterVisible(false)
  }

  const onPageChange = async (pageNumber: number) => {
    setLoading(true)
    setCurrentPage(pageNumber)
  }

  const onLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const onDeleteSeason = async (id: string) => {
    setLoading(true)
    await deleteSeason(id)
    setLoading(false)
    setisChanged(!isChanged)
    toast.success(`Season deleted successfully`)
  }

  const handleCreateSeason = async (payload: any) => {
    try {
      const SeasonData: {[key: string]: any} = {
        seasonName: payload?.seasonName,
        year: parseInt(payload?.year),
        isActive: payload?.isActive,
      }

      // Dynamically add optional fields if they have a value
      const optionalFields = [
        'details'
      ]

      optionalFields.forEach((field) => {
        if (payload[field]) {
          SeasonData[field] =  payload[field]
        }
      })

      console.log('VleData', SeasonData)
      await createSeason(SeasonData)
      setisChanged(!isChanged)
      toast.success('Season created successfully')
    } catch (e) {
      console.error('Failed to create Season', e)
    } finally {
      setIsCreateModalOpen(false)
    }
  }

  const handleEditSeason = async (payload: any) => {
    try {
      const SeasonData: {[key: string]: any} = {
        seasonName: payload?.seasonName,
        year: parseInt(payload?.year),
        isActive: payload?.isActive,
      }

      // Dynamically add properties to VleData if they have a value
      const optionalFields = [
        'details'
      ]

      optionalFields.forEach((field) => {
        if (payload[field]) {
          SeasonData[field] =  payload[field]
        }
      })

      console.log('VleData', SeasonData)
      console.log('selectedData', selectedData)

      await updateSeason(SeasonData, selectedData.id)
      setisChanged(!isChanged)
      toast.success('Season updated successfully')
    } catch (e) {
      console.error('Failed to update Season', e)
    } finally {
      setIsUpdateModalOpen(false)
    }
  }

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-4'>
          <div className='flex justify-between items-center flex-wrap mb-4'>
            <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>Seasons</h2>
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
                fields={filterFields}
              />
            </div>
          )}
          {loading ? (
            <Spinner />
          ) : (
            <SeasonTable
              setSelectedData={setSelectedData}
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              seasonData={data}
              handleDelete={onDeleteSeason}
              topicName='Season'
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
                name='Seasons'
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
          label='Create Season'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          fields={createUpdateFields}
          onSubmit={handleCreateSeason}
        />
      )}
      {isUpdateModalOpen && (
        <DynamicModal
          label='Update Season'
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={createUpdateFields}
          defaultValues={selectedData}
          onSubmit={handleEditSeason}
        />
      )}
    </>
  )
}
const Season: React.FC = () => {
  return (
    <>
      <DashboardWrapper
        customComponent={Custom}
        selectedItem={'/mobile-app-config-history'}
      ></DashboardWrapper>
    </>
  )
}

export default Season




