var taskInput      = document.getElementById('taskInput');
var addTaskBtn     = document.getElementById('addTaskBtn');
var tasksContainer = document.getElementById('tasksContainer');
var filterAllBtn    = document.getElementById('filterAll');
var filterActiveBtn = document.getElementById('filterActive');
var filterDoneBtn   = document.getElementById('filterDone');

var tasks         = [];
var currentFilter = 'all';

function loadTasks() {
  var saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  var text = taskInput.value.trim();
  if (text === '') return alert('Enter a task!');
  tasks.push({ id: Date.now(), text: text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

function editTask(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  var newText = prompt('Edit task:', task.text);
  if (newText && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function renderTasks() {
  tasksContainer.innerHTML = '';

  var list = tasks;
  if (currentFilter === 'active') list = tasks.filter(function(t) { return !t.completed; });
  if (currentFilter === 'done')   list = tasks.filter(function(t) { return  t.completed; });

  if (list.length === 0) {
    tasksContainer.innerHTML = '<p class="empty-state">No tasks here!</p>';
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var task = list[i];
    var item = document.createElement('div');
    item.className = task.completed ? 'task-item completed' : 'task-item';
    item.innerHTML =
      '<input type="checkbox" class="task-checkbox"' + (task.completed ? ' checked' : '') + ' onchange="toggleComplete(' + task.id + ')">' +
      '<span class="task-text">' + task.text + '</span>' +
      '<div class="task-actions">' +
        '<button class="task-edit"   onclick="editTask('   + task.id + ')">Edit</button>'   +
        '<button class="task-delete" onclick="deleteTask(' + task.id + ')">Delete</button>' +
      '</div>';
    tasksContainer.appendChild(item);
  }
}

filterAllBtn.addEventListener('click', function()    { 
  currentFilter = 'all';    
  updateFilter(); 
  renderTasks(); 
});
filterActiveBtn.addEventListener('click', function() { 
  currentFilter = 'active'; 
  updateFilter(); 
  renderTasks(); 
});
filterDoneBtn.addEventListener('click', function()   { 
  currentFilter = 'done';   
  updateFilter(); 
  renderTasks(); 
});

function updateFilter() {
  filterAllBtn.classList.remove('active');
  filterActiveBtn.classList.remove('active');
  filterDoneBtn.classList.remove('active');
  if (currentFilter === 'all')    filterAllBtn.classList.add('active');
  if (currentFilter === 'active') filterActiveBtn.classList.add('active');
  if (currentFilter === 'done')   filterDoneBtn.classList.add('active');
}

addTaskBtn.addEventListener('click', addTask);

loadTasks();
renderTasks();