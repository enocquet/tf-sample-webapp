import { all, fork } from 'redux-saga/effects';
import { createRunner } from './CreateRunner';

export default function* runnerSaga() {
  yield all([fork(createRunner)]);
}
