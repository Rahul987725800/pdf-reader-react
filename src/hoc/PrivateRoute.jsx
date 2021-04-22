import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLogin } from '../provider/LoginContextProvider';

function PrivateRoute({ component: Component, ...rest }) {
  const { loginState } = useLogin();
  return (
    <Route
      {...rest}
      render={(props) => {
        return loginState.user ? <Component {...props} /> : <Redirect to="/" />;
      }}
    ></Route>
  );
}

export default PrivateRoute;
