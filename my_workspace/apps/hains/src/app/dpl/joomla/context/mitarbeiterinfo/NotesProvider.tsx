import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  ReactNode
} from 'react';

import { OAuthContext } from '../OAuthProvider';
import {
  TNoteCategory,
  TNote,
  TMitarbeiter
} from '../../helper/api_data_types';

type TNoteContext = {
  notes: TNote[];
  noteCategories: TNoteCategory[];
  onUpdateNote: (note: TNote) => void;
  addNewCategory: (category: TNoteCategory) => void;
};

const NotesContext = createContext<TNoteContext>({
  notes: [],
  noteCategories: [],
  onUpdateNote: (note: TNote) => {},
  addNewCategory: (cat: TNoteCategory) => {}
});

type TProps = {
  mitarbeiter: TMitarbeiter;
  children: ReactNode;
};

type initialData = {
  notes: TNote[];
  note_categories: TNoteCategory[];
};

const NotesProvider = ({ mitarbeiter, children }: TProps) => {
  const { hainsOAuth, returnError, user } = useContext(OAuthContext);
  const [notes, setNotes] = useState<TNote[]>([]);
  const [noteCategories, setNoteCategories] = useState<TNoteCategory[]>([]);

  useEffect(() => {
    hainsOAuth
      .api('get_notes_for_detail_page', 'get', {
        mitarbeiter_id: mitarbeiter.id
      })
      .then(
        (data: initialData) => {
          setNotes(data.notes);
          setNoteCategories([
            ...data.note_categories,
            { id: 0, category: 'Neu' }
          ]);
        },
        (err: any) => {
          returnError(err);
        }
      );
  }, []);

  const onUpdateNote = async (data: TNote) => {
    const note = { ...data, mitarbeiter_id: mitarbeiter.id };
    try {
      const res = await hainsOAuth.api('update_note', 'post', { note });
      if (res.status === 'ok') {
        setNotes(res.data);
      }
    } catch (err) {
      console.log('onUpdateNote', err);
    }
  };

  const addNewCategory = async (newCategory: TNoteCategory) => {
    const note = { category: newCategory.category };
    const res = await hainsOAuth.api('add_new_note_category', 'post', { note });
    try {
      if (res.status === 'ok') {
        setNoteCategories((cur: TNoteCategory[]) => {
          return [...cur, res.data];
        });
      }
    } catch (err) {
      console.log('addNewCategory', err);
    }
  };

  const providerValue = useMemo<TNoteContext>(
    () => ({
      notes,
      noteCategories,
      onUpdateNote,
      addNewCategory
    }),
    [notes, noteCategories, onUpdateNote, addNewCategory]
  );

  return (
    <NotesContext.Provider value={providerValue}>
      {children}
    </NotesContext.Provider>
  );
};

export { NotesProvider, NotesContext };
