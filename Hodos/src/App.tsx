import { Route, Routes } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import Register from './auth/Register';
import Login from './auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIO from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { Suspense, useEffect } from 'react';
import { fetchUser } from './store/authSlice';
import { AppDispatch } from './store/store';
import ProtectedRoute from './auth/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

const socket1 = socketIO(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}`, {
  autoConnect: false,
});

const socket2 = socketIO(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[1]}`, {
  autoConnect: false,
});

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    socket1.connect();
    socket2.connect();
    
    return () => {
      socket1.disconnect();
      socket2.disconnect();
    };
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflow"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip-approval"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims-approval"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget-monitoring"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EmployeePage socket1={socket1} socket2={socket2} />
              </ProtectedRoute>
            }
          />

          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;