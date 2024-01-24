// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, select, takeEvery, call } from 'redux-saga/effects';
import { ETL_ACTIONS_KEY } from '../../../commons/ETLConstant';
import { Api } from '../../../../services/config/Api';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getUserName = (state) => state.auth.userName;

export function* createETL(action) {
  const ETL = action.ETL;
  const organizationId = action.organizationId;
  const ownerName = yield select(getUserName);
  ETL.ownerName = ownerName;
  try {
    yield call(Api.ETL.createETL, organizationId, ETL);
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.ETLNotCreated', "ETL hasn't been created"))
    );
  }
}

function* createETLData() {
  yield takeEvery(ETL_ACTIONS_KEY.CREATE_ETL, createETL);
}

export default createETLData;
