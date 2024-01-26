// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useContext, useEffect, useMemo } from 'react';

import { Grid, Stack } from '@mui/material';
import DatasetParameterInput from 'ScenarioParameterInput';
import PropTypes from 'prop-types';
import { useCurrentDatasetId, useCurrentDataset } from '../../../../../../state/hooks/DatasetHooks';

const DatasetResetValuesContext = React.createContext();

const DatasetParameters = ({ parameters }) => {
  const currentDatasetId = useCurrentDatasetId();
  const currentDataset = useCurrentDataset();

  const datasetResetValues = useMemo(
    () => getDatasetParametersValue(),

    [generateParametersValuesFromOriginalValues]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack spacing={2} alignItems="stretch" direction="column" justifyContent="center">
          {parameters.map((parameter) => (
            <DatasetParameterInput
              key={`${currentDatasetId}_${parameter.id}`}
              parameterData={parameter}
              context={context}
              parentId={currentDatasetId}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

DatasetParameters.propTypes = {
  parameters: PropTypes.object.isRequired,
};

export default DatasetParameters;
export const useScenarioResetValues = () => {
  return useContext(DatasetResetValuesContext);
};
