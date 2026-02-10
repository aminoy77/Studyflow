// Calendar Logic with FullCalendar

let calendar;

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotMinTime: '06:00:00',
            slotMaxTime: '23:00:00',
            allDaySlot: false,
            height: 'auto',
            events: loadCalendarEvents,
            eventClick: handleEventClick
        });
        
        calendar.render();
    }
});

// Load calendar events from Firebase
async function loadCalendarEvents(info, successCallback, failureCallback) {
    try {
        const userId = getUserId();
        if (!userId) {
            failureCallback();
            return;
        }
        
        const events = [];
        
        const startDate = info ? info.startStr.split('T')[0] : null;
        const endDate = info ? info.endStr.split('T')[0] : null;
        
        // Load exams
        const examsSnapshot = await db.collection('exams')
            .where('userId', '==', userId)
            .get();
        
        examsSnapshot.forEach(doc => {
            const exam = doc.data();
            const examTime = exam.examTime || '09:00';
            const endTime = addHours(examTime, 2);
            
            events.push({
                id: `exam_${doc.id}`,
                title: `EXAM: ${exam.subject}`,
                start: `${exam.examDate}T${examTime}`,
                end: `${exam.examDate}T${endTime}`,
                color: '#EF4444',
                extendedProps: {
                    type: 'exam',
                    docId: doc.id
                }
            });
        });
        
        // Load study sessions
        const sessionsSnapshot = await db.collection('studySessions')
            .where('userId', '==', userId)
            .get();
        
        for (const doc of sessionsSnapshot.docs) {
            const session = doc.data();
            const endTime = addHours(session.startTime, session.durationHours);
            
            // Get exam subject
            let examSubject = 'Study';
            if (session.examId) {
                const examDoc = await db.collection('exams').doc(session.examId).get();
                if (examDoc.exists) {
                    examSubject = examDoc.data().subject;
                }
            }
            
            events.push({
                id: `study_${doc.id}`,
                title: `Study: ${examSubject}`,
                start: `${session.sessionDate}T${session.startTime}`,
                end: `${session.sessionDate}T${endTime}`,
                color: session.completed ? '#10B981' : '#6EE7B7',
                extendedProps: {
                    type: 'study',
                    docId: doc.id,
                    completed: session.completed
                }
            });
        }
        
        // Load tasks
        const tasksSnapshot = await db.collection('tasks')
            .where('userId', '==', userId)
            .where('completed', '==', false)
            .get();
        
        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            events.push({
                id: `task_${doc.id}`,
                title: task.title,
                start: `${task.dueDate}T18:00:00`,
                color: '#FBBF24',
                extendedProps: {
                    type: 'task',
                    docId: doc.id
                }
            });
        });
        
        // Load custom events
        const eventsSnapshot = await db.collection('customEvents')
            .where('userId', '==', userId)
            .get();
        
        eventsSnapshot.forEach(doc => {
            const event = doc.data();
            events.push({
                id: `custom_${doc.id}`,
                title: event.title,
                start: `${event.eventDate}T${event.startTime}`,
                end: `${event.eventDate}T${event.endTime}`,
                color: event.color,
                extendedProps: {
                    type: 'custom',
                    docId: doc.id
                }
            });
        });
        
        if (successCallback) {
            successCallback(events);
        }
        
        return events;
        
    } catch (error) {
        console.error('Error loading calendar events:', error);
        if (failureCallback) {
            failureCallback(error);
        }
    }
}

// Handle event click
async function handleEventClick(info) {
    const eventType = info.event.extendedProps.type;
    const docId = info.event.extendedProps.docId;
    
    if (eventType === 'study') {
        const confirmComplete = confirm('Mark this study session as complete?');
        if (confirmComplete) {
            try {
                await db.collection('studySessions').doc(docId).update({
                    completed: true
                });
                calendar.refetchEvents();
                alert('Study session marked as complete!');
            } catch (error) {
                console.error('Error updating session:', error);
                alert('Error updating session');
            }
        }
    } else if (eventType === 'task') {
        const confirmComplete = confirm('Mark this task as complete?');
        if (confirmComplete) {
            try {
                await db.collection('tasks').doc(docId).update({
                    completed: true
                });
                calendar.refetchEvents();
                alert('Task completed!');
            } catch (error) {
                console.error('Error updating task:', error);
                alert('Error updating task');
            }
        }
    } else if (eventType === 'exam' || eventType === 'custom') {
        const confirmDelete = confirm('Delete this event?');
        if (confirmDelete) {
            try {
                const collection = eventType === 'exam' ? 'exams' : 'customEvents';
                await db.collection(collection).doc(docId).delete();
                
                // If exam, also delete study sessions
                if (eventType === 'exam') {
                    const sessionsSnapshot = await db.collection('studySessions')
                        .where('examId', '==', docId)
                        .get();
                    
                    const batch = db.batch();
                    sessionsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                }
                
                calendar.refetchEvents();
                loadUpcomingExams();
                alert('Event deleted!');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error deleting event');
            }
        }
    }
}

// Helper function to add hours to time string
function addHours(timeStr, hours) {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m + (hours * 60);
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

console.log('📅 Calendar initialized');
