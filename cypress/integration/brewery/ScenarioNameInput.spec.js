import { Login, Scenarios } from '../../commons/actions';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';

describe('Check error label when invalid scenario name', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
    Login.login();
  });
  beforeEach(() => {
    Login.relogin();
  });
  it('check error label when scenario name field is empty', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogMasterCheckbox().click();
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().contains('empty');
  });

  it('check error label when scenario name contains invalid characters', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogNameField().type('InvalidScenarioName&');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().contains('underscores');
  });
});