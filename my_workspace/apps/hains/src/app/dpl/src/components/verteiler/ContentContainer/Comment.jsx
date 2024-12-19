import React, { useContext } from 'react';
import { MdSave } from 'react-icons/md';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function Comment({
  einteilung,
  fieldId,
  comment,
  setComment,
  showComment,
  setShowComment,
  editComment,
  setEditComment
}) {
  const { saveInfoComment } = useContext(VerteilerFastContext);
  const changeComment = (evt) => {
    const val = evt.target.value;
    setComment(() => val);
  };

  const saveComment = (evt, setLoading) => {
    setEditComment(() => false);
    setShowComment(() => false);
    saveInfoComment(einteilung.id, comment.trim(), fieldId);
    setLoading?.(() => false);
  };

  if (
    !einteilung?.id ||
    !(editComment || showComment || einteilung.info_comment)
  )
    return null;
  return (
    <div className={`info-comment ${showComment ? 'show' : ''}`}>
      {einteilung.info_comment && !editComment ? (
        <p>{einteilung.info_comment}</p>
      ) : (
        <>
          <input
            type="text"
            value={comment}
            onChange={changeComment}
            name="info_comment"
            autoFocus
          />
          <CustomButton
            spinner={{ show: true }}
            className="as_icon primary"
            clickHandler={saveComment}
          >
            <MdSave />
          </CustomButton>
        </>
      )}
    </div>
  );
}

export default Comment;
