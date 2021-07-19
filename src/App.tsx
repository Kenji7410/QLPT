import { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AuthenticationContext } from './authentication-provider';
import LoginPage from './login';
import Dashboard from './dashboard';

const App = () => {
  const { authenticate } = useContext(AuthenticationContext);

  return (
    <BrowserRouter basename='/room-management-system'>
      <Switch>
        <Route
          path='/'
          render={routeProps => {
            if (authenticate) {
              return (
                <Switch>
                  <Route exact path='/analysis' key='analysis' render={() => <Dashboard />} />
                  <Redirect to='/analysis' />
                </Switch>
              );
            }

            return (
              <Switch>
                <Route
                  exact
                  path='/login'
                  key='login'
                  render={() => <LoginPage {...routeProps} />}
                />
                <Redirect to='/login' />
              </Switch>
            );
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
