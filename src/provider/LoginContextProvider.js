import React, { useContext, useState } from 'react';
import { firebaseUrl } from '../utils';
const LoginContext = React.createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};
export const LoginProvider = ({ children }) => {
  const [loginState, setLoginState] = useState({
    token: null,
    userId: null,
    error: '',
    loading: false,
    user: null,
    checkingUser: false,
  });
  let authSuccess = (token, userId) => {
    // console.log(userId);
    setLoginState((ps) => ({
      ...ps,
      token,
      userId,
      error: '',
      loading: false,
    }));
    // activeLink.set(links.home);
  };
  let authFail = (error) => {
    setLoginState((ps) => ({ ...ps, error, loading: false }));
  };
  let authLogout = () => {
    setLoginState((ps) => ({
      ...ps,
      token: null,
      userId: null,
    }));
  };
  let authStartLoading = () => {
    setLoginState((ps) => ({
      ...ps,
      error: '',
      loading: true,
    }));
  };
  let dismissError = () => {
    setLoginState((ps) => ({
      ...ps,
      error: '',
    }));
  };
  let setUser = (user) => {
    setLoginState((ps) => ({
      ...ps,
      user,
    }));
  };
  let loginOrSignup = async (data, signup) => {
    // console.log(data);
    authStartLoading();
    const apiKey = 'AIzaSyD8AYOBa4_ZS8jdhfBqL6zDrHAQkikTFko';
    const authData = {
      email: data.email,
      password: data.password,
      returnSecureToken: true,
    };
    let url = signup
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    })
      .then((res) => res.json())
      .then(async (response) => {
        if (response.error && response.error.code === 400) {
          throw new Error(response.error.message);
        }
        // console.log(response);
        localStorage.setItem('token', response.idToken);
        localStorage.setItem('userId', response.localId);
        localStorage.setItem(
          'expirationDate',
          new Date(new Date().getTime() + +response.expiresIn * 1000)
        );
        if (signup) {
          await registerUser(response.localId, data);
          await fetchUser(response.localId);
        } else {
          await fetchUser(response.localId);
        }
        authSuccess(response.idToken, response.localId);
        checkAuthTimeout(+response.expiresIn);
      })
      .catch((error) => {
        console.log(error);
        authFail(error.message);
      });
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    authLogout();
  };
  const checkAuthTimeout = (expirationTime) => {
    setTimeout(() => {
      logout();
    }, expirationTime * 1000);
  };
  const authCheckState = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (new Date() < expirationDate) {
        const userId = localStorage.getItem('userId');
        setLoginState((ps) => ({ ...ps, checkingUser: true }));
        await fetchUser(userId);
        setLoginState((ps) => ({ ...ps, checkingUser: false }));
        authSuccess(token, userId);
        checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        );
      } else {
        logout();
      }
    }
  };
  const registerUser = (userId, data) => {
    return fetch(firebaseUrl + 'users/' + userId + '.json', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        password: null,
        confirmPassword: null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        // user is registered now
      })
      .catch((err) => console.log(err));
  };
  const fetchUser = (userId) => {
    // const queryParams = `?orderBy="userId"&equalTo="${userId}"&limitToFirst=1`;
    return fetch(firebaseUrl + 'users/' + userId + '.json')
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setUser(data);
      })
      .catch((err) => console.log(err));
  };

  const exportedValues = {
    loginState,
    loginOrSignup,
    dismissError,
    authCheckState,
  };
  return (
    <LoginContext.Provider value={exportedValues}>
      {children}
    </LoginContext.Provider>
  );
};
