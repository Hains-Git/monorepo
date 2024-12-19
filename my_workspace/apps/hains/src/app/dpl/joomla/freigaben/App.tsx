import React from 'react';
import { User } from '../helper/ts_types';

import styles from './app.module.css';
import Table from '../components/utils/table/Table';
import SearchData from '../components/utils/table/SearchData';
import Form from '../components/freigaben/Form';
import Funktionen from '../components/freigaben/Funktionen';
import Freigabetypen from '../components/freigaben/Freigabetypen';
import Freigabestatuse from '../components/freigaben/Freigabestatuse';
import { UseFreigaben } from '../hooks/use-freigaben';
import Loader from '../components/utils/loader/Loader';

const options = {
  containerStyle: { maxHeight: '80vh' },
  fixColumns: [0, 1, 2]
};

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const {
    setFormData,
    hashes,
    funktionenIds,
    setFunktionenIds,
    freigabetypenIds,
    setFreigabetypenIds,
    search,
    filteredData,
    currentData,
    currentHeadRows,
    formData,
    formHandler,
    showLoader
  } = UseFreigaben(user, hainsOAuth);

  const getPage = () => {
    if (!user) return <p>Bitte einloggen!</p>;
    if (!user.is_dienstplaner) return <p>Keine Berechtigung!</p>;
    return (
      <div>
        <div className={styles.legende_container}>
          <Freigabestatuse freigabestatuse={hashes.freigabestatuse.original} />
          <Funktionen
            funktionen={hashes.funktionen.original}
            funktionenIds={funktionenIds}
            setFunktionenIds={setFunktionenIds}
          />
          <Freigabetypen
            freigabetypen={hashes.freigabetypen.original}
            freigabetypenIds={freigabetypenIds}
            setFreigabetypenIds={setFreigabetypenIds}
          />
        </div>
        <div className={styles.options}>
          <SearchData search={search} data={filteredData} />
          {showLoader && <Loader />}
        </div>
        <Table
          data={currentData}
          headRows={currentHeadRows}
          options={options}
        />
        <Form
          formData={formData}
          formHandler={formHandler}
          closeForm={() => setFormData(() => null)}
          freigabestatuse={hashes.freigabestatuse.original}
        />
      </div>
    );
  };

  return (
    <div
      className={styles.freigaben}
      onClick={(evt) => {
        evt.stopPropagation();
        setFormData(() => null);
      }}
    >
      {getPage()}
    </div>
  );
}

export default App;
