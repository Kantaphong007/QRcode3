
import React, { useState } from 'react';
import authService from '../services/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);

    try {
      const response = await authService.register(username, email, password);
      setMessage(response.data.message || 'Registration successful!');
      setSuccessful(true);
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setSuccessful(false);
    }
  };

  return (
    <div className="p-3">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        {!successful && (
          <div>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        )}
        {message && (
          <div className={`alert ${successful ? 'alert-success' : 'alert-danger'} mt-3`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
