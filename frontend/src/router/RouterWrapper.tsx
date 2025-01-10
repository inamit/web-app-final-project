import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import { useUser } from "../context/userContext";
import AuthRedirect from "../pages/AuthRedirect";
import SignUp from "../pages/SignUp/SignUp";
import UserProfile from "../pages/UserProfile/UserProfile";
import { routes } from "./routes";
import AuthRequired from "../pages/AuthRequired";

export default function AppWrapper() {
  const { isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path={routes.USER_PROFILE}
            element={
              <AuthRequired>
                <UserProfile />
              </AuthRequired>
            }
          />
          <Route
            path={routes.USER_PROFILE + "/:userId"}
            element={<UserProfile />}
          />
          <Route path={routes.SIGN_UP} element={<SignUp />} />
          <Route path="*" element={<AuthRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}