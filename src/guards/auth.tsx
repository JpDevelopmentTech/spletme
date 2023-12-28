import { useSelector } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GuardedRoute = ({children}: any) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAuthenticated = useSelector((state: any) =>state.auth.isAuth);
  console.log(isAuthenticated);
  // if (isAuthenticated == "true") {
  //   return children;
  // } else {
  //   return <Navigate to='/' />;
  // }

  return children
};

export default GuardedRoute;
