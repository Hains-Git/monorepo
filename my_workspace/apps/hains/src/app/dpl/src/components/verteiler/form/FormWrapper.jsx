import { useContext } from 'react';

import Form from './Form';
import FormConflict from '../../../models/verteiler/FormConflict';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function FormWrapper() {
  const { useVerteilerFastContextFields, verteiler } =
    useContext(VerteilerFastContext);
  const { showForm, newEinteilung } = useVerteilerFastContextFields([
    'showForm',
    'newEinteilung'
  ]);

  if (!showForm.get) return null;

  return <Form formConflict={new FormConflict(newEinteilung.get, verteiler)} />;
}
export default FormWrapper;
