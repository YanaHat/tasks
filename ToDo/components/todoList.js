import { TodoItem } from './todoItem.js';

export class TodoList {
  constructor(store) {
    this.store = store;
    this.element = document.createElement('div');
    this.element.className = 'todo-list';

    this.items = [];

    this.unsubscribe = this.store.subscribe(() => this.render());
  }

  render() {
    this.items.forEach(i => i.dispose());
    this.items = [];

    this.element.innerHTML = '';

    this.store.data.forEach(todo => {
      const item = new TodoItem(todo, this.store);
      this.items.push(item);
      this.element.append(item.render());
    });

    return this.element;
  }

  dispose() {
    this.unsubscribe?.();
    this.items.forEach(i => i.dispose());
    this.items = [];
  }
}