import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { MdAddComment, MdInsertComment } from 'react-icons/md';
import CustomButton from '../../utils/custom_buttons/CustomButton';

function CommentBtn({ einteilung, setEditComment, setShowComment }) {
  const iconComment = useMemo(
    () => ({
      color: einteilung?.info_comment ? '#00427a' : 'rgb(140,140,140)'
    }),
    []
  );

  if (!einteilung?.id) return null;
  return (
    <div className="col icons">
      <IconContext.Provider value={iconComment}>
        {einteilung.info_comment ? (
          <CustomButton
            className="as_icon"
            clickHandler={() => setEditComment((prev) => !prev)}
          >
            <MdInsertComment />
          </CustomButton>
        ) : (
          <CustomButton
            className="as_icon"
            clickHandler={() => setShowComment((prev) => !prev)}
          >
            <MdAddComment />
          </CustomButton>
        )}
      </IconContext.Provider>
    </div>
  );
}

export default CommentBtn;
