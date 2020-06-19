/**
 * @file combinReducers reducers
 */

import { combineReducers } from 'redux'

import publics from './public'
import signalmanagement from './signalmanagement'

const rootReducer = combineReducers({
  publics,
  signalmanagement,
})

export default rootReducer