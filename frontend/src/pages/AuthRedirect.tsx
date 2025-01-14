import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { routes } from "../router/routes";

export default function AuthRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.USER_PROFILE);
    } else {
      navigate(routes.SIGN_UP);
    }
  }, [user]);

  return <></>;
}
