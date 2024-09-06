import React, {useState} from 'react'
import {FaEdit, FaTrash} from 'react-icons/fa'
import {getPreSignedURL} from 'sr/utils/api/media'

type SeasonDetail = {
  seasonName: string
  year: number
  details: string
  isActive: boolean
}

type CropDetail = {
  cropName: string
  seedType: string
  sowingDate: string
  transplantationDate: string
  expectedHarvestDate: string
  fertilizerUsed: 'yes' | 'no'
  pesticideWeedicideFungicideUsed: 'yes' | 'no'
  isActive: boolean
  farmerId: string
  seasonId: SeasonDetail | null
  createdAt: string
  updatedAt: string
  fertilizerDetails?: {fertilizerName: string; quantity: number; applicationStage: string}[]
  soilTestTaken?: string
  soilTestReport?: string
  id: string
}

type Props = {
  item: CropDetail
  type: string
  setSelectedData: (data: CropDetail) => void
  setIsUpdateModalOpen: (open: boolean) => void
  onDeleteState: (id: string) => void
}

export const CropCard: React.FC<Props> = ({
  item,
  type,
  setIsUpdateModalOpen,
  setSelectedData,
  onDeleteState,
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showFertilizers, setShowFertilizers] = useState(false)

  const handleDelete = (id: string) => {
    onDeleteState(id)
  }
  const handleView = async (fileUrl: string | undefined) => {
    if (!fileUrl) return
    const response: any = await getPreSignedURL({fileName: fileUrl})
    window.open(response.results.url.toString(), '_blank')
  }

  return (
    <div className='border rounded-lg shadow-md p-4 bg-gray-50'>
      <div className='flex justify-between items-center'>
        <h4 className='text-xl font-bold text-gray-800'>{item.cropName}</h4>
        {item.seasonId && (
          <div className='ml-auto text-right'>
            <p className='text-xl font-bold text-gray-800'>
              {item.seasonId.seasonName} ({item.seasonId.year})
            </p>
          </div>
        )}
        <div onClick={() => setShowDetails(!showDetails)} className='cursor-pointer'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={`w-6 h-6 text-gray-600 transition-transform duration-200 ease-in-out ${
              showDetails ? 'rotate-180' : ''
            }`}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
          </svg>
        </div>
      </div>
      {showDetails && (
        <>
          <div className='mt-4 grid grid-cols-2 gap-4'>
            <p className='text-gray-700'>
              <span className='font-semibold'>Seed Type:</span> {item.seedType}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Sowing Date:</span>{' '}
              {new Date(item.sowingDate).toLocaleDateString()}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Transplantation Date:</span>{' '}
              {new Date(item.transplantationDate).toLocaleDateString()}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Expected Harvest:</span>{' '}
              {new Date(item.expectedHarvestDate).toLocaleDateString()}
            </p>

            <p className='text-gray-700'>
              <span className='font-semibold'>Pesticides/Weedicide/Fungicide Used:</span>{' '}
              {item.pesticideWeedicideFungicideUsed}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Status:</span>
              <span
                className={
                  item.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                }
              >
                {item.isActive ? ' Active' : ' Inactive'}
              </span>
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Soil Test Taken:</span> {item.soilTestTaken}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Soil Test Report:</span>{' '}
              {item.soilTestReport && (
                <button
                  onClick={async () => await handleView(item.soilTestReport)}
                  className='text-blue-500 focus:outline-none'
                >
                  View Report
                </button>
              )}
            </p>
            <div className='flex items-center text-gray-700'>
              <span className='font-semibold mr-2'>Fertilizer Used:</span> {item.fertilizerUsed}
              {item.fertilizerUsed === 'yes' &&
                item.fertilizerDetails &&
                item.fertilizerDetails.length > 0 && (
                  <button
                    onClick={() => setShowFertilizers(!showFertilizers)}
                    className='ml-2 text-gray-700 focus:outline-none'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className={`w-6 h-6 transition-transform duration-200 ease-in-out ${
                        showFertilizers ? 'rotate-180' : ''
                      }`}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m19.5 8.25-7.5 7.5-7.5-7.5'
                      />
                    </svg>
                  </button>
                )}
            </div>
            {showFertilizers && item.fertilizerDetails && (
              <div className='col-span-2 mt-2 space-y-2'>
                {item.fertilizerDetails.map((fertilizer, index) => (
                  <div
                    key={index}
                    className='border rounded-lg p-3 bg-white shadow-sm flex justify-between items-center'
                  >
                    {/* <p className='font-semibold text-gray-800'>{fertilizer.fertilizerName}</p>
                      <p className='text-gray-700'>
                        Quantity: {fertilizer.quantity}, Application Stage:{' '}
                        {fertilizer.applicationStage}
                      </p> */}
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Name of Fertilizer:</span>{' '}
                      {fertilizer.fertilizerName}
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Dose(kg):</span> {fertilizer.quantity}
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Stage of Application:</span>{' '}
                      {fertilizer.applicationStage}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {item.seasonId && (
              <div className='col-span-2'>
                <p className='text-gray-700'>
                  <span className='font-semibold'>Season Name:</span> {item.seasonId.seasonName}
                </p>
                <p className='text-gray-700'>
                  <span className='font-semibold'>Year:</span> {item.seasonId.year}
                </p>
                <p className='text-gray-700'>
                  <span className='font-semibold'>Details:</span> {item.seasonId.details}
                </p>
              </div>
            )}
          </div>
          <div className='flex justify-end mt-4'>
            <FaEdit
              className='text-blue-500 cursor-pointer mr-4 h-4 w-4'
              onClick={() => {
                setSelectedData(item)
                setIsUpdateModalOpen(true)
              }}
            />
            <FaTrash
              className='text-red-500 cursor-pointer ml-4 h-4 w-4'
              onClick={() => handleDelete(item.id)}
            />
          </div>
        </>
      )}
    </div>
  )
}
