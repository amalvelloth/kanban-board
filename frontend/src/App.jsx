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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
        closeButton={false}
        draggable
        theme="dark"
        toastClassName="!rounded-full !min-h-9 !py-6 !px-3 text-white border border-white/10 shadow-2xl shadow-black/40 font-rmneue"
        bodyClassName="!m-0 !p-0 text-xs font-medium"
        progressClassName="bg-lime-400"
        style={{
          '--toastify-toast-min-height': '40px',
        }}
      />
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
  const navbarClass = location.pathname === '/login'
      ? 'md:bg-white/20'
      : location.pathname === '/controlpanel'
        ? 'md:bg-white/10'
        : 'md:bg-white/10 [.light_&]:bg-neutral-100';

  return <Navbar className={navbarClass} />
}

export default App;
