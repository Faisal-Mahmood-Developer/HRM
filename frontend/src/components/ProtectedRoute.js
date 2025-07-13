// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, isAllowed }) => {
//   if (!isAllowed) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  // Allow access if logged in (admin or not)
  if (!user || !user.empId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

