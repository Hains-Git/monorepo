import React from 'react';
import { UseFuehrung } from '../../../../../hooks/use-fuehrung';
import { UseTooltip } from '../../../../../hooks/use-tooltip';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import Loader from '../../../../utils/loader/Loader';

function Fuehrung({ table }) {
  const [
    checked,
    showLoader,
    handleFuehrung,
    handleNext,
    handlePrev,
    handleAutoScroll
  ] = UseFuehrung(table);

  let msg = 'Hebt das Feld hervor, in dem am wenigsten Mitarbeiter ';
  msg += 'mit allen Freigaben zur Verfügung stehen.';

  const scrollMsg = 'Scrollt zur Tabellenzelle';
  const [onOverScroll, onOutScroll] = UseTooltip(scrollMsg);

  const [onOverFuehrung, onOutFuehrung] = UseTooltip(msg);

  if (!table?.fuehren) return null;
  return (
    <div className="fuehrung-container">
      {showLoader && <Loader />}
      <div>
        <div>
          <label
            htmlFor="fuehrung"
            onMouseOver={onOverFuehrung}
            onMouseOut={onOutFuehrung}
          >
            <input
              onChange={handleFuehrung}
              type="checkbox"
              id="fuehrung"
              checked={checked}
            />
            Führung
          </label>
        </div>

        {checked && (
          <div>
            <label
              htmlFor="fuehrung-auto-scroll"
              onMouseOver={onOverScroll}
              onMouseOut={onOutScroll}
            >
              <input
                onChange={handleAutoScroll}
                type="checkbox"
                id="fuehrung-auto-scroll"
                checked={table.autoScroll}
              />
              Scrollen
            </label>
          </div>
        )}
      </div>

      <div className="fuehrung-buttons">
        {checked && (
          <CustomButton
            spinner={{ show: true }}
            clickHandler={handlePrev}
            disable={table.fuehrungPos < 1}
          >
            {'<'}
          </CustomButton>
        )}
        {checked && (
          <CustomButton
            spinner={{ show: true }}
            clickHandler={handleNext}
            disable={table.fuehrungPos >= table.fuehrungEnde}
          >
            {'>'}
          </CustomButton>
        )}
      </div>
    </div>
  );
}

export default Fuehrung;
