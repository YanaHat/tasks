import { TodoItem } from './todoItem.js';

export class TodoList {
  constructor(data, onUpdate) {
    this.data = data;
    this.onUpdate = onUpdate;
    this.element = document.createElement('div');
    this.element.className = 'todo-list';
  }

  render() {
    this.element.innerHTML = '';

    this.data.forEach(todo => {
      const item = new TodoItem(todo, updated => {
        if (updated.delete) {
          this.data = this.data.filter(t => t !== todo);
        }
        this.onUpdate(this.data);
        this.render();
      });
      this.element.appendChild(item.render());
    });

    return this.element;
  }
}
