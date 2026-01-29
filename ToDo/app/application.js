import { TodoList } from '../components/todoList.js';
import { Counter } from '../components/counter.js';

export class Application {
  #data = [];

  constructor() {
    this.loadData();
    this.renderHeader();
    this.counter = new Counter(this.#data, () => {
      this.setData(this.#data.filter(t => !t.completed));
    });

    document
      .querySelector('.header-container')
      .after(this.counter.render());

    this.render();
  }

  loadData() {
    const raw = localStorage.getItem('todos');
    this.#data = raw ? JSON.parse(raw) : [];
  }

  saveData() {
    localStorage.setItem('todos', JSON.stringify(this.#data));
  }

  setData(newData) {
    this.#data = newData;
    this.saveData();
    this.counter.update(this.#data);
    this.render();
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

  render() {
    document.querySelector('.todo-list')?.remove();
    document.querySelector('.empty')?.remove();

    if (this.#data.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';

      const img = document.createElement('img');
      img.src = './smiley.png';
      img.className = 'emptyImg';

      const text = document.createElement('p');
      text.textContent = 'No Todos yet!';
      text.className = 'empty-message';

      empty.append(img, text);
      document.body.append(empty);
    } else {
      const list = new TodoList(this.#data, data => {
        this.setData(data);
      });

      document.body.append(list.render());
    }
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
      this.setData([
        ...this.#data,
        { title: value, completed: false }
      ]);
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

