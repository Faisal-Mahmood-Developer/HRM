// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('loggedInUser'));

//   // Allow access if logged in (admin or not)
//   if (!user || !user.empId) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // ✅ FIXED

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;



