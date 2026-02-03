export class TodoItem {
  constructor(todo, store) {
    this.todo = todo;
    this.store = store;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'todo-item';

    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.checked = this.todo.completed;

    this.titleEl = document.createElement('span');
    this.titleEl.textContent = this.todo.title;
    this.titleEl.classList.toggle('completed', this.todo.completed);

    this.editBtn = document.createElement('button');
    this.editBtn.textContent = 'Edit';
    this.editBtn.className = 'edit-btn';

    this.deleteBtn = document.createElement('button');
    this.deleteBtn.textContent = 'X';
    this.deleteBtn.className = 'delete-btn';

    this.onToggle = () => {
      this.store.update(this.todo.id, { completed: this.checkbox.checked });
    };
    this.onDelete = () => {
      this.store.remove(this.todo.id);
    };
    this.onEdit = () => this.openEditModal();
    this.onTitleDbl = () => this.openEditModal();

    this.checkbox.addEventListener('change', this.onToggle);
    this.deleteBtn.addEventListener('click', this.onDelete);
    this.editBtn.addEventListener('click', this.onEdit);
    this.titleEl.addEventListener('dblclick', this.onTitleDbl);

    this.element.append(this.checkbox, this.titleEl, this.editBtn, this.deleteBtn);
    return this.element;
  }

  openEditModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const input = document.createElement('input');
    input.value = this.todo.title;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'modal-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'modal-delete-btn';

    btnContainer.append(saveBtn, deleteBtn);
    modal.append(input, btnContainer);
    overlay.append(modal);
    document.body.append(overlay);

    const onSave = () => {
      const value = input.value.trim();
      if (!value) return;
      this.store.update(this.todo.id, { title: value });
      overlay.remove();
    };

    const onRemove = () => {
      this.store.remove(this.todo.id);
      overlay.remove();
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    saveBtn.addEventListener('click', onSave);
    deleteBtn.addEventListener('click', onRemove);
    overlay.addEventListener('click', onOverlayClick);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onSave();
    });

    input.focus();
  }

  dispose() {
    if (!this.element) return;
    this.checkbox?.removeEventListener('change', this.onToggle);
    this.deleteBtn?.removeEventListener('click', this.onDelete);
    this.editBtn?.removeEventListener('click', this.onEdit);
    this.titleEl?.removeEventListener('dblclick', this.onTitleDbl);
  }
}
