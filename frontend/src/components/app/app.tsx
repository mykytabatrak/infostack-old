import { useLocation } from 'hooks/hooks';
import { AppRoute } from 'common/enums/enums';
import Counter from 'components/counter/counter';
import Login from 'components/login/login';
import SignUp from 'components/sign-up/sign-up';
import { Link, Route, Switch } from 'components/common/common';
import Workspaces from 'components/workspaces/workspaces';
import Pages from 'components/pages/pages';
import Profile from 'components/profile/profile';
import ProtectedRoute from 'components/common/protected-route/protected-route';
import Workspace from 'components/workspace/workspace';

const App: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <div className="App">
        <div>
          <ul className="App-navigation-list">
            <li>
              <Link to={AppRoute.ROOT}>Root</Link>
            </li>
            <li>
              <Link to={AppRoute.LOGIN}>Login</Link>
            </li>
            <li>
              <Link to={AppRoute.SIGN_UP}>Sign up</Link>
            </li>
            <li>
              <Link to={AppRoute.WORKSPACES}>Workspaces</Link>
            </li>
            <li>
              <Link to={AppRoute.PAGES}>Pages</Link>
            </li>
            <li>
              <Link to={AppRoute.SETTINGS_PROFILE}>Profile Settings</Link>
            </li>
          </ul>
          <p>Current path: {pathname}</p>
        </div>
        <header className="App-header">
          <Switch>
            <ProtectedRoute path={AppRoute.ROOT} component={Counter} exact />
            <Route path={AppRoute.LOGIN} component={Login} exact />
            <Route path={AppRoute.SIGN_UP} component={SignUp} exact />
            <ProtectedRoute
              path={AppRoute.WORKSPACES}
              component={Workspaces}
              exact
            />
            <Route path={AppRoute.PAGES} component={Pages} exact />
            <ProtectedRoute
              path={AppRoute.SETTINGS_PROFILE}
              component={Profile}
              exact
            />
            <ProtectedRoute
              path={AppRoute.WORKSPACE_SETTING}
              component={Workspace}
              exact
            />
          </Switch>
        </header>
      </div>
    </>
  );
};

export default App;
