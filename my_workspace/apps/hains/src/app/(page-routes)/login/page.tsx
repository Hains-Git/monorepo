import React from 'react';
import { handleLogin } from '../../../actions/handle-login';

function Login() {
  return (
    <div>
      <form className="" action={handleLogin}>
        <label>
          Email
          <input type="email" name="email" required />
        </label>

        <label>
          Password
          <input type="password" name="password" required />
        </label>

        <button className="" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
