
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import eventService from '../services/event';

const EventDetail = () => {
  const { documentId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEvent(documentId);
        setEvent(response.data.data);
        console.log('Fetched event details:', response.data.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [documentId]);

  if (!event) {
    return <div className="p-3">Loading event details...</div>;
  }

  return (
    <div className="p-3 mb-5">
      <h1>{event?.eventName}</h1>
      <p><strong>Location:</strong> {event?.location}</p>
      <p><strong>Date:</strong> {new Date(event?.datetime).toLocaleString()}</p>
      <p><strong>Cost:</strong> {event?.amountTotal} THB</p>
      <p><strong>Max Players:</strong> {event?.maxAttendees}</p>
      <p><strong>Current Players:</strong> {event.attendees?.length || 0}</p>

      <h2>Participants:</h2>
      {event.attendees?.length > 0 ? (
        <ul className="list-group">
          {event.attendees.map(attendee => (
            <li key={attendee?.id} className="list-group-item">{attendee?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No participants yet.</p>
      )}
    </div>
  );
}

export default EventDetail;
