import React from 'react';
import Grid from './components/Grid';
import { Switch, Route } from 'react-router-dom';
import AllNotes from './components/AllNotes';
import { NotesProvider } from './provider/NotesContextProvider';
function App() {
  return (
    <NotesProvider>
      <div>
        <Switch>
          <Route path="/" exact component={Grid}></Route>
          <Route path="/all-notes" exact component={AllNotes}></Route>
        </Switch>
      </div>
    </NotesProvider>
  );
}

export default App;
