import React, { useState, useContext, useEffect } from 'react';
import { FaEdit, FaWindowClose, FaBan, FaCheck } from 'react-icons/fa';

import { NotesContext } from '../../context/mitarbeiterinfo/NotesProvider';

import Input from './form/Input';
import Textarea from './form/Textarea';
import Select from './form/Select';
import CustomButton from '../utils/custom-button/CustomButton';
import { TNote, TNoteCategory } from '../../helper/api_data_types';
import Table from '../utils/table/Table';
import { HeadRow, TableData } from '../utils/table/types/table';

import { convertDateInGermanDateTimeFormat } from '../../helper/util';

import styles from '../../mitarbeiterinfo/app.module.css';

type TObjKey = {
  [key: string]: any;
};

export default function SectionNote() {
  const { notes, noteCategories, onUpdateNote, addNewCategory } =
    useContext(NotesContext);

  const [noteId, setNoteId] = useState('');
  const [showHistoryByNoteId, setShowHistoryByNoteId] = useState('');
  const [title, setTitle] = useState('');
  const [isShowingNeuCategory, setIsShowingNewCategory] = useState(false);

  useEffect(() => {
    if (!noteId) {
      setTitle('');
    }
  }, [noteId]);

  const onChangeCategory = (val: string) => {
    if (val === '0') {
      setIsShowingNewCategory(true);
    } else {
      setIsShowingNewCategory(false);
    }
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const _form: HTMLFormElement = event.currentTarget;
    const formData = new FormData(_form);

    const note: TObjKey = { note_id: noteId };

    for (const pair of [...formData.entries()]) {
      const key = pair[0];
      note[key] = pair[1];
    }

    if (
      isShowingNeuCategory &&
      note?.note_category_id === '0' &&
      note?.category !== ''
    ) {
      addNewCategory(note as TNoteCategory);
    }
    if (
      !isShowingNeuCategory &&
      note?.title !== '' &&
      note?.notiz !== '' &&
      note?.category !== ''
    ) {
      onUpdateNote(note as TNote);
    }
  };

  const renderEditBtn = (row: any) => {
    return (
      <span
        onClick={() => {
          setTitle(row.title);
          setNoteId((cur) => {
            if (cur === row.id) {
              return;
            }
            return row.id;
          });
        }}
        className={styles.edit_btn}
      >
        {row.id === noteId ? <FaWindowClose /> : <FaEdit />}
      </span>
    );
  };

  const renderPrivateColumn = (row: any) => {
    const icon = row.private_note ? <FaCheck /> : <FaBan />;
    return <span>{icon}</span>;
  };

  const onShowHistory = (id: string) => {
    setShowHistoryByNoteId((cur: string) => {
      if (cur === id) {
        return '';
      }
      return id;
    });
  };

  const renderTitle = (row: any) => {
    return (
      <>
        <div onClick={() => onShowHistory(row.id)} className="note_creator">
          <p>{row.title}</p>
        </div>
        {row.id === showHistoryByNoteId && (
          <div className={styles.note_history}>
            {row.notes_history.map((history: TNote) => {
              return <p key={history.id}>{history?.notiz}</p>;
            })}
            <p>{row.notiz}</p>
          </div>
        )}
      </>
    );
  };

  const renderCreator = (row: any) => {
    return (
      <>
        <div onClick={() => onShowHistory(row.id)} className="note_creator">
          <p>{row.ersteller.name}</p>
        </div>
        {row.id === showHistoryByNoteId && (
          <div className={styles.note_history}>
            {row.notes_history.map((history: TNote) => {
              return <p key={history.id}>{history?.ersteller.name}</p>;
            })}
            <p>{row.ersteller.name}</p>
          </div>
        )}
      </>
    );
  };

  const renderCreatedAt = (row: any) => {
    return (
      <>
        <div onClick={() => onShowHistory(row.id)} className="note_creator">
          <p>{convertDateInGermanDateTimeFormat(row.created_at)}</p>
        </div>
        {row.id === showHistoryByNoteId && (
          <div className={styles.note_history}>
            {row.notes_history.map((history: TNote) => {
              return (
                <p key={history.id}>
                  {convertDateInGermanDateTimeFormat(history?.created_at || '')}
                </p>
              );
            })}
            <p>{convertDateInGermanDateTimeFormat(row.created_at)}</p>
          </div>
        )}
      </>
    );
  };

  const headRows: HeadRow[] = [
    {
      columns: [
        { title: '', dataKey: '', bodyRender: renderEditBtn },
        { title: 'Kategorie', dataKey: 'note_category.category' },
        { title: 'Notiztitel', dataKey: 'title', bodyRender: renderTitle },
        {
          title: 'Ersteller',
          dataKey: 'ersteller.name',
          bodyRender: renderCreator
        },
        {
          title: 'Erstellt',
          dataKey: 'created_at',
          bodyRender: renderCreatedAt
        },
        {
          title: 'Privat',
          dataKey: 'private_note',
          bodyRender: renderPrivateColumn
        }
      ]
    }
  ];

  return (
    <div>
      <h1>Neue Notiz</h1>
      <form onSubmit={onSubmitForm} className={styles.notes}>
        <Input
          label="Notiz Titel:"
          name="title"
          disabled={isShowingNeuCategory}
          value={title}
          required
        />
        <Textarea
          label="Ihre Notiz zum Mitarbeiter:"
          name="notiz"
          disabled={isShowingNeuCategory}
          required
        />
        <fieldset className={styles.columns}>
          <Select
            label="Notiz Kategorie"
            name="note_category_id"
            optionText="category"
            keyExtractor="id"
            data={noteCategories}
            callback={onChangeCategory}
          />
          {isShowingNeuCategory && (
            <Input label="Neue Kategorie" required name="category" />
          )}
        </fieldset>
        <fieldset className={styles.columns}>
          <Input
            label="Notiz für Mitarbeiter anzeigen"
            name="private_note"
            value="false"
            type="radio"
            checked
          />
          <Input
            label="Notiz für Mitarbeiter verbergen"
            name="private_note"
            value="true"
            type="radio"
          />
        </fieldset>
        <CustomButton className="primary" type="submit">
          Speichern
        </CustomButton>
      </form>
      <Table
        options={{
          className: `${styles.table} ${styles.cell_left} table_noborder`,
          hasDefaultSearch: true
        }}
        data={notes}
        headRows={headRows}
      />
    </div>
  );
}
