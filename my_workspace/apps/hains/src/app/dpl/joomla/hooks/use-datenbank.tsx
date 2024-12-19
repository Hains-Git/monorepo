import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState
} from 'react';
import { FaCopy, FaEdit } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import { UseMounted } from './use-mounted';
import { HeadRow, TableData } from '../components/utils/table/types/table';
import { DBModel, models } from '../datenbank/models';
import { Reason, User } from '../helper/ts_types';
import { returnError } from '../helper/hains';
import styles from '../datenbank/app.module.css';
import { defaultSearch } from '../components/utils/table/SearchData';
import { development } from '../helper/flags';
import { TableOptions } from '../components/utils/table/Table';
import CustomButton from '../components/utils/custom-button/CustomButton';
import { GetData } from '../components/utils/date-input/DateInput';

export const UseDatenbank = (user: User, hainsOAuth: any) => {
  const [selectedModel, setSelectedModel] = useState<DBModel | null>(null);
  const [vks, setVks] = useState<any>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [headRows, setHeadRows] = useState<HeadRow[]>([
    { columns: models[0].columns }
  ]);
  const [currentRow, setCurrentRow] = useState<TableData | null>(null);
  const [tag, setTag] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [previewData, setPreviewData] = useState<TableData[]>([]);
  const [filteredPreviewData, setFilteredPreviewData] = useState<TableData[]>(
    []
  );
  const [previewHeadRows, setPreviewHeadRows] = useState<HeadRow[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [showDataLoader, setShowDataLoader] = useState<boolean>(false);
  const [tableOptions, setTableOptions] = useState<TableOptions>({
    className: styles.table,
    fixColumns: [0]
  });
  const [previewTableOptions, setPreviewTableOptions] = useState<TableOptions>({
    containerClassname: styles.preview_table_container,
    className: `${styles.table} ${styles.preview_table}`,
    fixColumns: [0],
    body: {
      paging: 20
    }
  });

  const mounted = UseMounted();
  const history = useHistory();
  const location = useLocation();

  const isDienstplaner = !!user?.is_dienstplaner;
  const isAdmin = !!user?.is_admin;
  const hasForm = !!(isAdmin && selectedModel?.getForm);
  const hasPreview = !!(
    selectedModel?.previewRoute && selectedModel?.formatPreview
  );

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(searchValue, _data, headRows, (newData: TableData[]) => {
        mounted && setFilteredData(() => newData);
      });
    },
    [headRows, mounted, setFilteredData]
  );

  const searchPreview = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(
        searchValue,
        _data,
        [{ columns: previewHeadRows[0].columns.slice(0, 3) }],
        (newData: TableData[]) => {
          mounted && setFilteredPreviewData(() => newData);
        }
      );
    },
    [previewHeadRows, mounted, setFilteredPreviewData]
  );

  const removeRow = (row: TableData) => {
    if (!row) return;
    setData((_data) => _data.filter((el) => el.id !== row.id));
  };

  const addRows = (rows: TableData[]) => {
    setData((_data) => {
      const newData = [..._data];
      rows.forEach((row) => {
        const index = newData.findIndex((el) => el?.id === row?.id);
        if (index >= 0) newData[index] = row;
        else newData.push(row);
      });
      return (vks && selectedModel?.selectVKDay?.(vks, newData)) || newData;
    });
    setCurrentRow(() => null);
  };

  const selectHandler: ChangeEventHandler<HTMLSelectElement> = (
    evt: ChangeEvent<HTMLSelectElement>
  ) => {
    const newModel = models.find((el) => el.routeBase === evt.target.value);
    if (newModel) {
      setSelectedModel(() => newModel);
      setTableOptions((currObj) => ({
        ...currObj,
        fixColumns: newModel.fixColumns
      }));
      setPreviewTableOptions((currObj) => ({
        ...currObj,
        fixColumns: newModel.fixPreviewColumns
      }));
      history.push(`${history.location.pathname}?model=${newModel.routeBase}`);
    }
  };

  const previewHandler = (res: any) => {
    if (!mounted || !selectedModel?.formatPreview) return;
    const result = selectedModel.formatPreview(res);
    setPreviewData(() => result.data);
    setPreviewHeadRows(() => [{ columns: result.columns }]);
  };

  const renderEditButton = useCallback(
    (row: TableData) => (
      <CustomButton
        className={styles.editButton}
        clickHandler={() => {
          setCurrentRow(() => ({ ...row }));
          setShowForm(() => true);
        }}
        aria-label="Bearbeiten"
        title="Datensatz bearbeiten"
      >
        <FaEdit />
      </CustomButton>
    ),
    [setCurrentRow, setShowForm]
  );

  const renderCopyButton = useCallback(
    (row: TableData) => (
      <CustomButton
        className={styles.editButton}
        clickHandler={() => {
          setCurrentRow(() => ({ ...row, id: undefined }));
          setShowForm(() => true);
        }}
        aria-label="Bearbeiten"
        title="Datensatz bearbeiten"
      >
        <FaCopy />
      </CustomButton>
    ),
    [setCurrentRow, setShowForm]
  );

  const getVks = (
    _data: TableData[],
    _tag: string,
    finishLoading?: () => void
  ) => {
    setVks(() => null);
    if (!selectedModel?.selectVKDay && hainsOAuth?.api && tag) {
      finishLoading?.();
      return;
    }
    hainsOAuth
      .api('get_team_vks', 'get', {
        tag
      })
      .then(
        (res: any) => {
          const dataWithVK =
            isDienstplaner &&
            mounted &&
            selectedModel?.selectVKDay?.(res, _data);
          if (dataWithVK) {
            setData(() => dataWithVK);
            setVks(() => res);
          }
          finishLoading?.();
        },
        (err: Reason) => {
          finishLoading?.();
          returnError(err);
        }
      );
  };

  const setTagHandler: GetData = (dates, finishLoading) => {
    setTag(() => dates.von);
    getVks(data, dates.von, finishLoading);
  };

  useEffect(() => {
    if (!mounted || !hainsOAuth || !isDienstplaner) return;
    const routeModel = new URLSearchParams(location.search).get('model');
    const newModel =
      models.find((el) => el.routeBase === routeModel) || models[0];
    if (newModel) {
      setSelectedModel(() => newModel);
      setTableOptions((currObj) => ({
        ...currObj,
        fixColumns: newModel.fixColumns
      }));
      setPreviewTableOptions((currObj) => ({
        ...currObj,
        fixColumns: newModel.fixPreviewColumns
      }));
    }

    return () => {
      setSelectedModel(() => null);
      setTableOptions((currObj) => ({
        ...currObj,
        fixColumns: [0]
      }));
      setPreviewTableOptions((currObj) => ({
        ...currObj,
        fixColumns: [0]
      }));
    };
  }, [user, mounted, hainsOAuth, location]);

  useEffect(() => {
    if (!isDienstplaner || !selectedModel || !hainsOAuth.api || !mounted)
      return;
    setShowDataLoader(() => true);
    hainsOAuth
      .api('db_list', 'get', {
        routeBase: selectedModel.routeBase
      })
      .then(
        (res: any) => {
          if (!mounted || !isDienstplaner || !hainsOAuth) return;
          if (!Array.isArray(res)) return;
          getVks(res, tag);
          setData(() => res);
          setShowDataLoader(() => false);
        },
        (err: Reason) => {
          setShowDataLoader(() => false);
          returnError(err);
        }
      );
    const columns = [...selectedModel.columns];
    if (hasForm || selectedModel?.replaceEdit) {
      if (selectedModel?.createData && !selectedModel?.replaceEdit) {
        columns.push({
          title: 'Kopieren',
          dataKey: '',
          getColumnClass: () => styles.right_sticky,
          bodyRender: renderCopyButton
        });
      }
      columns.push({
        title: 'Bearbeiten',
        dataKey: '',
        getColumnClass: () => styles.right_sticky,
        bodyRender: selectedModel?.replaceEdit || renderEditButton
      });
    }
    setHeadRows([{ columns }]);

    return () => {
      setData(() => []);
      setHeadRows(() => []);
      setCurrentRow(() => null);
      setVks(() => null);
      if (!development) {
        setPreviewData(() => []);
        setPreviewHeadRows(() => []);
      }
    };
  }, [selectedModel, user, mounted, hainsOAuth]);

  return {
    isDienstplaner,
    selectedModel,
    selectHandler,
    hasForm,
    setShowForm,
    showForm,
    currentRow,
    setCurrentRow,
    headRows,
    vks,
    data,
    search,
    filteredData,
    setTagHandler,
    mounted,
    previewData,
    previewHeadRows,
    previewHandler,
    hasPreview,
    showPreview,
    setShowPreview,
    addRows,
    removeRow,
    showDataLoader,
    tableOptions,
    previewTableOptions,
    searchPreview,
    filteredPreviewData
  };
};
