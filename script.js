document.addEventListener('DOMContentLoaded', () => {
  const dashboard = document.getElementById('dashboard');
  const taskbarItems = document.getElementById('taskbar-items');

  // --- 1. LÓGICA DE ARRASTAR E SOLTAR (DRAG & DROP) ---
  let draggedCard = null;

  const widgets = document.querySelectorAll('.widget');

  widgets.forEach(widget => {
    widget.addEventListener('dragstart', (e) => {
      draggedCard = widget;
      widget.classList.add('dragging');
    });

    widget.addEventListener('dragend', () => {
      widget.classList.remove('dragging');
      draggedCard = null;
    });
  });

  dashboard.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(dashboard, e.clientY);
    if (draggedCard) {
      if (afterElement == null) {
        dashboard.appendChild(draggedCard);
      } else {
        dashboard.insertBefore(draggedCard, afterElement);
      }
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // --- 2. LÓGICA DA BARRA DE TAREFAS / MINIMIZAR WIDGETS ---
  window.togglePin = function(widgetId) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;

    widget.classList.add('hidden-widget');
    createTaskbarChip(widgetId);
  };

  function createTaskbarChip(widgetId) {
    const widget = document.getElementById(widgetId);
    const titleText = widget.querySelector('.drag-handle').innerText.replace('⋮⋮ ', '');

    // Evita duplicados
    if (document.getElementById(`chip-${widgetId}`)) return;

    const chip = document.createElement('div');
    chip.className = 'taskbar-chip';
    chip.id = `chip-${widgetId}`;
    chip.innerHTML = `<span>${titleText}</span> ➕`;

    chip.addEventListener('click', () => {
      widget.classList.remove('hidden-widget');
      chip.remove();
    });

    taskbarItems.appendChild(chip);
  }

  // --- 3. ADICIONAR TAREFAS RÁPIDAS ---
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

  // --- 4. PERSISTÊNCIA DAS NOTAS ---
  const notesTextarea = document.getElementById('quick-notes');
  if (notesTextarea) {
    const savedNotes = localStorage.getItem('centralize_notes');
    if (savedNotes) notesTextarea.value = savedNotes;

    notesTextarea.addEventListener('input', () => {
      localStorage.setItem('centralize_notes', notesTextarea.value);
    });
  }
});