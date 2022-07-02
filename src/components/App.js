import { Toaster } from 'react-hot-toast';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Home, Login, Page404, Signup, Settings } from '../pages/index';
import { Loader, NavBar } from './index';
import { useAuth } from '../hooks';
import React from 'react';
import UserProfile from '../pages/UserProfile';

function AuthRoute({ children }) {
  const auth = useAuth();
  return auth.user ? children : <Navigate to='/login' />;
}

function App() {
  const auth = useAuth();
  console.log(auth);

  if (auth.loading) {
    return <Loader />;
  }
  return (
    <div className='App'>
      <Router>
        <Toaster />
        <NavBar />

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Signup />} />
          <Route
            exact
            path='/settings'
            element={
              <AuthRoute>
                <Settings />
              </AuthRoute>
            }
          />
          <Route
            exact
            path='/user/:userId'
            element={
              <AuthRoute>
                <UserProfile />
              </AuthRoute>
            }
          />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
