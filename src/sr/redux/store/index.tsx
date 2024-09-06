import {configureStore} from '@reduxjs/toolkit'
import sendOtpReducer from '../slice/sendOtp'
import otpReducer from '../slice/validateOtp'
import uploadFileReducer from '../upload/uploadFileReducer'
import {combineReducers} from 'redux'
// import logger from 'redux-logger'
import userReducer from '../slice/userSlice' // Import the new user slice
import stateTypeReducer from '../slice/stateSlice'
import loginUserSlice from '../slice/loginUserSlice'
import districtTypeReducer from '../slice/districtSlice'
import appConfigTypeReducer from '../slice/appConfigSlice'
import dashboardTypeReducer from '../slice/dashboardSlice'
import googleMapReducer from '../slice/googleMapSlice'

const rootReducer = combineReducers({
  sendOtp: sendOtpReducer,
  otp: otpReducer,
  file: uploadFileReducer,
  user: userReducer, // Add the user slice to the root reducer
  state: stateTypeReducer,
  district: districtTypeReducer,
  loginUser: loginUserSlice,
  appConfig: appConfigTypeReducer,
  dashobaord: dashboardTypeReducer,
  googleMap: googleMapReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // .concat(logger),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
