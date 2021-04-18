import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useLogin } from '../provider/LoginContextProvider';

function Login() {
  const {
    loginState,
    loginOrSignup,
    dismissError,
    authCheckState,
  } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    authCheckState();
  }, []);
  return (
    <div>
      {loginState.checkingUser && <p>Checking User</p>}
      {loginState.user && <Redirect to="/pdf" />}
      {loginState.loading && <p>Loading</p>}
      {loginState.error && (
        <p>
          Error : {loginState.error} <button onClick={dismissError}>X</button>
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="email">Email : </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password : </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <button onClick={() => loginOrSignup({ email, password }, false)}>
            Login
          </button>
          <button onClick={() => loginOrSignup({ email, password }, true)}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
