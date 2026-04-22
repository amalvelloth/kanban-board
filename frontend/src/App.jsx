import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Dashboard from './pages/Dashboard';
import TaskControl from './pages/TaskControl';
import WorkoutPrograms from './pages/WorkoutPrograms';
import Settings from './pages/Settings';
import SignOut from './pages/SignOut';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <ConditionalNavbar />
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/taskcontrol' element={<TaskControl />} />
        <Route path='/workoutprograms' element={<WorkoutPrograms />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/signout' element={<SignOut />} />
      </Routes>
    </div>
  ); 
}

function ConditionalNavbar() {
  const location = useLocation();
  const navbarClass = location.pathname === '/login' ? 'bg-transparent' : 'bg-[#000]';

  return <Navbar className={navbarClass} />
}

export default App;
