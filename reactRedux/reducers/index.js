/**
 * @file combinReducers reducers
 */

import { combineReducers } from 'redux'

import publicData from './public'
import signalmanagement from './signalmanagement'
import equipmentManagement from './equipmentManagement'

const rootReducer = combineReducers({
  publicData,
  signalmanagement,
  equipmentManagement,
})

export default rootReducer
