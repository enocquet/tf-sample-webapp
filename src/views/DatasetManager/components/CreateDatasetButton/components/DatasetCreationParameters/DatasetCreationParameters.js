// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState, useMemo, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { BasicTextInput, UploadFile, BasicEnumInput } from '@cosmotech/ui';
import { TranslationUtils } from '../../../../../../utils';
import { FileManagementUtils } from '../../../../../../utils/FileManagementUtils';
import { useDatasetCreationParametersHooks } from '../DatasetCreationParameters/DatasetCreationParametersHooks';

export const DatasetCreationParameters = (props) => {
  const { setIsRunner } = props;
  const { t } = useTranslation();
  const {
    dataSourceRunTemplates,
    getEnumValues,
    dataSourceTypeEnumValues,
    isDataSourceTypeRunner,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
    getDataSource,
  } = useDatasetCreationParametersHooks();

  const [dataSourceType, setDataSourceType] = useState(dataSourceTypeEnumValues[0].key);

  const INPUT_TYPE = useMemo(() => {
    return { TEXT_INPUT: 'TEXT_INPUT', ENUM_INPUT: 'ENUM_INPUT', FILE_INPUT: 'FILE_INPUT' };
  }, []);

  const forgeInput = (parameterId, inputType) => {
    return (
      <Controller
        key={parameterId + '_controller'}
        name={parameterId}
        rules={{ required: true }}
        render={({ field }) => {
          const { value, onChange } = field;
          if (inputType === INPUT_TYPE.TEXT_INPUT) {
            const input = (
              <Grid item xs={12} sx={{ pt: 1 }}>
                <BasicTextInput
                  id={parameterId}
                  key={parameterId}
                  label={t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId)}
                  tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                  size="medium"
                  value={value ?? ''}
                  changeTextField={(newValue) => onChange(newValue)}
                />
              </Grid>
            );
            return input;
          } else if (inputType === INPUT_TYPE.ENUM_INPUT) {
            const textFieldProps = {
              disabled: false,
              id: `enum-input-${parameterId}`,
            };
            const enumValues = getEnumValues(parameterId);
            return (
              <Grid item xs={5} sx={{ pt: 1 }}>
                <BasicEnumInput
                  key={parameterId}
                  id={parameterId}
                  label={t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId)}
                  tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                  value={value ?? enumValues?.[0]?.key ?? ''}
                  changeEnumField={onChange}
                  textFieldProps={textFieldProps}
                  enumValues={enumValues}
                />
              </Grid>
            );
          } else if (inputType === INPUT_TYPE.FILE_INPUT) {
            const { value, onChange } = field;
            return (
              <Grid item xs={12} sx={{ pt: 1 }}>
                <UploadFile
                  id={parameterId}
                  key={parameterId}
                  labels={getUploadFileLabels(parameterId)}
                  tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                  handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, onChange)}
                  editMode={true}
                  handleDeleteFile={() => onChange({})}
                  file={value ?? {}}
                  acceptedFileTypes={getDefaultFileTypeFilter(parameterId)}
                />
              </Grid>
            );
          }
        }}
      />
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ py: 2 }}>
          {t('commoncomponents.datasetmanager.wizard.secondScreen.subtitle', 'Please provide your data source')}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="sourceType"
          defaultValue={dataSourceType}
          shouldUnregister={true}
          render={({ field }) => {
            const { value, onChange } = field;
            const setDatasetSource = (newValue) => {
              onChange(newValue);
              setDataSourceType(newValue);
              setIsRunner(isDataSourceTypeRunner(newValue));
            };
            return (
              <BasicEnumInput
                id="new-dataset-sourceType"
                label={t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.label', 'Source')}
                size="medium"
                value={value ?? dataSourceTypeEnumValues[0].key}
                changeEnumField={(newValue) => setDatasetSource(newValue)}
                enumValues={dataSourceTypeEnumValues}
              />
            );
          }}
        />
      </Grid>
      <Grid item container xs={12}>
        {getDataSource(dataSourceType)?.parameters?.map((parameter) => {
          console.log('parameterId'); // NBO log to remove
          console.log(parameter.id); // NBO log to remove
          if (parameter.varType === '%DATASETID%') {
            return forgeInput(parameter.id, INPUT_TYPE.FILE_INPUT);
          } else if (parameter.varType === 'string') {
            return forgeInput(parameter.id, INPUT_TYPE.TEXT_INPUT);
          } else if (parameter.varType === 'enum') {
            return forgeInput(parameter.id, INPUT_TYPE.ENUM_INPUT);
          } else {
            console.error('DataSource parameter vartype unknown');
            return null;
          }
        })}
      </Grid>
    </>
  );
};

DatasetCreationParameters.propTypes = {
  setIsRunner: PropTypes.func.isRequired,
};
