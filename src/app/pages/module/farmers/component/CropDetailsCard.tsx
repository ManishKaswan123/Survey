import React, {useState} from 'react'
import {CropCard} from './CropCard'

type FarmProfile = {
  farmName: string
  farmPhoto: string
  area: number // area in hectares
  isActive: boolean
}

type CropDetail = {
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
  seasonId: string | null
  createdAt: string
  updatedAt: string
  id: string
}

type Props = {
  data: any
  type: string
  setSelectedData: any
  setIsUpdateModalOpen: any
  onDeleteState: any
}

export const CropDetailsCard: React.FC<Props> = ({
  data,
  type,
  setIsUpdateModalOpen,
  setSelectedData,
  onDeleteState,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  console.log('data', data)

  if (data.length === 0) return null

  const {farmName, area, isActive} = data[0].farmProfileId

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className='border rounded-lg shadow-lg p-6 mb-6 bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <div>
            <h3 className='text-2xl font-bold text-gray-800'>{farmName}</h3>
          </div>
        </div>
        <div className='text-right'>
          <h4 className='text-gray-800'>
          Area(in acres): <span className='text-1xl font-bold text-gray-800'>{area}</span>
          </h4>
        </div>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <p className='text-gray-600'>
          Status:{' '}
          <span
            className={isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
        <div onClick={toggleDropdown} className='cursor-pointer'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={`w-6 h-6 text-gray-600 transition-transform duration-200 ease-in-out ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className='mt-6 space-y-4'>
          {data.map((item: any, index: number) => (
            <CropCard
              key={index}
              item={item}
              type={type}
              setSelectedData={setSelectedData}
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              onDeleteState={onDeleteState}
            />
          ))}
        </div>
      )}
    </div>
  )
}
