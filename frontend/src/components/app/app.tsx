import Login from 'components/login/login';
import SignUp from 'components/sign-up/sign-up';
import Workspaces from 'components/workspaces/workspaces';
import ProtectedRoute from 'components/common/protected-route/protected-route';
import { AppRoute, LocalStorageVariable } from 'common/enums/enums';
import { Route, Switch } from 'components/common/common';
import {
  useLocation,
  useAppSelector,
  useEffect,
  useHistory,
} from 'hooks/hooks';
import Main from 'components/main/main';
import ResetPassword from 'components/reset-password/reset-password';
import SetPassword from 'components/set-password/set-password';
import NotFound from 'components/not-found/not-found';
import { ToastContainer } from 'react-toastify';
import SignUpInvite from 'components/sign-up-invite/sign-up-invite';

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isAuth = ([AppRoute.LOGIN, AppRoute.SIGN_UP] as string[]).includes(
    pathname,
  );
  const { isRefreshTokenExpired } = useAppSelector((state) => state.auth);
  const history = useHistory();
  const token = localStorage.getItem(LocalStorageVariable.ACCESS_TOKEN);

  useEffect(() => {
    if (token && isAuth) {
      history.push(AppRoute.WORKSPACES);
    }
  }, []);

  useEffect(() => {
    if (isRefreshTokenExpired) {
      history.push(AppRoute.LOGIN);
    }
  }, [isRefreshTokenExpired]);

  return (
    <>
      <Switch>
        <Route path={AppRoute.LOGIN} component={Login} exact />
        <Route path={AppRoute.SIGN_UP} component={SignUp} exact />
        <Route path={AppRoute.INVITE} component={SignUpInvite} exact />
        <Route path={AppRoute.RESET_PASSWORD} component={ResetPassword} exact />
        <Route path={AppRoute.SET_PASSWORD} component={SetPassword} exact />
        <ProtectedRoute
          path={AppRoute.WORKSPACES}
          component={Workspaces}
          exact
        />
        <ProtectedRoute path={AppRoute.ROOT} component={Main} />
        <Route path="*" component={NotFound} />
      </Switch>
      <ToastContainer />
    </>
  );
};

export default App;
