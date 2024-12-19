import React from 'react';
import CustomButton from '../custom-button/CustomButton';

export type LoginLogoutProps = {
  loginOnClick: React.MouseEventHandler<HTMLButtonElement>;
  logoutOnClick: React.MouseEventHandler<HTMLButtonElement>;
  user: boolean | object;
};

function LoginLogout({ loginOnClick, logoutOnClick, user }: LoginLogoutProps) {
  return (
    <CustomButton
      type="button"
      style={{ padding: '5px 15px' }}
      clickHandler={(e: any) => {
        user ? logoutOnClick(e) : loginOnClick(e);
      }}
    >
      {user ? 'Logout' : 'Login'}
    </CustomButton>
  );
}

export default LoginLogout;
