export class TodoItem {
  constructor(data, onUpdate) {
    this.data = data;
    this.onUpdate = onUpdate;
  }

  render() {
    const item = document.createElement('div');
    item.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.data.completed;

    const title = document.createElement('span');
    title.textContent = this.data.title;
    title.classList.toggle('completed', this.data.completed);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';

    checkbox.addEventListener('change', () => {
      this.onUpdate({
        ...this.data,
        completed: checkbox.checked
      });
    });

    deleteBtn.addEventListener('click', () => {
      this.onUpdate({ ...this.data, delete: true });
    });

    editBtn.addEventListener('click', () => this.openEditModal());
    title.addEventListener('dblclick', () => this.openEditModal());

    item.append(checkbox, title, editBtn, deleteBtn);
    return item;
  }

  openEditModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const input = document.createElement('input');
    input.value = this.data.title;

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

    saveBtn.addEventListener('click', () => {
      const value = input.value.trim();
      if (!value) return;
      this.onUpdate({ ...this.data, title: value });
      overlay.remove();
    });

    deleteBtn.addEventListener('click', () => {
      this.onUpdate({ ...this.data, delete: true });
      overlay.remove();
    });

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    input.focus();
  }
}
