import React from 'react'

import {FaUserTie, FaTractor, FaSeedling, FaMapMarkerAlt, FaMap, FaHome} from 'react-icons/fa'
interface TotalCardProps {
  totalUsers: number | undefined
  title: string
}

const getIcon = (title: string) => {
  switch (title) {
    case 'VLE':
      return <FaUserTie className='h-4 w-4 text-blue-500' /> // Representative icon for VLE
    case 'Farmers':
      return <FaTractor className='h-4 w-4 text-blue-500' /> // Tractor icon for farmers
    case 'Farms':
      return <FaSeedling className='h-4 w-4 text-blue-500' /> // Seedling icon for farms
    case 'Areas':
      return <FaMapMarkerAlt className='h-4 w-4 text-blue-500' /> // Map marker for areas
    case 'Covered Districts':
      return <FaMap className='h-4 w-4 text-blue-500' /> // Map icon for districts
    case 'Covered Villages':
      return <FaHome className='h-4 w-4 text-blue-500' /> // Home icon for villages
    default:
      return <FaUserTie className='h-4 w-4 text-blue-500' /> // Default icon
  }
}

const TotalCard: React.FC<TotalCardProps> = ({totalUsers, title}) => {
  const displayUsers = totalUsers !== undefined ? totalUsers : '...'
  const Icon = getIcon(title)

  return (
    <div className='bg-white shadow rounded-lg p-6 flex items-center hover:bg-gray-50'>
      <div className='flex-shrink-0 bg-gray-200 p-4 rounded-full'>{Icon}</div>
      <div className='ml-4'>
        <div className='text-2xl font-semibold text-gray-900'>{displayUsers}</div>
        <div className='text-sm text-gray-500'>{title}</div>
      </div>
    </div>
  )
}

export default TotalCard
