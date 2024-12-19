import React, { useContext, useRef, useEffect, useState } from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

import styles from './popup.module.css';

import { DienstwunschPopupContext } from '../../../context/mitarbeiterinfo/DienstwunschPopupProvider';
import DienstkategorieTeam from './DienstkategorieTeam';
import { getGermanDateLong } from '../../../helper/dates';
import CustomButton from '../../utils/custom-button/CustomButton';

type TTeamProps = {
  team: any;
  curTeams: any;
  ix: number;
};

function TeamItem({ team, curTeams, ix }: TTeamProps) {
  const first = ix === 0;
  const [show, setShow] = useState(first);
  const sum = curTeams.reduce((acc: any, item: any) => acc + item.count, 0);

  return (
    <div className={styles.team_content} key={`team-${team.id}`}>
      <h4 onClick={() => setShow(!show)}>
        <span>
          {team.name}: {sum}
        </span>
        {!first && <span>{show ? <FaCaretUp /> : <FaCaretDown />}</span>}
      </h4>
      {(show || first) &&
        curTeams.map((curTeam: any) => {
          return (
            <p key={`team-name-${curTeam.label}`}>
              {curTeam.label}: {curTeam.count}{' '}
            </p>
          );
        })}
    </div>
  );
}

function PopupDienstwunsch() {
  const [isVis, setIsVis] = useState(false);
  const {
    showPopup,
    eventData,
    popupData,
    setPopupRef,
    mitarbeiter_id,
    createWunsch
  } = useContext(DienstwunschPopupContext);

  const tag = getGermanDateLong((eventData && eventData?.tag) || '');
  const popupTitle = `Mitarbeiterwunsch: ${tag}`;
  const popupRef = useRef(null);

  useEffect(() => {
    setPopupRef(popupRef);
  }, [showPopup]);

  const wunschAbgebenFunc = (dienstkategorie_id: number) => {
    const params = {
      tag: eventData.tag,
      dienstkategorie_id,
      mitarbeiter_id
    };
    createWunsch(params);
  };

  const render = () => {
    if (!eventData) return null;
    let ix = -1;
    return (
      <>
        <>
          <p className={styles.overview}>Urlaube: {eventData.urlaube}</p>
          <p className={styles.overview}>Abgegebene Wünsche: {eventData.sum}</p>
          <p className={styles.overview}>Team: {popupData?.teams?.[0]?.name}</p>
        </>
        <div className={styles.team_wrapper}>
          {popupData.teams.map((team: any) => {
            if (!eventData?.details?.[team.id]) return null;
            const curTeams: any = eventData.details[Number(team.id)];
            ix++;
            return (
              <TeamItem
                curTeams={curTeams}
                team={team}
                key={`team-item-${team.id}`}
                ix={ix}
              />
            );
          })}
        </div>
      </>
    );
  };

  return showPopup ? (
    <div
      className={`${styles.popup_dienstwunsch} popup_dienstwunsch`}
      ref={popupRef}
    >
      <p className={styles.popup_dw_title}>{popupTitle}</p>
      <div className={styles.open_select_btn}>
        <CustomButton
          className={`primary ${styles.select_btn}`}
          clickHandler={() => setIsVis((cur) => !cur)}
        >
          <span>{popupData.myWunsch ? popupData.title : 'Wunsch abgeben'}</span>
          <span>{isVis ? <FaCaretUp /> : <FaCaretDown />}</span>
        </CustomButton>
        {isVis && (
          <div className={styles.dienstkategorie_wrapper}>
            {Object.values(popupData.teams).map((team: any) => {
              return (
                <DienstkategorieTeam
                  key={`dkt-${team.id}`}
                  team={team}
                  popupData={popupData}
                  wunschAbgebenFunc={wunschAbgebenFunc}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.info}>{render()}</div>
    </div>
  ) : null;
}

export default PopupDienstwunsch;
