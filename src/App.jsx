import React from 'react';
import Grid from './components/Grid';
import { Switch, Route } from 'react-router-dom';
import AllNotes from './components/AllNotes';
import { NotesProvider } from './provider/NotesContextProvider';
import { PdfProvider } from './provider/PdfContextProvider';
import Login from './components/Login';
import { LoginProvider } from './provider/LoginContextProvider';
import Books from './components/Books';
import PrivateRoute from './hoc/PrivateRoute';
function App() {
  return (
    <LoginProvider>
      <PdfProvider>
        <NotesProvider>
          <div>
            <Switch>
              <Route path="/" exact component={Login}></Route>
              <PrivateRoute path="/pdf" exact component={Grid}></PrivateRoute>
              <PrivateRoute
                path="/notes"
                exact
                component={AllNotes}
              ></PrivateRoute>
              <PrivateRoute
                path="/notes/:bookName"
                exact
                component={AllNotes}
              ></PrivateRoute>
              <PrivateRoute path="/books" exact component={Books} />
            </Switch>
          </div>
        </NotesProvider>
      </PdfProvider>
    </LoginProvider>
  );
}

export default App;
