import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatusOne } from '../hooks/useAuthStatusOne';
// outlet lets us to render child elements

function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatusOne();
  // const loggedIn = true;

  if (checkingStatus) {
    return <h3>Loading ...</h3>;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
