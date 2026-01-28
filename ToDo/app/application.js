import { TodoList } from '../components/todoList.js';
import { Counter } from '../components/counter.js';

export class Application {
  #data = [];

  constructor() {
    this.initialize();
  }

  initialize() {
    this.loadData();
    this.render();
    this.setupAddTaskButton();
    this.counter = new Counter(this.#data, () => {
      this.#data = this.#data.filter(t => !t.completed);
      this.saveData();
      this.counter.update(this.#data);
      this.render();
    });

    const header = document.querySelector('.header-container');
    header.after(this.counter.render());
    this.render();
  }

  loadData() {
    const raw = localStorage.getItem('todos');
    this.#data = raw ? JSON.parse(raw) : [];
  }

  saveData() {
    localStorage.setItem('todos', JSON.stringify(this.#data));
  }

  render() {
    const oldList = document.querySelector('.todo-list');
    const oldEmpty = document.querySelector('.empty');
    if (oldList) oldList.remove();
    if (oldEmpty) oldEmpty.remove();

    if (this.#data.length === 0) {
      const emptyImg = document.createElement('img');
      emptyImg.src = './smiley.png';
      emptyImg.alt = 'Cute cat';
      emptyImg.className = 'emptyImg';
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No Todos yet!';
      emptyMsg.className = 'empty-message';
      const container = document.createElement('div');
      container.className = 'empty'
      container.appendChild(emptyImg);
      container.appendChild(emptyMsg);
      document.body.appendChild(container);
    } else {
      const list = new TodoList(this.#data, updated => {
        this.#data = updated;
        this.saveData();
        this.counter.update(this.#data);
        this.render();
      });
      document.body.appendChild(list.render());
    } 
  }

  setupAddTaskButton() {
    const header = document.createElement('div');
    header.className = 'header-container';

    const titleText = document.createElement('h2');
    titleText.textContent = 'Todo List';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Task';
    addBtn.className = 'add-task-btn';

    addBtn.addEventListener('click', () => this.openAddModal());

    header.append(titleText, addBtn);
    document.body.prepend(header);
  }

  openAddModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const addTitle = document.createElement('h3');
    addTitle.className = 'addTitle';
    addTitle.textContent = 'Add task';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter new task';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Add';
    saveBtn.className = 'save-btn';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'modal-cancel-btn';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';
    buttonsContainer.append(saveBtn, cancelBtn);

    modal.append(addTitle, input, buttonsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // События
    saveBtn.addEventListener('click', () => addTask());

    const addTask = () => {
      const value = input.value.trim();
      if (!value) return;
      this.#data.push({ title: value, completed: false });
      this.saveData();
      this.render();
      overlay.remove();
    };

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') addTask(); 
    });

    cancelBtn.addEventListener('click', () => overlay.remove());

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    input.focus();
  }
}
