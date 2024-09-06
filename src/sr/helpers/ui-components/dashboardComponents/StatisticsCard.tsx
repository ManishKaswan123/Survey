import React from 'react'
import {FaSync} from 'react-icons/fa'

interface StatisticsProps {
  type: string
  amount: number | string
  percentage: number | string
  barColor: string
}

interface StatisticsCardProps {
  data?: StatisticsProps[]
  title: string
  dummyData: StatisticsProps[]
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({data, title, dummyData}) => {
  const fetching = !data || data.length === 0

  const displayData = fetching ? dummyData : data

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='px-4 text-xl font-semibold mb-4'>{title}</h2>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Type
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Amount
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {displayData?.map((user, index) => (
            <tr key={index}>
              <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {user.type}
              </td>
              <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{user.amount}</td>
              <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center'>
                <div className='w-16 mr-1 h-2 bg-gray-200 rounded-full'>
                  <div
                    className={`h-full rounded-full ${user.barColor}`}
                    style={{width: fetching ? '0%' : user.percentage}}
                  ></div>
                </div>
                {user.percentage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StatisticsCard
