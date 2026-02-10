// Pomodoro Timer

let timerMinutes = 25;
let timerSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isBreak = false;
let sessionsCompleted = 0;

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    
    timerInterval = setInterval(() => {
        if (timerSeconds === 0) {
            if (timerMinutes === 0) {
                // Timer finished
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;
                handleTimerComplete();
                return;
            }
            timerMinutes--;
            timerSeconds = 59;
        } else {
            timerSeconds--;
        }
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    
    if (isBreak) {
        timerMinutes = sessionsCompleted % 4 === 0 ? 15 : 5;
    } else {
        timerMinutes = 25;
    }
    
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    
    const mins = String(timerMinutes).padStart(2, '0');
    const secs = String(timerSeconds).padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
}

async function handleTimerComplete() {
    // Play notification sound (optional)
    playNotificationSound();
    
    if (!isBreak) {
        // Work session complete
        sessionsCompleted++;
        
        // Save to Firebase
        try {
            await db.collection('pomodoroSessions').add({
                userId: getUserId(),
                duration: 25,
                completed: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving pomodoro session:', error);
        }
        
        // Start break
        isBreak = true;
        if (sessionsCompleted % 4 === 0) {
            // Long break after 4 sessions
            timerMinutes = 15;
            alert('Great work! Time for a 15-minute break.');
        } else {
            // Short break
            timerMinutes = 5;
            alert('Session complete! Take a 5-minute break.');
        }
    } else {
        // Break complete
        isBreak = false;
        timerMinutes = 25;
        alert('Break over! Ready for another session?');
    }
    
    timerSeconds = 0;
    updateTimerDisplay();
}

function playNotificationSound() {
    // Create a simple beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio notification not supported');
    }
}

// Productivity tips for breaks
const productivityTips = [
    "Stand up and stretch your body",
    "Look away from the screen - 20-20-20 rule",
    "Drink a glass of water",
    "Take a short walk",
    "Do some deep breathing exercises",
    "Organize your desk",
    "Quick meditation",
    "Light snack for energy"
];

function showBreakTip() {
    const tip = productivityTips[Math.floor(Math.random() * productivityTips.length)];
    const tipsDiv = document.getElementById('break-tips');
    if (tipsDiv) {
        tipsDiv.querySelector('p').textContent = tip;
        tipsDiv.classList.remove('hidden');
    }
}

// Initialize timer display
updateTimerDisplay();

console.log('⏱️ Pomodoro timer ready');
