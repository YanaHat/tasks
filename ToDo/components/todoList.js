import { TodoItem } from './todoItem.js';

export class TodoList {
  constructor(data, onChange) {
    this.data = data;
    this.onChange = onChange;

    this.element = document.createElement('div');
    this.element.className = 'todo-list';
  }

  render() {
    this.element.innerHTML = '';

    this.data.forEach(todo => {
      const item = new TodoItem(todo, updated => {
        let newData = [...this.data];

        if (updated.delete) {
          newData = newData.filter(t => t !== todo);
        } else {
          newData = newData.map(t =>
            t === todo ? updated : t
          );
        }

        this.onChange(newData);
      });

      this.element.append(item.render());
    });

    return this.element;
  }
}
