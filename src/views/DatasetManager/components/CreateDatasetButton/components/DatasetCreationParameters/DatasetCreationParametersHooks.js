// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DATASET_SOURCE_TYPE } from '../../../../../../services/config/ApiConstants';
import { useSolutionData } from '../../../../../../state/hooks/SolutionHooks';
import { TranslationUtils, ConfigUtils } from '../../../../../../utils';

export const useDatasetCreationParametersHooks = () => {
  const solutionData = useSolutionData();
  const { t } = useTranslation();

  const hardCodedDataSources = useMemo(() => {
    const dataSources = [
      {
        id: DATASET_SOURCE_TYPE.AZURE_STORAGE,
        labels: {
          en: 'Azure Storage',
          fr: 'Azure Storage',
        },
        parameters: [
          { id: 'azure-storage-account-name', varType: 'string', labels: { en: 'Account name', fr: 'Nom du compte' } },
          {
            id: 'azure-storage-container-name',
            varType: 'string',
            labels: { en: 'Container name', fr: 'Nom du container' },
          },
          { id: 'azure-storage-path', varType: 'string', labels: { en: 'Path', fr: 'Chemin' } },
        ],
      },
      {
        id: DATASET_SOURCE_TYPE.ADT,
        labels: {
          en: 'Azure Digital Twin',
          fr: 'Azure Digital Twin',
        },
        parameters: [{ id: 'adt-url', varType: 'string', labels: { en: 'Path', fr: 'Chemin' } }],
      },
      {
        id: DATASET_SOURCE_TYPE.LOCAL_FILE,
        labels: {
          en: 'Local file',
          fr: 'Fichier local',
        },
        parameters: [{ id: 'local-source-type', varType: '%DATASETID%', labels: { en: '', fr: '' } }],
      },
      {
        id: DATASET_SOURCE_TYPE.NONE,
        labels: {
          en: 'Empty',
          fr: 'Dataset vide',
        },
        parameters: [],
      },
    ];

    TranslationUtils.addTranslationRunTemplateLabels(dataSources);
    TranslationUtils.addTranslationParametersLabels(dataSources.flatMap((dataSource) => dataSource?.parameters));

    return dataSources;
  }, []);

  const dataSourceRunTemplates = useMemo(() => {
    const dataSources = solutionData.runTemplates.filter((runTemplate) => runTemplate?.tags.includes('datasource'));

    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;

    return [
      ...hardCodedDataSources,
      ...dataSources.map((dataSource) => {
        const dataSourceWithParameters = { ...dataSource };
        dataSourceWithParameters.parameters = parameters.filter((parameter) =>
          runTemplatesParameters[dataSource.id].includes(parameter.id)
        );
        return dataSourceWithParameters;
      }),
    ];
  }, [
    solutionData.parameters,
    solutionData.runTemplates,
    solutionData.runTemplatesParametersIdsDict,
    hardCodedDataSources,
  ]);

  console.log('dataSourceRunTemplates'); // NBO log to remove
  console.log(dataSourceRunTemplates); // NBO log to remove

  const dataSourceTypeEnumValues = useMemo(() => {
    return [
      ...dataSourceRunTemplates.map((dataSource) => {
        return {
          key: dataSource.id,
          value: t(TranslationUtils.getRunTemplateTranslationKey(dataSource.id), dataSource.label),
        };
      }),
    ];
  }, [t, dataSourceRunTemplates]);

  const getDataSource = useCallback(
    (dataSourceId) => {
      return dataSourceRunTemplates.find((dataSource) => dataSource.id === dataSourceId);
    },
    [dataSourceRunTemplates]
  );

  const isDataSourceTypeRunner = useCallback(
    (dataSourceId) => {
      return getDataSource(dataSourceId)?.tags != null && getDataSource(dataSourceId)?.tags?.includes('datasource');
    },
    [getDataSource]
  );

  // To refactor
  const getParameter = useCallback(
    (parameterId) => {
      return solutionData.parameters.find((parameter) => parameter.id === parameterId);
    },
    [solutionData.parameters]
  );

  // To refactor
  const getEnumValues = useCallback(
    (parameterId) => {
      const rawEnumValues = ConfigUtils.getParameterAttribute(getParameter(parameterId), 'enumValues') ?? [];

      return rawEnumValues.map((enumValue) => {
        const valueTranslationKey = TranslationUtils.getParameterEnumValueTranslationKey(parameterId, enumValue.key);
        const tooltipTranslationKey = TranslationUtils.getParameterEnumValueTooltipTranslationKey(
          parameterId,
          enumValue.key
        );
        return {
          key: enumValue.key,
          value: t(valueTranslationKey, enumValue.value),
          tooltip: t(tooltipTranslationKey, ''),
        };
      });
    },
    [t, getParameter]
  );

  // To refactor
  const getUploadFileLabels = useCallback(
    (parameterId) => {
      return {
        button: t('genericcomponent.uploadfile.button.browse'),
        invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
        label: t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId),
        delete: t('genericcomponent.uploadfile.tooltip.delete'),
        noFileMessage: t('genericcomponent.uploadfile.noFileMessage', 'None'),
        getFileNamePlaceholder: (fileExtension) =>
          t('genericcomponent.uploadfile.fileNamePlaceholder', '{{fileExtension}} file', { fileExtension }),
      };
    },
    [t]
  );

  // To refactor
  const getDefaultFileTypeFilter = useCallback(
    (parameterId) => {
      return getParameter(parameterId)?.options?.defaultFileTypeFilter;
    },
    [getParameter]
  );

  return {
    dataSourceRunTemplates,
    getEnumValues,
    dataSourceTypeEnumValues,
    isDataSourceTypeRunner,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
    getDataSource,
  };
};
