import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MyEvents from './components/MyEvents';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import AddEvent from './components/AddEvent';
import EventDetail from './components/EventDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/events/:documentId" element={<EventDetail />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;