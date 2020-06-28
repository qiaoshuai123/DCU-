/**
 * @file combinReducers reducers
 */

import { combineReducers } from 'redux'

import publicData from './public'
import SignalManagement from './signalmanagement'
import equipmentManagement from './equipmentManagement'

const rootReducer = combineReducers({
  publicData,
  SignalManagement,
  equipmentManagement,
})

export default rootReducer
