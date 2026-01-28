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
        if (this.data.completed) title.classList.add('completed');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';

        // События
        checkbox.addEventListener('change', () => {
            this.data.completed = checkbox.checked;
            title.classList.toggle('completed', checkbox.checked);
            this.onUpdate(this.data);
        });

        deleteBtn.addEventListener('click', () => {
            this.onUpdate({ ...this.data, delete: true });
        });

        editBtn.addEventListener('click', () => {
            this.openEditModal();
        });

        title.addEventListener('dblclick', () => {
            this.openEditModal();
        });

        item.append(checkbox, title, editBtn, deleteBtn);
        return item;
    }

    openEditModal() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'modal';

        const editTitle = document.createElement('h3');
        editTitle.textContent = 'Edit task';
        editTitle.className = 'editTitle';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.data.title;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'save-btn';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'modal-delete-btn';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';
        buttonsContainer.append(saveBtn, deleteBtn);

        modal.append(editTitle, input, buttonsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // События
        const saveTask = () => {
            const newValue = input.value.trim();
            if (!newValue) return;
            this.data.title = newValue;
            this.onUpdate(this.data);
            overlay.remove();
        };

        saveBtn.addEventListener('click', saveTask);

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') saveTask(); 
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
