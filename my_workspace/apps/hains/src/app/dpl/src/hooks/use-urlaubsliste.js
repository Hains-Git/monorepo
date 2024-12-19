import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UseMounted } from './use-mounted';
import { today, formatDate } from '../tools/dates';
import { apiGetEinteilungenOhneBedarf } from '../tools/helper';

export const useUrlaubsliste = ({ user, appModel, init = false }) => {
  const [urlaubsliste, setUrlaubsliste] = useState(false);
  const mounted = UseMounted();
  const location = useLocation();
  const locationDate = new URLSearchParams(location.search).get('date');
  const dateView = locationDate || formatDate(today());
  const leftSideDate = dateView;

  const getEinteilungen = () => {
    const params = {
      init,
      direction: 'future',
      date_view: dateView,
      left_side_date: leftSideDate
    };
    apiGetEinteilungenOhneBedarf(params, (response) => {
      if (user && appModel && mounted) {
        appModel.init({
          pageName: 'urlaubsliste',
          pageData: response,
          state: {}
        });
        const pageUrlaubsliste = appModel.page;
        setUrlaubsliste(() => pageUrlaubsliste);
      }
    });
  };

  useEffect(() => {
    setUrlaubsliste(() => false);
    if (user && appModel && mounted) {
      getEinteilungen();
    }
  }, [user, appModel, mounted]);

  return [urlaubsliste];
};
