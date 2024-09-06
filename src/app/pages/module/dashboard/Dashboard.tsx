import React, {useCallback, useEffect, useMemo, useState} from 'react'
import DashboardWrapper from 'app/pages/dashboard/DashboardWrapper'
import TotalCard from './TotalResults'
import {fetchDashboardCounts} from 'sr/utils/api/dashboard'
import {useSelector} from 'react-redux'
import {useActions} from 'sr/utils/helpers/useActions'
import {RootState} from 'sr/redux/store'
interface ApiResponse {
  farmerCount: number
  vleCount: number
  farmCount: number
  farmArea: number
  districtCount: number
  villageCount: number
}

const Custom: React.FC = () => {
  const dashboardData: ApiResponse | undefined = useSelector(
    (state: RootState) => state.dashobaord.data
  )
  const dashboardStatus: string = useSelector((state: RootState) => state.dashobaord.status)
  const {fetchDashboardData} = useActions()

  useEffect(() => {
    if (dashboardStatus != 'succeeded') {
      fetchDashboardData()
    }
  }, [dashboardStatus])

  // const calculatePercentage = (amount: number, total: number): string =>
  //   `${((amount / total) * 100).toFixed(1)}%`

  // const masterData: StatisticsData[] = useMemo(
  //   () => [
  //     {
  //       type: 'Business',
  //       amount: businessTypes || '...',
  //       percentage:
  //         businessTypes && categories && subCat
  //           ? calculatePercentage(businessTypes, businessTypes + categories + subCat)
  //           : '0%',
  //       barColor: 'bg-blue-500',
  //     },
  //     {
  //       type: 'Category',
  //       amount: categories || '...',
  //       percentage:
  //         businessTypes && categories && subCat
  //           ? calculatePercentage(categories, businessTypes + categories + subCat)
  //           : '0%',
  //       barColor: 'bg-green-500',
  //     },
  //     {
  //       type: 'Sub Category',
  //       amount: subCat || '...',
  //       percentage:
  //         businessTypes && categories && subCat
  //           ? calculatePercentage(subCat, businessTypes + categories + subCat)
  //           : '0%',
  //       barColor: 'bg-pink-500',
  //     },
  //   ],
  //   [businessTypes, categories, subCat]
  // )

  // const statisticsSections = [
  //   {title: 'Users', data: users?.data, dummyData: dummyData.users},
  //   {title: 'Master Data', data: masterData, dummyData: masterData},
  //   {title: 'Orders', data: orders?.data, dummyData: dummyData.orders},
  //   {title: 'Transactions', data: transactions?.data, dummyData: dummyData.transactions},
  //   {title: 'Products', data: products?.data, dummyData: dummyData.products},
  // ]

  const totalCards = [
    {title: 'VLE', total: dashboardData?.vleCount},
    {title: 'Farmers', total: dashboardData?.farmerCount},
    {title: 'Farms', total: dashboardData?.farmCount},
    {title: 'Areas(in acres)', total: dashboardData?.farmArea},
    {title: 'Districts Covered', total: dashboardData?.districtCount},
    {title: 'Villages Covered', total: dashboardData?.villageCount},
    // {title: 'Orders', total: 0},
    // {title: 'Transactions', total: 0},
  ]

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <h1 className='text-xl font-semibold mb-2'>Total</h1>
      <div className='mb-6 grid grid-cols-5 gap-3'>
        {totalCards.map((card, index) => (
          <TotalCard key={index} totalUsers={card.total} title={card.title} />
        ))}
      </div>
      {/* <h1 className='text-xl font-semibold mb-2'>Statistics</h1> */}
      {/* <div className='mb-4 grid grid-cols-3 gap-3'>
        {statisticsSections.map((section, index) => (
          <StatisticsCard
            key={index}
            data={section.data}
            title={section.title}
            dummyData={section.dummyData}
          />
        ))}
      </div> */}
    </div>
  )
  return <div>this is dashboard</div>
}

const Dashboard: React.FC = () => {
  return <DashboardWrapper customComponent={Custom} selectedItem='/dashboard' />
}

export default Dashboard
