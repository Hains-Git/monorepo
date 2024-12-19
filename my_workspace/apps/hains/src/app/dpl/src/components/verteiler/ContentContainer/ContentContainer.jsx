import React, { useContext } from 'react';
import Headline from '../Headline/Headline';
import Content from './Content';
import { UseRegisterKey } from '../../../hooks/use-register';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function ContentContainer({
  cssClass,
  bg = 'inherit',
  bereich_id,
  dayCol,
  po_dienst_id,
  content_layout,
  bereich_section
}) {
  const { verteiler } = useContext(VerteilerFastContext);
  UseRegisterKey('fullUpdate', verteiler.push, verteiler.pull);

  return (
    <div
      className={cssClass}
      style={{
        gridArea: `ct-${
          bereich_section.bereich
            ? bereich_section.bereich.converted_planname
            : bereich_section.po_dienst.converted_planname
        }`,
        backgroundColor:
          verteiler.pageName === 'tagesverteiler'
            ? bereich_section.color
            : bereich_section.color_bg
      }}
    >
      <Headline
        text={
          bereich_section.bereich
            ? bereich_section.bereich.name
            : bereich_section.po_dienst.name
        }
        cssClass="subheadline"
        bg={bg}
        doubleClickHandler={(evt) =>
          verteiler.setSectionDienstInfo(bereich_section, evt)
        }
      />

      <Content
        bereich_id={bereich_id}
        po_dienst_id={po_dienst_id}
        content_layout={content_layout}
        bereich_section={bereich_section}
        dayCol={dayCol}
      />
    </div>
  );
}
export default ContentContainer;
