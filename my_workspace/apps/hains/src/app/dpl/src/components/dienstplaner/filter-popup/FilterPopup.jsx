import React, { useState } from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseTooltip } from '../../../hooks/use-tooltip';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import FilterGroup from './FilterGroup';
import { UseMounted } from '../../../hooks/use-mounted';
import Loader from '../../utils/loader/Loader';

function FilterPopup({ filterVorlage = {}, label = '', saveBtn = false }) {
  const { caret, show, handleClick, closeDropDown } = UseDropdown(false, true);
  const mounted = UseMounted();
  const [loader, setLoader] = useState(false);

  const [onOver, onOut] = UseTooltip(
    'Es werden nur Gruppen geprüft, bei denen ein Element aktiv ist.'
  );

  if (!filterVorlage) return null;
  return (
    <div className="filter-vorlage">
      <div className="filter-vorlage-head">
        {saveBtn ? (
          <div className="filter-vorlage-save">
            <CustomButton
              className="filter-vorlage-save-btn"
              title="Speichert die aktuelle Vorlage für die aktuelle Session"
              clickHandler={() => filterVorlage.save()}
            >
              Speichern
            </CustomButton>
          </div>
        ) : null}

        <div className="filter-vorlage-label" onClick={handleClick}>
          <p onMouseOver={onOver} onMouseOut={onOut}>
            {`${label} `}
            <span className="caret">{caret}</span>
          </p>
        </div>
      </div>

      {show ? (
        <div
          className="filter-vorlage-optionen"
          onClick={(evt) => evt.stopPropagation()}
        >
          <div className="filter-vorlage-optionen-anwenden">
            <CustomButton
              spinner={{ show: true }}
              clickHandler={(evt, setLoading) => {
                evt.stopPropagation();
                setLoader(() => true);
                filterVorlage?.debouncedUpdateParent?.(() => {
                  if (mounted) {
                    closeDropDown();
                    setLoader(() => false);
                    setLoading?.(() => false);
                  }
                });
              }}
            >
              Anwenden
            </CustomButton>
            {loader && <Loader />}
          </div>

          {filterVorlage.getGroups((group) => (
            <FilterGroup key={group.id} group={group} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FilterPopup;
