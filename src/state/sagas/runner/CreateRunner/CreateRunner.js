// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, fork } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

function* handleFileParameter(parameter, organizationId, workspaceId) {
  try {
    const connectorId = parameter.connectorId;
    const file = parameter.file;

    if (!connectorId) {
      throw new Error(`Missing connector id in configuration file for scenario parameter ${parameter.id}`);
    }
    const newDataset = {
      name: parameter.id,
      description: parameter.description,
      connectorId,
      tags: ['dataset_part'],
      main: false,
    };
    const { id: datasetId, connector } = yield call(Api.Datasets.createDataset, organizationId, newDataset);
    const newConnector = { ...connector };

    const updatedDataset = { ...newDataset, connector: newConnector };
    yield call(Api.Datasets.updateDataset, organizationId, datasetId, updatedDataset);

    const destination = '';
    yield call(Api.Workspaces.uploadWorkspaceFile, organizationId, workspaceId, true, destination, file);
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.runnerDatasetPartNotCreated',
          `Runner dataset {{datasetName}} part hasn't been created`,
          {
            datasetName: parameter.id,
          }
        )
      )
    );
  }
}

export function* createRunner(action) {
  console.log('createRunner action'); // NBO log to remove
  console.log(action); // NBO log to remove

  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runner = action.runner;
    const parameters = runner.parameters;

    yield parameters.forEach((parameter) => {
      if (parameter.varType !== '%DATASETID%') fork(handleFileParameter, parameter, organizationId, workspaceId);
    });

    yield call(Api.Runner.createRunner, organizationId, workspaceId, runner);
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.runnerNotCreated', "Runner hasn't been created")
      )
    );
  }
}

function* createRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_RUNNER, createRunner);
}

export default createRunnerSaga;
