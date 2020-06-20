/**
 * @file combinReducers reducers
 */

import { combineReducers } from 'redux'

import publicData from './public'
import signalmanagement from './signalmanagement'

const rootReducer = combineReducers({
  publicData,
  signalmanagement,
})

export default rootReducer