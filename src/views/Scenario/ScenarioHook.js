// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useScenarioList,
  useSetScenarioValidationStatus,
  useFindScenarioById,
  useUpdateAndLaunchScenario,
  useLaunchScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasetList, useAddDatasetToStore } from '../../state/hooks/DatasetHooks';
import { useUser } from '../../state/hooks/AuthHooks';
import { useWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';

export const useScenario = () => {
  const scenarioList = useScenarioList();
  const datasetList = useDatasetList();
  const currentScenario = useCurrentScenario();
  const user = useUser();
  const workspace = useWorkspace();
  const solution = useSolution();

  const addDatasetToStore = useAddDatasetToStore();

  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();

  const updateAndLaunchScenario = useUpdateAndLaunchScenario();
  const launchScenario = useLaunchScenario();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    scenarioList,
    datasetList,
    currentScenario,
    user,
    workspace,
    solution,
    addDatasetToStore,
    setScenarioValidationStatus,
    findScenarioById,
    updateAndLaunchScenario,
    launchScenario,
    setApplicationErrorMessage,
  };
};