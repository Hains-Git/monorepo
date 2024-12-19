import React, { useState } from 'react';
import { UseRegisterKey } from '../../../hooks/use-register';
import CustomButton from '../custom_buttons/CustomButton';
import StandardSelectField from '../standard-select-field/StandardSelectField';

function Chat({ channel }) {
  UseRegisterKey('chat', channel?.push, channel?.pull, channel);
  const [message, setMessage] = useState('');

  const itemHandler = (item) => {
    channel?.setChatPartnerStart?.(item);
  };

  if (!channel?.online) return null;
  return (
    <div className="dienstplan-online-status-chat-container">
      <div>
        {channel?.getChatMessages?.((_message, partner, currentUser, id) => (
          <div key={id} className={currentUser ? 'chat-right' : 'chat-left'}>
            <p className="chat-partner">{partner}</p>
            <p>{_message}</p>
          </div>
        )) || []}
      </div>
      <div>
        <StandardSelectField
          options={channel?.getChatPartner?.() || []}
          optionKey="name"
          itemHandler={itemHandler}
          start={channel?.chatPartnerStart || 0}
          readOnly
        />
        <textarea
          onChange={(evt) => {
            evt.stopPropagation();
            setMessage(() => evt.target.value);
          }}
          cols={30}
          rows={3}
          value={message}
          placeholder="Type your message here..."
        />
        <CustomButton
          clickHandler={() => {
            channel?.sendChatMessage?.(message);
            setMessage(() => '');
          }}
        >
          Send
        </CustomButton>
      </div>
    </div>
  );
}

export default Chat;
