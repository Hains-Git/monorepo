import React from 'react';
import { FaCloudDownloadAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { User } from '../helper/ts_types';
import { models } from './models';

import styles from './app.module.css';
import Table from '../components/utils/table/Table';
import Form from '../components/datenbank/Form';
import SearchData from '../components/utils/table/SearchData';
import { UseDatenbank } from '../hooks/use-datenbank';
import DateInput from '../components/utils/date-input/DateInput';
import Loader from '../components/utils/loader/Loader';
import Preview from '../components/datenbank/Preview';
import CustomButton from '../components/utils/custom-button/CustomButton';

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const {
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
    previewHandler,
    previewData,
    previewHeadRows,
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
  } = UseDatenbank(user, hainsOAuth);

  return (
    <div className={styles.db}>
      {isDienstplaner && selectedModel ? (
        <div>
          <div className={styles.head}>
            <div>
              <select value={selectedModel.routeBase} onChange={selectHandler}>
                {models.map((el) => (
                  <option
                    key={el.routeBase}
                    title={el.description}
                    value={el.routeBase}
                  >
                    {el.label}
                  </option>
                ))}
              </select>
              {showDataLoader && <Loader />}
            </div>
            {hasForm && (
              <CustomButton
                className={styles.showFormButton}
                title="Formular ein-/ausblenden"
                clickHandler={() => setShowForm((show) => !show)}
              >
                {showForm ? <FaEye /> : <FaEyeSlash />} Formular
              </CustomButton>
            )}
          </div>

          {hasForm && (
            <Form
              showForm={showForm}
              user={user}
              hainsOauth={hainsOAuth}
              model={selectedModel}
              row={currentRow}
              removeRow={removeRow}
              reset={() => setCurrentRow(() => null)}
              addRows={addRows}
            />
          )}

          <div className={styles.options}>
            <SearchData search={search} data={data} />
            {selectedModel?.selectVKDay && (
              <DateInput
                label={vks ? <FaCloudDownloadAlt title="Laden" /> : <Loader />}
                getData={setTagHandler}
              />
            )}
            {hasPreview && (
              <>
                <Preview
                  route={selectedModel.previewRoute}
                  hainsOAuth={hainsOAuth}
                  setData={previewHandler}
                />
                {!!previewData.length && (
                  <CustomButton
                    className={styles.preview_toggle}
                    title="Vorschau ein-/ausblenden"
                    clickHandler={() => setShowPreview((prev) => !prev)}
                  >
                    {showPreview ? <FaEye /> : <FaEyeSlash />}
                  </CustomButton>
                )}
              </>
            )}
          </div>

          <Table
            data={filteredData}
            headRows={headRows}
            options={tableOptions}
          />

          {previewData?.length && hasPreview && showPreview ? (
            <div className={styles.preview_container}>
              <div>
                <SearchData search={searchPreview} data={previewData} />
                <CustomButton
                  title="Schließen"
                  clickHandler={() => setShowPreview(() => false)}
                >
                  X
                </CustomButton>
              </div>
              <Table
                data={filteredPreviewData}
                headRows={previewHeadRows}
                options={previewTableOptions}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p>Bitte einloggen!</p>
      )}
    </div>
  );
}

export default App;
