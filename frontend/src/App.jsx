import React from 'react';
import Homepage from './components/homepage'; 
import MainLayout from './components/mainlayout';
import Profile from './components/profile';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<MainLayout><Homepage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
    </Routes>
    </BrowserRouter>
    
  );
}


export default App;

     {/* <Homepage/>  */}
    
