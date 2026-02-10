import { Store } from './store.js';
import { Counter } from '../components/counter.js';
import { TodoList } from '../components/todoList.js';

export class Application {
  constructor() {
    this.store = new Store();
    this.store.load();

    this.renderHeader();

    this.root = document.createElement('div');
    this.root.className = 'app-root';
    document.body.append(this.root);

    this.counter = new Counter(this.store);
    document.querySelector('.header-container').after(this.counter.render());

    this.list = new TodoList(this.store);
    this.root.append(this.list.render());

    this.empty = document.createElement('div');
    this.empty.className = 'empty';
    const img = document.createElement('img');
    img.src = './smiley.png';
    img.className = 'emptyImg';
    const text = document.createElement('p');
    text.textContent = 'No Todos yet!';
    text.className = 'empty-message';
    this.empty.append(img, text);
    this.root.append(this.empty);

    this.unsubscribe = this.store.subscribe((data) => {
      this.empty.style.display = data.length === 0 ? '' : 'none';
    });
    this.empty.style.display = this.store.data.length === 0 ? '' : 'none';
  }

  destroy() {
    this.unsubscribe?.();
    this.counter?.dispose();
    this.list?.dispose();
  }

  renderHeader() {
    const header = document.createElement('div');
    header.className = 'header-container';

    const title = document.createElement('h2');
    title.textContent = 'Todo List';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Task';
    addBtn.className = 'add-task-btn';
    addBtn.addEventListener('click', () => this.openAddModal());

    header.append(title, addBtn);
    document.body.prepend(header);
  }

  openAddModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const input = document.createElement('input');
    input.placeholder = 'Enter task';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'modal-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Add';
    saveBtn.className = 'save-btn';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'modal-cancel-btn';

    btnContainer.append(saveBtn, cancelBtn);
    modal.append(input, btnContainer);
    overlay.append(modal);
    document.body.append(overlay);

    const add = () => {
      const value = input.value.trim();
      if (!value) return;
      this.store.add(value);
      overlay.remove();
    };

    saveBtn.addEventListener('click', add);
    cancelBtn.addEventListener('click', () => overlay.remove());
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') add();
    });
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    input.focus();
  }
}