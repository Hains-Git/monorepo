import React, { useEffect, useContext } from 'react';
import Headline from '../Headline/Headline';
import ContentContainer from '../ContentContainer/ContentContainer';
import { UseRegister } from '../../../hooks/use-register';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function isBereichInGrid(configGridStr, bereichName) {
  const escapedVariable = bereichName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape-Sonderzeichen
  const pattern = new RegExp(`\\b${escapedVariable}\\b`, 'g'); // Dynamische Erstellung des regulären Ausdrucks
  const count = (configGridStr.match(pattern) || []).length;
  return count > 0;
}

function Grid() {
  const { verteiler } = useContext(VerteilerFastContext);
  const grid = verteiler?.grid;
  const config = grid?.desktop?.grid;
  const collections = verteiler?.data?.collections;
  const vorlage = verteiler?.vorlage;
  const vorlagen = verteiler?.vorlagen;
  const gridArray = Object.values(config || {});
  const configGridStr = gridArray.join(' ');
  UseRegister(vorlagen?._push, vorlagen?._pull, vorlagen);

  useEffect(() => {
    grid?.setCssProperties?.();
  }, [vorlage, config]);

  if (!config || !vorlage || !config) return null;
  return verteiler.data?.eachVerteilerDate?.((dayCol) => (
    <div className="grid-wrapper" key={dayCol}>
      {collections?.eachByVorlage?.((item, i) => {
        return (
          <React.Fragment key={`${item?.id}-${i}`}>
            {isBereichInGrid(configGridStr, item.planname) && (
              <Headline
                text={item.name}
                key={item.planname}
                cssClass="headline"
                gridLabel={`hl-${item.planname}`}
                bg={item.color}
              />
            )}
            {item?.eachBereichTVByVorlage?.((bereich, j) => {
              if (!isBereichInGrid(configGridStr, bereich.sectionName)) {
                return null;
              }
              return (
                <ContentContainer
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item?.id}-${i}-${bereich?.id}-${j}`}
                  cssClass="content-container"
                  bg={item.color}
                  dayCol={dayCol}
                  content_layout={bereich.content_layout}
                  bereich_id={bereich.bereich_id}
                  po_dienst_id={bereich.po_dienst_id}
                  bereich_section={bereich}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  ));
}

// export default React.memo(Grid);
export default Grid;
