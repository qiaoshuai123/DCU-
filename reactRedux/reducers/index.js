/**
 * @file combinReducers reducers
 */

import { combineReducers } from 'redux'

import publicData from './public'
import SignalManagement from './signalmanagement'

const rootReducer = combineReducers({
  publicData,
  SignalManagement,
})

export default rootReducer
