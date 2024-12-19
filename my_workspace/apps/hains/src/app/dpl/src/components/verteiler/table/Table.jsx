import React, { useEffect, useState } from 'react';

import ContentContainer from '../ContentContainer/ContentContainer';
import Info from '../header/Info';
import TeamFilter from '../header/team-filter/TeamFilter';

import { UseRegisterKey } from '../../../hooks/use-register';

function Table({ verteiler }) {
  verteiler.logger && console.log('Table');

  const dateUpdate = UseRegisterKey(
    'dateUpdate',
    verteiler.data.push,
    verteiler.data.pull
  );
  const contentHeight = UseRegisterKey(
    'content-container-height',
    verteiler.data.push,
    verteiler.data.pull
  );

  const [teamsFiltered, setTeamsFiltered] = useState([]);

  const scrollDiv = (e) => {
    const sl = e.target.scrollLeft;
    const daycolheader = document.querySelector('div.daycol-header-wrapper');

    daycolheader.scroll({
      left: sl
    });
  };

  useEffect(() => {
    const verteilerBody = document.querySelector(
      'div.verteiler-body div.daycol-wrapper'
    );
    if (!verteilerBody) return;

    verteilerBody.addEventListener('wheel', (e) => {
      if (e.shiftKey) {
        verteilerBody.scrollLeft += e.deltaY;
      }
    });
    return () => {
      // verteilerBody.removeEventListener('scroll', (e) => {});
    };
  }, []);

  useEffect(() => {
    verteiler.setHeightInDom();
  }, [contentHeight, dateUpdate]);

  useEffect(() => {
    const daycolWrapper = document.querySelector('div.daycol-wrapper');
    daycolWrapper.removeEventListener('scroll', scrollDiv);
    daycolWrapper.addEventListener('scroll', scrollDiv);

    return () => daycolWrapper.removeEventListener('scroll', scrollDiv);
  }, []);

  return (
    <div className="days-wrapper">
      <TeamFilter setTeamsFiltered={setTeamsFiltered} verteiler={verteiler} />
      <div className="daycol-header-wrapper">
        <Info verteiler={verteiler} teamsFiltered={teamsFiltered} />
      </div>
      <div className="daycol-wrapper">
        {verteiler.data?.eachVerteilerDate?.((dayCol, ix) => {
          return (
            <div key={`day-col-${dayCol}`} className={`day-col day-col-${ix}`}>
              {verteiler.data?.bereiche
                ?.eachByVorlage?.((bereich, i) => {
                  if (verteiler.showBereich(bereich)) {
                    return (
                      <ContentContainer
                        key={`${bereich?.id}-${i}`}
                        cssClass="content-container"
                        bereich_section={bereich}
                        dayCol={dayCol}
                        bg={bereich.color_hl}
                        verteiler={verteiler}
                        content_layout={bereich.content_layout}
                        bereich_id={bereich.bereich_id}
                        po_dienst_id={bereich.po_dienst_id}
                      />
                    );
                  }
                  return null;
                })
                ?.sort(
                  (a, b) =>
                    (a?.props?.bereich_section?.order || 0) -
                    (b?.props?.bereich_section?.order || 0)
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
