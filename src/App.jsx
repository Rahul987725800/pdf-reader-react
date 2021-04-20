import React from 'react';
import Grid from './components/Grid';
import { Switch, Route } from 'react-router-dom';
import AllNotes from './components/AllNotes';
import { NotesProvider } from './provider/NotesContextProvider';
import { PdfProvider } from './provider/PdfContextProvider';
import Login from './components/Login';
import { LoginProvider } from './provider/LoginContextProvider';
import Books from './components/Books';
function App() {
  return (
    <LoginProvider>
      <PdfProvider>
        <NotesProvider>
          <div>
            <Switch>
              <Route path="/" exact component={Login}></Route>
              <Route path="/pdf" exact component={Grid}></Route>
              <Route path="/notes" exact component={AllNotes}></Route>
              <Route path="/notes/:bookName" exact component={AllNotes}></Route>
              <Route path="/books" exact component={Books} />
            </Switch>
          </div>
        </NotesProvider>
      </PdfProvider>
    </LoginProvider>
  );
}

export default App;
