// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ConfigUtils } from '../../../../utils/ConfigUtils';
import { VAR_TYPES_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/VarTypesComponentsMapping';
import PropTypes from 'prop-types';
import { useScenarioResetValues } from '../../ScenarioParameters';

const DatasetParameterInput = ({ parameterData }) => {
  const subType = ConfigUtils.getParameterAttribute(parameterData, 'subType');
  const parameterVarType = ConfigUtils.buildExtendedVarType(parameterData.varType, subType);
  let varTypeFactory;

  const { resetField } = useFormContext();
  const scenarioResetValues = useScenarioResetValues();

  const scenarioIdOnMount = useRef(parentId);

  if (parameterVarType in VAR_TYPES_COMPONENTS_MAPPING) {
    varTypeFactory = VAR_TYPES_COMPONENTS_MAPPING[parameterVarType];
  } else {
    varTypeFactory = VAR_TYPES_COMPONENTS_MAPPING[parameterData.varType];
  }
  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterVarType);
    return null;
  }
  if (varTypeFactory === null) {
    return null;
  }
  const rules = varTypeFactory.useValidationRules ? varTypeFactory.useValidationRules(parameterData) : undefined;

  return (
    <Controller
      name={parameterData.id}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value: parameterValue, onChange: setRhfValue } = field;
        const { isDirty, error } = fieldState;
        const setParameterValue = (newValue) => {
          if (scenarioIdOnMount.current === parentId) {
            setRhfValue(newValue);
          }
        };

        const resetParameterValue = (newDefaultValue) => {
          if (scenarioIdOnMount.current === parentId) {
            resetField(parameterData.id, { defaultValue: newDefaultValue });
          }
        };

        const props = {
          parameterData,
          context,
          key: parameterData.id,
          parameterValue,
          setParameterValue,
          isDirty,
          defaultParameterValue: scenarioResetValues[parameterData.id],
          resetParameterValue,
          error,
        };
        // name property helps distinguish React components from factories
        if ('name' in varTypeFactory) {
          return React.createElement(varTypeFactory, props);
        }

        // Factories as a function are not supported
        throw new Error(`
          Factories as a function are no longer supported for scenario parameter input.
          Please update your factories to React components (see migration guide for further instructions).
        `);
      }}
    />
  );
};
DatasetParameterInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parentId: PropTypes.object.isRequired,
};
export default DatasetParameterInput;
