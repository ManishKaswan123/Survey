import React, {useEffect, useState} from 'react'
import {FaEdit, FaEye, FaTrash} from 'react-icons/fa'

interface UsersData {
  email: string
  role: string
  mobile: string
  stateCode: number
  districtCode: number
  subDistrictCode: number
  villageCode: number
  firstName: string
  lastName: string
  otp: string
  id: string
  stateId?: Record<string, string | number>
  districtId?: Record<string, string | number>
  subDistrictId?: Record<string, string | number>
  villageId?: Record<string, string | number>
  createdBy?: Record<string, any>
  isDraft?: boolean
}

interface Props {
  setSelectedData: any
  setIsUpdateModalOpen: any
  categoriesData: UsersData[]
  handleDelete: (id: string) => void
  handleView?: (imagePath: string | undefined) => void
  catData?: any
  topicName: string
  setViewFarm: (id: string) => void
  setViewFarmerName: any
  setViewCrop: (id: string) => void
  setType: (type: string) => void
}

const FarmerTable: React.FC<Props> = (props) => {
  const handleDelete = (id: string) => {
    props.handleDelete(id)
  }

  return (
    <>
      <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
        <table className='min-w-full leading-normal'>
          <thead>
            <tr>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Farmer Name
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                VLE Name
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Mobile Number
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                State
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                District
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Sub District
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Village
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Farm Profile
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Crop Profile
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Application Status
              </th>
              <th className='px-5 py-5 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {props?.categoriesData?.map((category) => (
              <tr key={category?.id} className='odd:bg-white even:bg-gray-50'>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex items-center'>
                    <p className='text-gray-900 whitespace-no-wrap'>
                      {/* {category?.firstName ? category.firstName : 'NA'}{' '}
                      {category?.lastName ? category.lastName : 'NA'} */}
                      {category.firstName || ''} {category.lastName || ''}
                    </p>
                  </div>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex items-center'>
                    <p className='text-gray-900 whitespace-no-wrap'>
                      {category.createdBy?.firstName || ''} {category.createdBy?.lastName || ''}
                    </p>
                  </div>
                </td>

                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex items-center'>
                    <p className='text-gray-900 whitespace-no-wrap'>
                      {category?.mobile ? category.mobile : 'NA'}
                    </p>
                  </div>
                </td>

                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {category.stateId?.stateName || ''}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {category.districtId?.districtName || ''}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {category.subDistrictId?.subDistrictName || ''}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {category.villageId?.villageName || ''}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex justify-start'>
                    <FaEye
                      className='text-blue-500 cursor-pointer h-4 w-4'
                      onClick={() => {
                        props?.setViewFarm(category.id)
                        props?.setType('Farm Profile')
                      }}
                    />
                  </div>
                </td>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex justify-start'>
                    <FaEye
                      className='text-blue-500 cursor-pointer h-4 w-4'
                      onClick={() => {
                        props?.setViewCrop(category?.id)
                        props?.setViewFarmerName(`${category?.firstName} ${category?.lastName}`)
                        props?.setType('Crop Profile')
                      }}
                    />
                  </div>
                </td>
                <td className='px-5 py-5 text-left border-b border-gray-200 text-sm'>
                  <p
                    className={
                      category?.isDraft === undefined
                        ? 'text-gray-500 font-bold font-sans'
                        : category?.isDraft
                        ? 'text-yellow-500 font-bold font-sans'
                        : 'text-green-500 font-bold font-sans'
                    }
                  >
                    {category?.isDraft === undefined
                      ? ''
                      : category?.isDraft
                      ? 'Draft'
                      : 'Registered'}
                  </p>
                </td>

                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <div className='flex space-x-3 items-center'>
                    <FaEdit
                      className='text-blue-500 cursor-pointer h-4 w-4'
                      onClick={() => {
                        // console.log('category', category.name)
                        props.setSelectedData(category)
                        props.setIsUpdateModalOpen(true)
                      }}
                    />
                    <FaTrash
                      className='text-red-500 cursor-pointer h-4 w-4'
                      onClick={() => handleDelete(category.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default FarmerTable
