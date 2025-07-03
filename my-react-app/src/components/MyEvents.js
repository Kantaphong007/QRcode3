
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eventService from '../services/event';
import authService from '../services/auth';

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchMyEvents(user.user.id);
    }
  }, []);

  const fetchMyEvents = async (userId) => {
    try {
      const response = await eventService.getMyEvents(userId);
      setMyEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        fetchMyEvents(currentUser.user.id); // Refresh events after deletion
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  return (
    <div className="p-3 mb-5">
      <h1>My Events</h1>
      {currentUser ? (
        <div className="row">
          {myEvents.map(event => (
            <div className="col-12 mb-3" key={event.id}>
              <div className="card">
                <div className="card-body">
                  <Link to={`/events/${event.id}`} className="text-decoration-none">
                    <h5 className="card-title">{event.attributes.name}</h5>
                  </Link>
                  <p className="card-text">Location: {event.attributes.location}</p>
                  <p className="card-text">Date: {new Date(event.attributes.datetime).toLocaleString()}</p>
                  <p className="card-text">Cost: {event.attributes.cost} THB</p>
                  <p className="card-text">Players: {event.attributes.participants?.data.length || 0} / {event.attributes.max_players}</p>
                  {event.attributes.creator?.data?.id === currentUser.user.id && (
                    <div className="mt-3">
                      <Link to={`/edit-event/${event.id}`} className="btn btn-warning me-2">Edit</Link>
                      <button onClick={() => handleDeleteEvent(event.id)} className="btn btn-danger">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Please log in to see your events.</p>
      )}
    </div>
  );
}

export default MyEvents;
