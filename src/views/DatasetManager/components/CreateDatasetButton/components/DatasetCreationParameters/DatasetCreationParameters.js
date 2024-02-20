// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
import { BasicTextInput, UploadFile, BasicEnumInput } from '@cosmotech/ui';
import { TranslationUtils } from '../../../../../../utils';
import { FileManagementUtils } from '../../../../../../utils/FileManagementUtils';
import { useDatasetCreationParametersHooks } from '../DatasetCreationParameters/DatasetCreationParametersHooks';

export const DatasetCreationParameters = () => {
  const { t } = useTranslation();
  const {
    getParameterEnumValues,
    dataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
    getDataSource,
  } = useDatasetCreationParametersHooks();

  const [dataSourceType, setDataSourceType] = useState(dataSourceTypeEnumValues[0].key);

  const forgeInput = (parameter) => {
    const parameterId = parameter.id;
    const inputType = parameter.varType;
    return (
      <Controller
        key={parameterId}
        name={parameterId}
        rules={{ required: true }}
        render={({ field }) => {
          const { value, onChange } = field;
          if (inputType === 'string') {
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
          } else if (inputType === 'enum') {
            const textFieldProps = {
              disabled: false,
              id: `enum-input-${parameterId}`,
            };
            const enumValues = getParameterEnumValues(parameterId);
            return (
              <Grid item xs={6} sx={{ pt: 2 }}>
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
          } else if (inputType === '%DATASETID%') {
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
          } else {
            console.error('DataSource parameter vartype unknown');
            return null;
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
      <Grid item xs={7}>
        <Controller
          name="sourceType"
          defaultValue={dataSourceType}
          shouldUnregister={true}
          render={({ field }) => {
            const { value, onChange } = field;
            const setDatasetSource = (newValue) => {
              onChange(newValue);
              setDataSourceType(newValue);
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
      <Grid item container xs={12} sx={{ px: 2, pt: 3 }}>
        {getDataSource(dataSourceType)?.parameters?.map((parameter) => {
          return forgeInput(parameter);
        })}
      </Grid>
    </>
  );
};
