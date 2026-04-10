/**
 * FocusFlow Core Logic
 */

class PomodoroTimer {
    constructor() {
        // Default settings (minutes)
        this.settings = {
            focus: 40,
            shortBreak: 5,
            longBreak: 10
        };

        // State variables
        this.timeLeft = this.settings.focus * 60;
        this.timerId = null;
        this.isRunning = false;
        this.mode = 'focus'; // 'focus', 'shortBreak', 'longBreak'
        this.currentCycle = 1;

        // UI Elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.focusBadge = document.getElementById('focusBadge');
        this.breakBadge = document.getElementById('breakBadge');
        this.cycleCountEl = document.getElementById('cycleCount');
        this.nextBreakLabel = document.getElementById('nextBreakLabel');
        this.alertSound = document.getElementById('alertSound');
        this.endTimeDisplay = document.getElementById('endTime');
        this.autoContinueCheckbox = document.getElementById('autoContinue');

        this.worker = null;
        this.initWorker();
        this.loadSettings();
        this.updateDisplay();
        this.initEventListeners();
    }

    initWorker() {
        this.worker = new Worker('timer-worker.js');
        this.worker.onmessage = (e) => {
            if (e.data === 'tick') {
                this.timeLeft--;
                if (this.timeLeft <= 0) {
                    this.timerFinished();
                }
                this.updateDisplay();
            }
        };
    }

    loadSettings() {
        const saved = localStorage.getItem('focusflow_settings');
        if (saved) {
            this.settings = JSON.parse(saved);
            this.timeLeft = this.settings.focus * 60;
        }
    }

    saveSettings() {
        localStorage.setItem('focusflow_settings', JSON.stringify(this.settings));
    }

    updateDisplay() {
        const minutes = Math.floor(Math.max(0, this.timeLeft) / 60);
        const seconds = Math.max(0, this.timeLeft) % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDisplay.textContent = formattedTime;
        document.title = `${formattedTime} - FocusFlow`;

        // Update end time
        this.updateEndTimeDisplay();

        // Update cycle info
        this.cycleCountEl.textContent = this.currentCycle;
        const nextBreakDuration = (this.currentCycle % 2 === 0) ? this.settings.longBreak : this.settings.shortBreak;
        this.nextBreakLabel.textContent = `下次休息: ${nextBreakDuration} 分鐘`;
    }

    updateEndTimeDisplay() {
        if (!this.isRunning) {
            this.endTimeDisplay.textContent = '計時未啟動';
            return;
        }
        const now = new Date();
        const finishTime = new Date(now.getTime() + this.timeLeft * 1000);
        const hours = finishTime.getHours().toString().padStart(2, '0');
        const minutes = finishTime.getMinutes().toString().padStart(2, '0');
        this.endTimeDisplay.textContent = `預計結束時間: ${hours}:${minutes}`;
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
        lucide.createIcons();
        this.updateEndTimeDisplay();

        this.worker.postMessage('start');
    }

    pause() {
        this.isRunning = false;
        this.worker.postMessage('stop');
        this.startPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        lucide.createIcons();
        this.updateEndTimeDisplay();
    }

    reset() {
        this.pause();
        this.mode = 'focus';
        this.timeLeft = this.settings.focus * 60;
        this.updateStateUI();
        this.updateDisplay();
    }

    async timerFinished() {
        this.pause();
        this.notify();

        const isAuto = this.autoContinueCheckbox.checked;

        if (isAuto) {
            await this.playAlertThreeTimes();
        } else {
            this.playSound();
        }

        if (this.mode === 'focus') {
            if (this.currentCycle % 2 === 0) {
                this.startMode('longBreak');
            } else {
                this.startMode('shortBreak');
            }
        } else {
            this.currentCycle++;
            this.startMode('focus');
        }

        if (isAuto) {
            this.start();
        }
    }

