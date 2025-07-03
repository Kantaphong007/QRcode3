import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth';
import eventService from '../services/event';
import EditEventModal from './EditEventModal';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // เก็บข้อมูล Event ที่กำลังจะแก้ไข

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://truthful-caring-production.up.railway.app/api/events?populate=*');
      setEvents(response.data.data);
      console.log('Fetched events:', response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleJoinEvent = async (eventDocumentId) => {
    if (!currentUser) {
      alert('Please log in to join an event.');
      return;
    }
    try {
      await eventService.joinEvent(eventDocumentId, currentUser.user.id);
      fetchEvents(); // Refresh events after joining
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join event.');
    }
  };

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข Event
  const handleOpenEditModal = (event) => {
    setSelectedEvent(event); // กำหนด Event ที่เลือก
    setIsEditModalOpen(true); // เปิด Modal
  };

  // ฟังก์ชันสำหรับปิด Modal แก้ไข Event
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // ปิด Modal
    setSelectedEvent(null); // ล้างข้อมูล Event ที่เลือก
  };

  // ฟังก์ชันที่จะถูกเรียกเมื่อแก้ไข Event สำเร็จใน Modal
  const handleEventUpdateSuccess = async () => {
    handleCloseEditModal(); // ปิด Modal
    // รีโหลดรายการ Events ใหม่หลังจากแก้ไขสำเร็จ
    const user = authService.getCurrentUser();
    if (user) {
      try {
        fetchEvents()
      } catch (err) {
        console.error("Error reloading events:", err);
      }
    }
  };

  // if (loading) {
  //   return <div className="p-3">Loading events...</div>;
  // }

  // if (error) {
  //   return <div className="p-3 alert alert-danger">{error}</div>;
  // }

  return (
    <div className="p-3 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Events</h1>
        {currentUser && (
          <Link to="/add-event" className="btn btn-primary">Add Event</Link>
        )}
      </div>
      <div className="row">
        {events.map(event => (
          <div className="col-12 mb-3" key={event?.documentId}>
            <div className="card">
              <div className="card-body">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Link to={`/events/${event?.documentId}`} className="text-decoration-none">
                    <h5 className="card-title">{event?.eventName}</h5>
                  </Link>
                  {currentUser && event?.host?.id === currentUser?.user?.id && (
                  <button onClick={() => handleOpenEditModal(event)} className="btn btn-success">Edit</button>
                  )}
                </div>
                <p className="card-text">Location: {event?.location}</p>
                <p className="card-text">Date: {new Date(event?.date).toLocaleString()}</p>
                <p className="card-text">Cost: {event?.amountTotal} THB</p>
                <p className="card-text">Players: {event?.attendees?.length || 0} / {event?.maxAttendees}</p>
                {currentUser && !event?.attendees?.find(p => p.id === currentUser.user.id) && (
                  <button onClick={() => handleJoinEvent(event?.documentId)} className="btn btn-success">Join</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          eventData={selectedEvent}
          onUpdateSuccess={handleEventUpdateSuccess}
        />
      )}
    </div>
  );
}

export default Home;