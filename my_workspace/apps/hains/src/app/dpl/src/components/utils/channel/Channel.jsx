import React, { useEffect } from 'react';
import { BsFillChatFill, BsChatDotsFill } from 'react-icons/bs';
import { UseRegister } from '../../../hooks/use-register';
import { UseDropdown } from '../../../hooks/use-dropdown';
import Chat from './Chat';

const mirrorHorizontal = {
  transform: 'scaleX(-1)'
};

function Channel({ channel, user }) {
  const update = UseRegister(channel?._push, channel?._pull, channel);
  const { show, handleClick, closeDropDown } = UseDropdown(false, false);

  const handleDoubleClick = (evt) => {
    evt.stopPropagation();
    user?.setInfo?.(evt);
  };

  useEffect(() => {
    if (!channel.hasChatPartner && show) {
      closeDropDown();
    }
  }, [channel, update]);

  const showChat = show && channel?.hasChatPartner;
  if (!channel?.online) return null;
  return (
    <div className={`dienstplan-online-status ${showChat ? 'show-chat' : ''}`}>
      {showChat && <Chat channel={channel} />}
      <div className="dienstplan-online-status-label">
        {channel?.newMessages ? (
          <BsChatDotsFill
            style={mirrorHorizontal}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            title="Online"
            color="#00427a"
          />
        ) : (
          <BsFillChatFill
            style={mirrorHorizontal}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            title="Online"
            color="#00427a"
          />
        )}
      </div>
    </div>
  );
}

export default Channel;
