// EditEventModal.jsx
import React, { useState, useEffect } from 'react';
import eventService from '../services/event'; // ตรวจสอบพาธให้ถูกต้อง

// คอมโพเนนต์ Modal สำหรับแก้ไข Event
const EditEventModal = ({ isOpen, onClose, eventData, onUpdateSuccess }) => {
    // State สำหรับฟอร์มแก้ไข
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [amountTotal, setAmountTotal] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // State สำหรับเก็บข้อความ Error ของแต่ละฟิลด์ (เหมือน AddEvent)
    const [errors, setErrors] = useState({
        eventName: '',
        location: '',
        date: '',
        amountTotal: '',
        maxAttendees: ''
    });

    // ใช้ useEffect เพื่อโหลดข้อมูล Event เข้าสู่ฟอร์มเมื่อ Modal เปิดหรือ eventData เปลี่ยน
    useEffect(() => {
        if (isOpen && eventData) {
            setEventName(eventData.eventName || '');
            setLocation(eventData.location || '');
            // แปลง Date object เป็น string ที่ input type="datetime-local" ต้องการ
            // ตรวจสอบให้แน่ใจว่า eventData.date เป็นรูปแบบที่ถูกต้อง
            const eventDate = eventData.date ? new Date(eventData.date) : null;
            if (eventDate && !isNaN(eventDate.getTime())) {
                setDate(eventDate.toISOString().slice(0, 16)); // YYYY-MM-DDTHH:MM
            } else {
                setDate('');
            }
            setAmountTotal(eventData.amountTotal ? String(eventData.amountTotal) : '');
            setMaxAttendees(eventData.maxAttendees ? String(eventData.maxAttendees) : '');
            setMessage(''); // ล้างข้อความเมื่อเปิด Modal
            setErrors({ eventName: '', location: '', date: '', amountTotal: '', maxAttendees: '' }); // ล้าง errors
        }
    }, [isOpen, eventData]);

    // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม (เหมือน AddEvent)
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            eventName: '',
            location: '',
            date: '',
            amountTotal: '',
            maxAttendees: ''
        };

        if (!eventName.trim()) { newErrors.eventName = 'Event Name is required.'; isValid = false; }
        else if (eventName.trim().length < 3) { newErrors.eventName = 'Event Name must be at least 3 characters long.'; isValid = false; }

        if (!location.trim()) { newErrors.location = 'Location is required.'; isValid = false; }

        const now = new Date();
        const selectedDate = new Date(date);
        if (!date) { newErrors.date = 'Date and Time is required.'; isValid = false; }
        else if (isNaN(selectedDate.getTime())) { newErrors.date = 'Invalid Date and Time format.'; isValid = false; }
        else if (selectedDate < now) { newErrors.date = 'Date and Time cannot be in the past.'; isValid = false; }

        const parsedAmountTotal = parseFloat(amountTotal);
        if (!amountTotal.trim()) { newErrors.amountTotal = 'Cost is required.'; isValid = false; }
        else if (isNaN(parsedAmountTotal) || parsedAmountTotal <= 0) { newErrors.amountTotal = 'Cost must be a positive number.'; isValid = false; }

        const parsedMaxAttendees = parseInt(maxAttendees);
        if (!maxAttendees.trim()) { newErrors.maxAttendees = 'Max Players is required.'; isValid = false; }
        else if (isNaN(parsedMaxAttendees) || parsedMaxAttendees <= 0) { newErrors.maxAttendees = 'Max Players must be a positive integer.'; isValid = false; }
        else if (parsedMaxAttendees > 100) { newErrors.maxAttendees = 'Max Players cannot exceed 100.'; isValid = false; } // Example limit

        setErrors(newErrors);
        return isValid;
    };

    // ฟังก์ชันสำหรับจัดการการส่งฟอร์มแก้ไข Event
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            setMessage('Please fix the errors in the form.');
            return;
        }

        setLoading(true);
        try {
            // สร้าง Object ของข้อมูลที่แก้ไขแล้ว
            const updatedData = {
                eventName,
                location,
                date,
                amountTotal: parseFloat(amountTotal),
                maxAttendees: parseInt(maxAttendees),
            };

            // เรียกใช้ eventService.updateEvent
            // ตรวจสอบว่า eventData.id ถูกต้อง (หรือ eventData.documentId)
            await eventService.updateEvent(eventData.documentId, updatedData); // ใช้ eventData.id ของ Event ที่เลือก
            setMessage('Event updated successfully!');
            setLoading(false);
            onUpdateSuccess(); // เรียกฟังก์ชัน callback เมื่ออัปเดตสำเร็จ
        } catch (error) {
            setLoading(false);
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.error.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
            console.error("Error updating event:", error.response ? error.response.data : error.message);
        }
    };

    // ถ้า Modal ไม่เปิด ก็ไม่ต้อง Render อะไรเลย
    if (!isOpen) return null;

    return (
        // Bootstrap Modal Structure
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Event: {eventData?.eventName}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleUpdateEvent}>
                            <div className="mb-3">
                                <label htmlFor="editEventName" className="form-label">Event Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.eventName ? 'is-invalid' : ''}`}
                                    id="editEventName"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    required
                                />
                                {errors.eventName && <div className="invalid-feedback">{errors.eventName}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editLocation" className="form-label">Location</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                    id="editLocation"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editDate" className="form-label">Date and Time</label>
                                <input
                                    type="datetime-local"
                                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                    id="editDate"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editAmountTotal" className="form-label">Cost (THB)</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.amountTotal ? 'is-invalid' : ''}`}
                                    id="editAmountTotal"
                                    value={amountTotal}
                                    onChange={(e) => setAmountTotal(e.target.value)}
                                    required
                                />
                                {errors.amountTotal && <div className="invalid-feedback">{errors.amountTotal}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editMaxAttendees" className="form-label">Max Players</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.maxAttendees ? 'is-invalid' : ''}`}
                                    id="editMaxAttendees"
                                    value={maxAttendees}
                                    onChange={(e) => setMaxAttendees(e.target.value)}
                                    required
                                />
                                {errors.maxAttendees && <div className="invalid-feedback">{errors.maxAttendees}</div>}
                            </div>
                            {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-3`}>{message}</div>}
                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEventModal;
