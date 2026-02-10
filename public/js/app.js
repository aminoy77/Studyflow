// Main Application Logic

// Check authentication
auth.onAuthStateChanged((user) => {
    if (!user && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    if (user) {
        initializeApp(user);
    }
});

// Initialize app
function initializeApp(user) {
    document.getElementById('userName').textContent = user.displayName || user.email;
    loadCalendarEvents();
    loadUpcomingExams();
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Page Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        showPage(page);
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

function showPage(pageName) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageName + 'Page').classList.remove('hidden');
    
    // Load page-specific data
    switch(pageName) {
        case 'grades':
            loadGrades();
            break;
        case 'groups':
            loadGroups();
            break;
    }
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// ========== EXAM FORM ==========
document.getElementById('examForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('examSubject').value;
    const date = document.getElementById('examDate').value;
    const time = document.getElementById('examTime').value || '09:00';
    const hours = parseFloat(document.getElementById('examHours').value);
    
    try {
        const userId = getUserId();
        
        // Add exam to Firestore
        const examRef = await db.collection('exams').add({
            userId: userId,
            subject: subject,
            examDate: date,
            examTime: time,
            totalStudyHours: hours,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Generate study sessions
        await generateStudySessions(examRef.id, date, hours);
        
        hideModal('examModal');
        document.getElementById('examForm').reset();
        loadCalendarEvents();
        loadUpcomingExams();
        
        alert('Exam added and study sessions generated!');
    } catch (error) {
        console.error('Error adding exam:', error);
        alert('Error adding exam: ' + error.message);
    }
});

// ========== TASK FORM ==========
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const category = document.getElementById('taskCategory').value;
    const dueDate = document.getElementById('taskDate').value;
    const priority = document.getElementById('taskPriority').value;
    
    try {
        await db.collection('tasks').add({
            userId: getUserId(),
            title: title,
            category: category,
            dueDate: dueDate,
            priority: priority,
            completed: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        hideModal('taskModal');
        document.getElementById('taskForm').reset();
        loadCalendarEvents();
        
        alert('Task added successfully!');
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Error adding task: ' + error.message);
    }
});

// ========== EVENT FORM ==========
document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const startTime = document.getElementById('eventStartTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    const color = document.getElementById('eventColor').value;
    
    try {
        await db.collection('customEvents').add({
            userId: getUserId(),
            title: title,
            eventDate: date,
            startTime: startTime,
            endTime: endTime,
            color: color,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        hideModal('eventModal');
        document.getElementById('eventForm').reset();
        loadCalendarEvents();
        
        alert('Event added successfully!');
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event: ' + error.message);
    }
});

// ========== SUBJECT FORM ==========
document.getElementById('subjectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('subjectName').value;
    const target = parseFloat(document.getElementById('subjectTarget').value) || null;
    
    try {
        await db.collection('subjects').add({
            userId: getUserId(),
            name: name,
            targetGrade: target,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        hideModal('subjectModal');
        document.getElementById('subjectForm').reset();
        loadGrades();
        
        alert('Subject added successfully!');
    } catch (error) {
        console.error('Error adding subject:', error);
        alert('Error adding subject: ' + error.message);
    }
});

// ========== GROUP FORM ==========
document.getElementById('groupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('groupName').value;
    const subject = document.getElementById('groupSubject').value;
    const description = document.getElementById('groupDescription').value;
    
    try {
        const userId = getUserId();
        
        const groupRef = await db.collection('studyGroups').add({
            name: name,
            subject: subject,
            description: description,
            adminId: userId,
            members: [userId],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        hideModal('groupModal');
        document.getElementById('groupForm').reset();
        loadGroups();
        
        alert('Study group created successfully!');
    } catch (error) {
        console.error('Error creating group:', error);
        alert('Error creating group: ' + error.message);
    }
});

// ========== GENERATE STUDY SESSIONS ==========
async function generateStudySessions(examId, examDate, totalHours) {
    const examDateObj = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysUntilExam = Math.ceil((examDateObj - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExam <= 0) return;
    
    // Calculate weights (exponential distribution)
    const weights = [];
    for (let day = 0; day < daysUntilExam; day++) {
        const daysBeforeExam = daysUntilExam - day;
        const weight = Math.pow(2, 1 - (daysBeforeExam / daysUntilExam));
        weights.push(weight);
    }
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let remainingHours = totalHours;
    
    // Create study sessions
    const batch = db.batch();
    
    for (let i = 0; i < daysUntilExam; i++) {
        if (remainingHours <= 0) break;
        
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + i);
        
        let dailyHours = (weights[i] / totalWeight) * totalHours;
        dailyHours = Math.min(dailyHours, 3.0); // Max 3h per day
        dailyHours = Math.max(dailyHours, 0.5); // Min 30min
        dailyHours = Math.min(dailyHours, remainingHours);
        
        if (dailyHours >= 0.5) {
            // Determine start time based on how close to exam
            let startTime;
            if (i < daysUntilExam / 3) {
                startTime = '18:00';
            } else if (i < 2 * daysUntilExam / 3) {
                startTime = '17:00';
            } else {
                startTime = '16:00';
            }
            
            const sessionRef = db.collection('studySessions').doc();
            batch.set(sessionRef, {
                examId: examId,
                userId: getUserId(),
                sessionDate: sessionDate.toISOString().split('T')[0],
                startTime: startTime,
                durationHours: Math.round(dailyHours * 100) / 100,
                completed: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            remainingHours -= dailyHours;
        }
    }
    
    await batch.commit();
}

// ========== LOAD GRADES ==========
async function loadGrades() {
    try {
        const userId = getUserId();
        const snapshot = await db.collection('subjects')
            .where('userId', '==', userId)
            .get();
        
        const grid = document.getElementById('subjectsGrid');
        grid.innerHTML = '';
        
        if (snapshot.empty) {
            grid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No subjects yet. Add your first subject!</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const subject = doc.data();
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3 class="font-bold text-lg mb-2">${subject.name}</h3>
                <p class="text-sm text-gray-600">Target: ${subject.targetGrade || 'N/A'}</p>
                <p class="text-sm text-gray-600">Average: Coming soon</p>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

// ========== LOAD GROUPS ==========
async function loadGroups() {
    try {
        const userId = getUserId();
        const snapshot = await db.collection('studyGroups')
            .where('members', 'array-contains', userId)
            .get();
        
        const list = document.getElementById('groupsList');
        list.innerHTML = '';
        
        if (snapshot.empty) {
            list.innerHTML = '<p class="text-gray-500 col-span-full text-center">No study groups yet. Create your first group!</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const group = doc.data();
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3 class="font-bold text-lg mb-2">${group.name}</h3>
                <p class="text-sm text-gray-600">${group.subject || 'General'}</p>
                <p class="text-sm text-gray-600">${group.members.length} members</p>
                <p class="text-xs text-gray-500 mt-2">${group.description || ''}</p>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}

// ========== LOAD UPCOMING EXAMS ==========
async function loadUpcomingExams() {
    try {
        const userId = getUserId();
        const today = new Date().toISOString().split('T')[0];
        
        const snapshot = await db.collection('exams')
            .where('userId', '==', userId)
            .where('examDate', '>=', today)
            .orderBy('examDate')
            .limit(5)
            .get();
        
        const container = document.getElementById('upcomingExams');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No upcoming exams</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const exam = doc.data();
            const examDate = new Date(exam.examDate);
            const daysUntil = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));
            
            const div = document.createElement('div');
            div.className = 'p-3 bg-red-50 rounded-lg';
            div.innerHTML = `
                <div class="font-medium">${exam.subject}</div>
                <div class="text-sm text-gray-600">${examDate.toLocaleDateString()}</div>
                <div class="text-xs text-red-600">${daysUntil} days away</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading upcoming exams:', error);
    }
}

console.log('📱 App loaded');
