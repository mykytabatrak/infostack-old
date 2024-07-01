import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Auth, { loader as authLoader } from "./routes/auth/index.tsx";
import ResetPassword, {
  action as resetPasswordAction,
} from "./routes/auth/reset-password.tsx";
import SignIn, { action as signInAction } from "./routes/auth/sign-in.tsx";
import SignUp, { action as signUpAction } from "./routes/auth/sign-up.tsx";
import SignUpSuccess from "./routes/auth/sign-up-success.tsx";
import Root, {
  id as rootId,
  loader as rootLoader,
  ErrorElement as RootErrorElement,
} from "./routes/root.tsx";
import Workspaces, {
  loader as workspacesLoader,
} from "./routes/workspaces.tsx";
import UpdatePassword, {
  action as updatePasswordAction,
} from "./routes/auth/update-password.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    id: rootId,
    loader: rootLoader,
    element: <Root />,
    errorElement: <RootErrorElement />,
    children: [
      {
        path: "auth",
        loader: authLoader,
        element: <Auth />,
        children: [
          {
            path: "sign-in",
            action: signInAction,
            element: <SignIn />,
          },
          {
            path: "sign-up",
            action: signUpAction,
            element: <SignUp />,
          },
          {
            path: "sign-up-success",
            element: <SignUpSuccess />,
          },
          {
            path: "reset-password",
            action: resetPasswordAction,
            element: <ResetPassword />,
          },
          {
            path: "update-password",
            action: updatePasswordAction,
            element: <UpdatePassword />,
          },
        ],
      },
      {
        path: "workspaces",
        loader: workspacesLoader,
        element: <Workspaces />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
