import React, { useState, useEffect, Suspense } from 'react';
import CalendarTimeline from '../../components/rotationsplanung/calendar-timeline/calendar-timeline';
import RotationForm from '../../components/rotationsplanung/calendar-timeline/forms/rotationForm';
import Spinner from '../../components/utils/spinner/Spinner';
import Panel from '../../components/utils/panel/Panel';
import { returnError } from '../../tools/hains';

import '../../css/rotationsplan.css';
import { UseMounted } from '../../hooks/use-mounted';
import { apiRotationen, hainsOAuth } from '../../tools/helper';
import { today } from '../../tools/dates';

function Rotationsplanung({ user, appModel }) {
  const loader = (text) => <Spinner showText text={text} />;
  const [rotationsplan, setRotationsplan] = useState(false);
  const [showRotationForm, setShowRotationForm] = useState({});
  const mounted = UseMounted();

  useEffect(() => {
    setRotationsplan(() => false);
    const getRotationsplanung = () => {
      const now = today();
      const curYear = now.getFullYear();
      const curMonth = now.getMonth();
      let prevMonth;
      let nextMonth;
      const rangeMonths = 4;

      const initialsYears = {
        [curYear]: { months: [] },
        [curYear - 1]: { months: [] },
        [curYear + 1]: { months: [] }
      };

      for (let i = 1; i <= rangeMonths; i++) {
        if (curMonth - i < 0) {
          prevMonth = curMonth - i + 12;
          initialsYears[curYear - 1].months = [
            prevMonth,
            ...initialsYears[curYear - 1].months
          ];
        } else {
          prevMonth = curMonth - i;
          initialsYears[curYear].months = [
            prevMonth,
            ...initialsYears[curYear].months
          ];
        }
      }

      initialsYears[curYear].months = [
        ...initialsYears[curYear].months,
        curMonth
      ];

      for (let i = 1; i <= rangeMonths; i++) {
        if (curMonth + i > 11) {
          nextMonth = curMonth + i - 12;
          initialsYears[curYear + 1].months = [
            ...initialsYears[curYear + 1].months,
            nextMonth
          ];
        } else {
          nextMonth = curMonth + i;
          initialsYears[curYear].months = [
            ...initialsYears[curYear].months,
            nextMonth
          ];
        }
      }

      //
      if (!initialsYears[curYear - 1].months.length) {
        delete initialsYears[curYear - 1];
      }
      if (!initialsYears[curYear + 1].months.length) {
        delete initialsYears[curYear + 1];
      }

      // API Abfrage
      const initialsYearsArr = Object.keys(initialsYears);
      const startYear = initialsYearsArr[0];
      const startMonth = initialsYears[startYear].months[0] + 1;
      const endYear = initialsYearsArr[initialsYearsArr.length - 1];
      const endYearMonths = initialsYears[endYear].months;
      const endMonth = endYearMonths[endYearMonths.length - 1] + 1;
      const endDayNum = new Date(endYear, endMonth, 0).getDate();

      const params = {
        anfang: `${startYear}-${startMonth}-01`,
        ende: `${endYear}-${endMonth}-${endDayNum}`,
        init: true
      };

      apiRotationen(
        params,
        (response) => {
          if (user && appModel && mounted) {
            appModel.init({
              pageName: 'rotationsplan',
              pageData: response,
              state: {
                years: initialsYears,
                initialColumnWidth: 250,
                zoomVal: 50,
                rangeMonths,
                curMonth,
                curYear,
                rangeWidth: [250, 600]
              }
            });
            const newRotationsplan = appModel.page;
            setRotationsplan(() => newRotationsplan);
          } // Ende if user
        },
        returnError
      );
    };

    if (user && appModel && mounted) getRotationsplanung();
  }, [user, appModel, mounted]);

  const doesRotationOverlapWithSameprio = (rotation) => {
    const rotationen = rotationsplan.data.rotationen;
    const vonZahl = parseInt(rotation.von.split('-').join(''), 10);
    const bisZahl = parseInt(rotation.bis.split('-').join(''), 10);
    const rotationenFiltered = Object.values(rotationen).find((_rot) => {
      if (
        rotation.mitarbeiter_id === _rot.mitarbeiter_id &&
        rotation.id !== _rot.id &&
        vonZahl < _rot.bisZahl &&
        bisZahl > _rot.vonZahl
      ) {
        return _rot.prioritaet === 1;
      }
      return false;
    });

    return rotationenFiltered;
  };

  const updateRotationApi = (rotation) => {
    let overlap = false;
    if (rotation.prioritaet === 1) {
      const overlapRot = doesRotationOverlapWithSameprio(rotation);
      if (overlapRot) {
        overlap = true;
        let text =
          'In dem Zeitraum darf nur eine Rotation die Priorität 1 besitzen.\r\n';
        text += 'Vorhandene Rotation:\r\n';
        text += `Kontingent: ${overlapRot.kontingent.name}\r\n`;
        text += `Zeitraum: ${overlapRot.vonDateString}-${overlapRot.bisDateString}`;
        alert(text);
      }
    }
    if (!overlap) {
      hainsOAuth.api('update_rotation', 'post', rotation).then((response) => {
        if (user && appModel && mounted) {
          setShowRotationForm(false);
          rotationsplan.updateKontingenteEngeteilt(response);
          rotationsplan.timeline.addRotationToTimeline(response);
        }
      }, returnError);
    }
  };

  const deleteRotationApi = (rotation) => {
    hainsOAuth.api('delete_rotation', 'post', rotation).then((response) => {
      if (user && appModel && mounted) {
        setShowRotationForm(false);
        rotationsplan.updateKontingenteEngeteilt(response);
        rotationsplan.timeline.removeRotationFromTimeline(response);
      }
    }, returnError);
  };

  const getPage = () => {
    if (!user) return loader('Session wird geprüft...');
    if (!rotationsplan) return loader('Daten werden geladen...');
    return (
      <Suspense fallback={loader('Seite wird geladen...')}>
        <div className="calendar-timeline-wrapper">
          <CalendarTimeline
            rotationsplan={rotationsplan}
            setShowRotationForm={setShowRotationForm}
          />
        </div>
        {showRotationForm.show && (
          <div className="calendar-timeline-form">
            <div className="wrap">
              <RotationForm
                setShowRotationForm={setShowRotationForm}
                showRotationForm={showRotationForm}
                updateRotationApi={updateRotationApi}
                deleteRotationApi={deleteRotationApi}
                rotationsplan={rotationsplan}
              />
            </div>
          </div>
        )}
      </Suspense>
    );
  };

  return <Panel>{getPage()}</Panel>;
}

export default Rotationsplanung;
