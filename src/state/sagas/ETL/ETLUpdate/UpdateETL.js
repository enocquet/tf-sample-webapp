// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, select, takeEvery, call } from 'redux-saga/effects';
import { ETL_ACTIONS_KEY } from '../../../commons/ETLConstant';
import { Api } from '../../../../services/config/Api';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getUserName = (state) => state.auth.userName;

export function* updateETL(action) {
  const ETL = action.ETL;
  const organizationId = action.organizationId;
  const ownerName = yield select(getUserName);
  ETL.ownerName = ownerName;
  try {
    yield call(Api.ETL.updateETL, organizationId, ETL);
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.ETLUpdate', "ETL hasn't been updated"))
    );
  }
}

function* updateETLData() {
  yield takeEvery(ETL_ACTIONS_KEY.CREATE_ETL, updateETL);
}

export default updateETLData;
