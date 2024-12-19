import React, { useState, useContext, useEffect } from 'react';

import { MdTextFields } from 'react-icons/md';
import { UseRegisterKey } from '../../../hooks/use-register';

import Employee from './Employee';
import styles from './content-container.module.css';
import { VerteilerSearchContext } from '../../../contexts/verteiler';
import CommentBtn from './CommentBtn';
import Comment from './Comment';
import ArbeitszeitAbsprachen from './ArbeitszeitAbsprachen';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function OneCol({
  content_layout,
  po_dienst,
  employee,
  searchBoxClb,
  cssClass,
  be_id,
  einteilung,
  fieldId,
  dayCol,
  bereich_id
}) {
  const { verteiler } = useContext(VerteilerFastContext);
  const [comment, setComment] = useState(einteilung.info_comment || '');
  const [showComment, setShowComment] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const search = useContext(VerteilerSearchContext);

  const update = UseRegisterKey(
    `comment_${fieldId}`,
    verteiler.data.push,
    verteiler.data.pull
  );

  useEffect(() => {
    setComment(() => einteilung.info_comment || '');
  }, [update, einteilung, verteiler]);

  const isInSearch = () => {
    const name = employee?.planname?.toLowerCase?.() || '';
    if (!search || typeof search !== 'string') return false;
    return name.includes(search.toLowerCase());
  };

  let showEmptyWorkSpotsClass = '';
  if (
    verteiler.showEmptyWorkSpots &&
    verteiler.emptyWorkSpots.includes(`${dayCol}_${fieldId}`)
  ) {
    showEmptyWorkSpotsClass = 'show_empty_work_spots';
  }

  return (
    <div
      className={`content-row ${content_layout} ${isInSearch() ? styles.highlight : ''}`}
    >
      <div className="columns">
        <div className="col">
          <Employee
            employee={employee}
            einteilung={einteilung}
            po_dienst={po_dienst}
            be_id={be_id}
            searchBoxClb={searchBoxClb}
            cssClass={`${cssClass} ${showEmptyWorkSpotsClass}`}
            fieldId={fieldId}
            dayCol={dayCol}
            bereich_id={bereich_id}
          />
        </div>
        {employee && employee.accountInfo && (
          <div className="col number">
            <span>{employee.accountInfo.dienstTelefon}</span>
          </div>
        )}
        <CommentBtn
          einteilung={einteilung}
          setEditComment={setEditComment}
          setShowComment={setShowComment}
        />
      </div>

      <Comment
        einteilung={einteilung}
        fieldId={fieldId}
        comment={comment}
        setComment={setComment}
        showComment={showComment}
        setShowComment={setShowComment}
        editComment={editComment}
        setEditComment={setEditComment}
      />
      <ArbeitszeitAbsprachen
        className="info-comment"
        employee={employee}
        tag={einteilung.tag}
      />
    </div>
  );
}

export default OneCol;
