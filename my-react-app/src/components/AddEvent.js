
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/event';
import authService from '../services/auth';

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [amountTotal, setAmountTotal] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await eventService.createEvent({ eventName, location, date, amountTotal: parseFloat(amountTotal), maxAttendees: parseInt(maxAttendees), host: authService.getCurrentUser().user.id });
      navigate('/');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div className="p-3">
      <h1>Add Event</h1>
      <form onSubmit={handleAddEvent}>
        <div className="mb-3">
          <label htmlFor="eventName">Event Name</label>
          <input type="text" className="form-control" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="location">Location</label>
          <input type="text" className="form-control" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="date">Date and Time</label>
          <input type="datetime-local" className="form-control" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="amountTotal">Cost (THB)</label>
          <input type="number" className="form-control" id="amountTotal" value={amountTotal} onChange={(e) => setAmountTotal(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="maxAttendees">Max Players</label>
          <input type="number" className="form-control" id="maxAttendees" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Event</button>
        {message && <div className="alert alert-danger mt-3">{message}</div>}
      </form>
    </div>
  );
}

export default AddEvent;