    async playAlertThreeTimes() {
        for (let i = 0; i < 3; i++) {
            this.playSound();
            if (i < 2) {
                // Wait 1.5 seconds between starts of beeps
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
    }

    startMode(mode) {
        this.mode = mode;
        if (mode === 'focus') {
            this.timeLeft = this.settings.focus * 60;
        } else if (mode === 'shortBreak') {
            this.timeLeft = this.settings.shortBreak * 60;
        } else {
            this.timeLeft = this.settings.longBreak * 60;
        }
        this.updateStateUI();
        this.updateDisplay();
        // Auto-start next phase (optional, common in pomodoro)
        // this.start(); 
    }

    updateStateUI() {
        if (this.mode === 'focus') {
            this.focusBadge.style.display = 'block';
            this.breakBadge.style.display = 'none';
            this.focusBadge.textContent = 'Focus';
            this.focusBadge.className = 'status-badge active-focus';
        } else {
            this.focusBadge.style.display = 'none';
            this.breakBadge.style.display = 'block';
            this.breakBadge.textContent = this.mode === 'shortBreak' ? 'Break (Short)' : 'Break (Long)';
            this.breakBadge.className = 'status-badge active-break';
        }
    }

    playSound() {
        this.alertSound.play().catch(e => console.log('Audio play failed:', e));
    }

    notify() {
        if (Notification.permission === 'granted') {
            const text = this.mode === 'focus' ? '專注結束！休息一下吧。' : '休息結束！回到工作中吧。';
            new Notification('FocusFlow', { body: text, icon: 'assets/bg.png' });
        }
    }

    initEventListeners() {
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        // Notification permission
        if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
}

class TodoManager {
    constructor() {
        this.tasks = [];
        this.listEl = document.getElementById('taskList');
        this.inputEl = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addTaskBtn');
        this.clearBtn = document.getElementById('clearTasks');

        this.loadTasks();
        this.initEventListeners();
        this.render();
    }

    loadTasks() {
        const saved = localStorage.getItem('focusflow_tasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        }
    }

    saveTasks() {
        localStorage.setItem('focusflow_tasks', JSON.stringify(this.tasks));
    }

    addTask(text) {
        if (!text.trim()) return;
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        this.tasks.push(task);
        this.saveTasks();
        this.inputEl.value = '';
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        this.saveTasks();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        const newText = prompt('修改工作目標名稱:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            this.saveTasks();
            this.render();
        }
    }

    clearTasks() {
        if (confirm('確定要清除所有待辦事項嗎？')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    render() {
        this.listEl.innerHTML = '';
        this.tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-checkbox" onclick="todoManager.toggleTask(${task.id})">
                    ${task.completed ? '<i data-lucide="check" style="width:14px;color:white"></i>' : ''}
                </div>
                <div class="task-text">${task.text}</div>
                <div class="task-actions">
                    <div class="edit-task" onclick="todoManager.editTask(${task.id})" title="編輯">
                        <i data-lucide="pencil" style="width:16px"></i>
                    </div>
                    <div class="delete-task" onclick="todoManager.deleteTask(${task.id})" title="刪除">
                        <i data-lucide="x" style="width:18px"></i>
                    </div>
                </div>
            `;
            this.listEl.appendChild(item);
        });
        lucide.createIcons();
    }

    initEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask(this.inputEl.value));
        this.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask(this.inputEl.value);
        });
        this.clearBtn.addEventListener('click', () => this.clearTasks());
    }
}

// Settings Modal Management
const modal = document.getElementById('modalBackdrop');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');

settingsBtn.addEventListener('click', () => {
    document.getElementById('focusDuration').value = timer.settings.focus;
    document.getElementById('shortBreakDuration').value = timer.settings.shortBreak;
    document.getElementById('longBreakDuration').value = timer.settings.longBreak;
    modal.style.display = 'flex';
});

closeSettings.addEventListener('click', () => modal.style.display = 'none');

saveSettings.addEventListener('click', () => {
    timer.settings.focus = parseFloat(document.getElementById('focusDuration').value) || 40;
    timer.settings.shortBreak = parseFloat(document.getElementById('shortBreakDuration').value) || 5;
    timer.settings.longBreak = parseFloat(document.getElementById('longBreakDuration').value) || 10;
    timer.saveSettings();
    timer.reset(); // Reset timer to new focus duration
    modal.style.display = 'none';
});

// Initialize Managers
const timer = new PomodoroTimer();
const todoManager = new TodoManager();

// Window Global for inline onclick
window.todoManager = todoManager;
