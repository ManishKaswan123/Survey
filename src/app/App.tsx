import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from 'sr/layout/master-layout'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <Outlet />
      </LayoutProvider>
    </Suspense>
  )
}

export {App}
