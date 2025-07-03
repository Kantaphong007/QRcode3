import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="p-3">
      {currentUser ? (
        <div>
          <h1>Profile</h1>
          <p><strong>Username:</strong> {currentUser.user.username}</p>
          <p><strong>Email:</strong> {currentUser.user.email}</p>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Profile</h1>
          <p>You are not logged in.</p>
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      )}
    </div>
  );
}

export default Profile;