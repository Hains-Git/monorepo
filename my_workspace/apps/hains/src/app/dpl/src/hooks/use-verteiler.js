import { useEffect, useState } from 'react';
import { apiUpdateVerteiler } from '../tools/helper';
import { formatDate, today } from '../tools/dates';
import { UseMounted } from './use-mounted';
import { development } from '../tools/flags';

export const useVerteiler = ({ appModel, user, pageName }) => {
  const [verteiler, setVerteiler] = useState(false);
  const mounted = UseMounted();

  const setVerteilerData = async (_date) => {
    const params = {
      tag: _date,
      page: pageName,
      init: true,
      dienstplan_id: 0,
      vorschlag: false,
      dienstplaene_anfaenge: [],
      force_refresh_bedarf: false
    };
    apiUpdateVerteiler(params, (response) => {
      if (user && appModel && mounted) {
        if (development) console.log('-----------------INIT', { response });
        appModel.init({
          pageName,
          pageData: response,
          state: {
            pageName
          }
        });
        const pageVerteiler = appModel.page;
        setVerteiler(() => pageVerteiler);
      }
    });
  };

  useEffect(() => {
    setVerteiler(() => false);
    if (user && appModel && mounted) {
      setVerteilerData(formatDate(today()));
    }
  }, [user, appModel, mounted]);

  return [verteiler];
};
