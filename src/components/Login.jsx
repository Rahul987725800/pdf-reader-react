import React, { useEffect, useState } from 'react';

import { Redirect } from 'react-router';
import { useLogin } from '../provider/LoginContextProvider';
import styles from './Login.module.css';
import Wallpaper from '../images/wallpaper.jpg';
import MyLoader from '../shared/MyLoader';
function Login() {
  const { loginState, loginOrSignup, dismissError, authCheckState } =
    useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    authCheckState();
  }, []);
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${Wallpaper})`,
      }}
    >
      {/* {loginState.checkingUser && <p>Checking User</p>} */}
      {loginState.user && <Redirect to="/pdf" />}
      {(loginState.checkingUser || loginState.loading) && <MyLoader />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={styles.inputForm}
      >
        <h1 className={styles.header}>Welcome Back</h1>

        {loginState.error && (
          <Error error={loginState.error} dismissError={dismissError} />
        )}

        <div className={styles.inputBlock}>
          <label htmlFor="email">
            <i className=" fa fa-envelope"></i>
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          ></input>
        </div>
        <div className={styles.inputBlock}>
          <label htmlFor="password">
            <i className=" fa fa-lock"></i>
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() =>
              loginOrSignup(
                { email: '123456@gmail.com', password: '123456' },
                false
              )
            }
            className={styles.fatButton + ' ' + styles.dummy}
          >
            Sign In as Dummy user for testing
          </button>
          <button
            onClick={() => loginOrSignup({ email, password }, false)}
            className={styles.fatButton + ' ' + styles.login}
          >
            Login
          </button>

          <h3>OR</h3>
          <button
            onClick={() => loginOrSignup({ email, password }, true)}
            className={styles.fatButton + ' ' + styles.signup}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;

function Error({ error, dismissError }) {
  return (
    <div className={styles.errorBlock}>
      <div className={styles.message}>{error}</div>
      <div onClick={dismissError} className={styles.icon}>
        &#10005;
      </div>
    </div>
  );
}
