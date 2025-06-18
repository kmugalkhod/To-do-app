const dropdownBtn = document.getElementById('emailDropdownBtn');
const dropdownMenu = document.getElementById('emailDropdownMenu');
document.addEventListener('click', function(e) {
  if (dropdownBtn.contains(e.target)) {
    dropdownMenu.classList.toggle('show');
  } else if (!dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
  }
});

document.getElementById('showFullEmail').onclick = function() {
  alert('Kunalmugalkhod007@gmail.com');
};
document.getElementById('logoutBtn').onclick = function() {
  alert('Logging out...');
  console.log('User logged out');
  // Add your logout logic here
};




document.querySelector('.add-task-btn-text').onclick = function() {
  document.getElementById('addTaskModal').classList.add('show');
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('addTaskConfirmBtn').textContent = 'Add Task';
  delete document.getElementById('addTaskConfirmBtn').dataset.editIndex;
};

// Close modal
document.getElementById('closeModalBtn').onclick = function() {
  document.getElementById('addTaskModal').classList.remove('show');
};

// Add task to localStorage
document.getElementById('addTaskConfirmBtn').onclick = function() {
  const desc = document.getElementById('taskDescription').value.trim();
  const date = document.getElementById('taskDate').value;
  if (!desc) {
    alert('Please enter a description.');
    return;
  }
  const task = { description: desc, date: date, created: new Date().toISOString(), completed: false };
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.getElementById('addTaskModal').classList.remove('show');
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDate').value = '';
  // Optionally, refresh your task list here
};

// Optional: Close modal when clicking outside content
document.getElementById('addTaskModal').onclick = function(e) {
  if (e.target === this) this.classList.remove('show');
};

function renderTasks() {
  const bottomtaskPanel = document.getElementById('bottomtaskPanel');
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  bottomtaskPanel.innerHTML = '';

  // Group tasks by date
  const grouped = {};
  tasks.forEach(task => {
    const key = task.date || 'No Date';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  // Render each group
  Object.keys(grouped).sort().forEach(date => {
    // Date heading
    const dateHeading = document.createElement('div');
    dateHeading.className = 'task-date-heading';
    dateHeading.textContent = date === 'No Date' ? 'No Date' : date;
    bottomtaskPanel.appendChild(dateHeading);

    // Horizontal line
    const hr = document.createElement('hr');
    hr.className = 'task-date-hr';
    bottomtaskPanel.appendChild(hr);

    // Tasks for this date
    grouped[date].forEach((task, idx) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = !!task.completed; // Show checked if completed

      checkbox.onchange = function () {
        task.completed = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // Optionally, you can add a style for completed tasks
        renderTasks();
      };

      const desc = document.createElement('label');
      desc.className = 'task-desc';
      desc.textContent = task.description;
      if (task.completed) {
        desc.style.textDecoration = 'line-through';
        desc.style.opacity = '0.6';
      }

      // --- Add edit icon button ---
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-task-btn';
      editBtn.title = 'Edit task';
      editBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="#e74c3c" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
        </svg>
      `;
      editBtn.onclick = function () {
        // Replace desc and editBtn with input, date, save, and cancel
        desc.style.display = 'none';
        editBtn.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.description;
        input.className = 'desc-input';
        input.style.flex = '1';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.date || '';
        dateInput.className = 'date-input';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'modal-add-btn';
        saveBtn.style.marginLeft = '8px';
        saveBtn.onclick = function () {
          task.description = input.value.trim();
          task.date = dateInput.value;
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'modal-add-btn';
        cancelBtn.style.background = '#bbb';
        cancelBtn.style.marginLeft = '8px';
        cancelBtn.onclick = function () {
          renderTasks();
        };

        taskDiv.appendChild(input);
        taskDiv.appendChild(dateInput);
        taskDiv.appendChild(saveBtn);
        taskDiv.appendChild(cancelBtn);
      };

      taskDiv.appendChild(checkbox);
      taskDiv.appendChild(desc);
      taskDiv.appendChild(editBtn);

      bottomtaskPanel.appendChild(taskDiv);
    });
  });
}

// Call renderTasks on page load
window.onload = renderTasks;

// After adding a task, call renderTasks()
document.getElementById('addTaskConfirmBtn').onclick = function() {
  const desc = document.getElementById('taskDescription').value.trim();
  const date = document.getElementById('taskDate').value;
  if (!desc) {
    alert('Please enter a description.');
    return;
  }
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const editIndex = this.dataset.editIndex;
  if (editIndex !== undefined && editIndex !== "") {
    // Update existing task
    tasks[editIndex].description = desc;
    tasks[editIndex].date = date;
    this.textContent = 'Add Task';
    delete this.dataset.editIndex;
  } else {
    // Add new task
    const task = { description: desc, date: date, created: new Date().toISOString(), completed: false };
    tasks.push(task);
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.getElementById('addTaskModal').classList.remove('show');
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDate').value = '';
  renderTasks();
};