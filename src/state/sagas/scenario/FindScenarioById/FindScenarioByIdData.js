// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { SCENARIO_ENDPOINT, SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * findScenarioByIdData (action) {
  // yield keyword is here to milestone and save the action
  const { data } = yield axios.get(SCENARIO_ENDPOINT.FIND_SCENARIO_BY_ID, { params: { id: action.scenarioId } });
  yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: STATUSES.SUCCESS, scenario: data } });
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * getScenarioByIdData () {
  yield takeLatest(SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID, findScenarioByIdData);
}

export default getScenarioByIdData;
