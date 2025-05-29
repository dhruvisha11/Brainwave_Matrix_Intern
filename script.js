const planner = document.getElementById('planner');
const hours = [
  '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
];

const datePicker = document.getElementById('datePicker');
const currentDateText = document.getElementById('currentDate');

// Load today's date by default
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;

let selectedDate = today;

function loadTasks() {
  planner.innerHTML = '';
  const currentHour = new Date().getHours();
  currentDateText.innerText = formatDisplayDate(selectedDate);

  hours.forEach((hour, index) => {
    const savedTask = localStorage.getItem(`${selectedDate}-task-${index}`) || '';
    createTimeBlock(hour, index, savedTask, currentHour);
  });
}

function createTimeBlock(hour, index, savedTask, currentHour) {
  const block = document.createElement('div');
  block.classList.add('time-block');

  const hourLabel = document.createElement('div');
  hourLabel.classList.add('hour');
  hourLabel.innerText = hour;

  const taskInput = document.createElement('input');
  taskInput.classList.add('task');
  taskInput.type = 'text';
  taskInput.placeholder = 'Enter your task...';
  taskInput.value = savedTask;

  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.innerText = 'Save';

  saveBtn.addEventListener('click', () => {
    localStorage.setItem(`${selectedDate}-task-${index}`, taskInput.value);
    showToast("Task saved!");
  });

  const blockHour = parseInt(hour.split(' ')[0]) + (hour.includes('PM') && hour !== '12 PM' ? 12 : 0);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  if (isToday) {
    if (blockHour < currentHour) {
      block.classList.add('past');
    } else if (blockHour === currentHour) {
      block.classList.add('present');
    } else {
      block.classList.add('future');
    }
  }

  block.appendChild(hourLabel);
  block.appendChild(taskInput);
  block.appendChild(saveBtn);

  planner.appendChild(block);
}

function formatDisplayDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

// Calendar change handler
datePicker.addEventListener('change', (e) => {
  selectedDate = e.target.value;
  loadTasks();
});

// Clear tasks for selected date
document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (confirm("Clear all tasks for this date?")) {
    hours.forEach((_, index) => {
      localStorage.removeItem(`${selectedDate}-task-${index}`);
    });
    loadTasks();
  }
});

// Print
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// Dark mode toggle
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', toggle.checked);
  localStorage.setItem('darkMode', toggle.checked);
});
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  toggle.checked = true;
}

loadTasks();
