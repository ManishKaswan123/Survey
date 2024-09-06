import {useAuth} from 'app/pages/module/auth/core/Auth'
import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from 'sr/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'

// Lazy loading components
const SubDistrict = lazy(async () => import('app/pages/module/masterData/subDistrict/SubDistrict'))
const Dashboard = lazy(async () => import('app/pages/module/dashboard/Dashboard'))
const Vle = lazy(async () => import('app/pages/module/masterData/vle/Vle'))
const District = lazy(async () => import('app/pages/module/masterData/district/District'))
const State = lazy(async () => import('app/pages/module/masterData/state/State'))
const Admin = lazy(async () => import('app/pages/module/masterData/admin/Admin'))
const ChangePassword = lazy(async () => import('app/pages/module/userProfile/ChangePassword'))
const Village = lazy(async () => import('app/pages/module/masterData/village/Village'))
const Farmers = lazy(async () => import('app/pages/module/farmers/Farmers'))
const Season = lazy(async () => import('app/pages/module/season/Season'))
const AppVersionHistory = lazy(
  async () => import('app/pages/module/masterData/appVersionHistory/AppVersionHistory')
)
const AppConfigHistory = lazy(
  async () => import('app/pages/module/masterData/appConfigHistroy/appConfigHistory')
)
const ContactUs = lazy(async () => import('app/pages/module/contactUs/ContactUs'))
type WithChildren = {
  children: any
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  TopBarProgress.config({
    barColors: {
      '0': '#000',
    },
    barThickness: 4,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

const PrivateRoutes: FC = () => {
  const {auth} = useAuth()
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        <Route
          path='/dashboard'
          element={
            <SuspensedView>
              <Dashboard />
            </SuspensedView>
          }
        />
        <Route
          path='/dashboard/:type'
          element={
            <SuspensedView>
              <Dashboard />
            </SuspensedView>
          }
        />
        <Route
          path='/state'
          element={
            <SuspensedView>
              <State />
            </SuspensedView>
          }
        />
        <Route
          path='/subDistrict'
          element={
            <SuspensedView>
              <SubDistrict />
            </SuspensedView>
          }
        />
        <Route
          path='/district'
          element={
            <SuspensedView>
              <District />
            </SuspensedView>
          }
        />
        <Route
          path='/village'
          element={
            <SuspensedView>
              <Village />
            </SuspensedView>
          }
        />
        <Route
          path='/mobile-app-version-history'
          element={
            <SuspensedView>
              <AppVersionHistory />
            </SuspensedView>
          }
        />
        <Route
          path='/mobile-app-config-history'
          element={
            <SuspensedView>
              <AppConfigHistory />
            </SuspensedView>
          }
        />
        <Route
          path='/farmers'
          element={
            <SuspensedView>
              <Farmers />
            </SuspensedView>
          }
        />

        <Route
          path='/admin'
          element={
            <SuspensedView>
              <Admin />
            </SuspensedView>
          }
        />
        <Route
          path='/vle'
          element={
            <SuspensedView>
              <Vle />
            </SuspensedView>
          }
        />
        <Route
          path='/season'
          element={
            <SuspensedView>
              <Season />
            </SuspensedView>
          }
        />
           <Route
          path='/complaints'
          element={
            <SuspensedView>
              <ContactUs />
            </SuspensedView>
          }
        />
        <Route
          path='/change-password'
          element={
            <SuspensedView>
              <ChangePassword />
            </SuspensedView>
          }
        />
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes
