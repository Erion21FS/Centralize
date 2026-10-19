document.addEventListener('DOMContentLoaded', () => {
  // Troca de Temas (Acessibilidade)
  const themeSelect = document.getElementById('theme-select');
  themeSelect.addEventListener('change', (e) => {
    document.body.className = e.target.value;
  });

  // Ocultar / Minimizar Widgets na Barra
  const taskbarItems = document.getElementById('taskbar-items');

  window.togglePin = function(widgetId) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;

    widget.classList.add('hidden-widget');
    createTaskbarChip(widgetId);
  };

  function createTaskbarChip(widgetId) {
    const widget = document.getElementById(widgetId);
    const titleText = widget.querySelector('.drag-handle').innerText.replace('⋮⋮ ', '');

    if (document.getElementById(`chip-${widgetId}`)) return;

    const chip = document.createElement('div');
    chip.className = 'taskbar-chip';
    chip.id = `chip-${widgetId}`;
    chip.innerHTML = `${titleText} ➕`;

    chip.addEventListener('click', () => {
      widget.classList.remove('hidden-widget');
      chip.remove();
    });

    taskbarItems.appendChild(chip);
  }

  // Lista de Tarefas
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('new-task-input');
  const taskList = document.getElementById('task-list');

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text !== '') {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> ${text}`;
        taskList.appendChild(li);
        taskInput.value = '';
      }
    });
  }
});
