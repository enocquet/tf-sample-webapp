// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicTextInput } from '@cosmotech/ui';
import { useParameterConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { TranslationUtils } from '../../../../utils';

export const GenericTextInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: `text-input-${parameterData.id}`,
  };

  return (
    <Grid item xs={3}>
      <BasicTextInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue ?? ''}
        changeTextField={setParameterValue}
        textFieldProps={textFieldProps}
        isDirty={isDirty}
        error={error}
      />
    </Grid>
  );
};

GenericTextInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};
GenericTextInput.defaultProps = {
  isDirty: false,
};
GenericTextInput.useValidationRules = (parameterData) => {
  const { t } = useTranslation();
  const { getParameterConstraintValidation } = useParameterConstraintValidation(parameterData);
  const getStringSizeInBytes = (string) => new Blob([string]).size;
  const minLength = parameterData?.options?.minLength ?? 0;
  return {
    required: {
      value: minLength > 0,
      message: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    },
    minLength: {
      value: minLength,
      message: t(
        'views.scenario.scenarioParametersValidationErrors.minLength',
        'Minimum length of this field is {{length}} characters',
        { length: minLength }
      ),
    },
    maxLength: {
      value: parameterData?.options?.maxLength,
      message: t(
        'views.scenario.scenarioParametersValidationErrors.maxLength',
        'Maximum length of this field is {{length}} characters',
        { length: parameterData?.options?.maxLength }
      ),
    },
    validate: {
      // 65535 is max length accepted by CosmoTech API
      respectsStringSizeInBytes: (v) => {
        return (
          getStringSizeInBytes(v) < 65535 ||
          t(
            'views.scenario.scenarioParametersValidationErrors.maxLengthForApi',
            'This text exceeds the maximum possible length for a scenario parameter'
          )
        );
      },
      constraint: (v) => getParameterConstraintValidation(v),
    },
  };
};
