// import {useEffect, useState} from 'react'
// import {Spinner} from 'sr/helpers'
// import {FarmDetailsCard} from './FarmDetailsCard'
// import {fetchFarms} from 'sr/utils/api/farmer/fetchFarms'
// import {FarmType} from './FarmType'
// export const FarmDetails = ({setViewFarm, viewFarm, type}: any) => {
//   const [loading, setLoading] = useState(false)
//   const [data, setData] = useState<FarmType[]>([])
//   useEffect(() => {
//     const getFarm = async () => {
//       const res = await fetchFarms({farmerId: viewFarm, getAll: true, isActive: true})
//       if (res?.status === 'success') {
//         setData(res?.results?.results)
//       }
//     }
//     if (viewFarm) {
//       setLoading(true)
//       getFarm().then(() => setLoading(false))
//     }
//   }, [viewFarm])
//   return (
//     <div className='container mx-auto px-4 sm:px-8'>
//       <div className='py-4'>
//         <div className='flex justify-between items-center flex-wrap mb-4'>
//           <div className='flex space-x-3 items-center'>
//             <svg
//               onClick={() => setViewFarm('')}
//               xmlns='http://www.w3.org/2000/svg'
//               fill='none'
//               viewBox='0 0 24 24'
//               strokeWidth={1.5}
//               stroke='currentColor'
//               className='w-6 h-6 cursor-pointer '
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
//               />
//             </svg>
//             <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>
//               Farm Details
//             </h2>
//           </div>
//         </div>
//         {loading ? (
//           <Spinner />
//         ) : (
//           data.map((item, index) => <FarmDetailsCard item={item} type={type} />)
//         )}
//       </div>
//     </div>
//   )
// }
import React, {useEffect, useState} from 'react'
import {Spinner} from 'sr/helpers'
import {FarmDetailsCard} from './FarmDetailsCard'
import {fetchFarms} from 'sr/utils/api/farmer/fetchFarms'
import {FarmType} from './FarmType'
import {NoResults} from 'sr/helpers/ui-components/NoResults'

export const FarmDetails = ({setViewFarm, viewFarm, type}: any) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FarmType[]>([])

  useEffect(() => {
    const getFarm = async () => {
      const res = await fetchFarms({farmerId: viewFarm, getAll: true, isActive: true})
      if (res?.status === 'success') {
        setData(res?.results?.results)
      }
    }
    if (viewFarm) {
      setLoading(true)
      getFarm().then(() => setLoading(false))
    }
  }, [viewFarm])

  return (
    <div className='container mx-auto px-4 sm:px-8'>
      <div className='py-4'>
        <div className='flex justify-between items-center flex-wrap mb-4'>
          <div className='flex space-x-3 items-center'>
            <svg
              onClick={() => setViewFarm('')}
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 cursor-pointer '
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
              />
            </svg>
            <h2 className='text-2xl font-semibold leading-tight mb-2 sm:mb-0 sm:mr-4'>
              Farm Details
            </h2>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : data.length > 0 ? (
          data.map((item, index) => <FarmDetailsCard key={index} item={item} type={type} />)
        ) : (
          <NoResults title='Farm' />
        )}
      </div>
    </div>
  )
}
