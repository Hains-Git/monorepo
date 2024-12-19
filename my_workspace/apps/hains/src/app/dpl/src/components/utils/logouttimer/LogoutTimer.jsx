import React, { useEffect } from 'react';
import { UseRegisterKey } from '../../../hooks/use-register';

function LogoutTimer({ channel }) {
  UseRegisterKey('timer', channel?.push, channel?.pull, channel);

  useEffect(() => {
    if (channel?.online) {
      channel?.startInterval?.();
    }
    return () => {
      channel?.stopInterval?.();
    };
  }, [channel?.online]);

  if (!channel?.show) return null;

  const [minutes, seconds] = channel.time.split(':');
  return (
    <div
      style={{
        color: parseInt(seconds, 10) <= 5 ? 'red' : 'black'
      }}
    >
      <p>{channel?.timeout ? '00' : seconds}</p>
    </div>
  );
}

export default LogoutTimer;
