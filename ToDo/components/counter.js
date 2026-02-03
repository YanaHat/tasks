export class Counter {
  constructor(store) {
    this.store = store;

    this.element = document.createElement('div');
    this.element.className = 'counter-container';

    this.todoItem = this.createItem('TO DO');
    this.todoValue = this.todoItem.querySelector('.counter-value');

    this.doneItem = this.createItem('DONE', true);
    this.doneValue = this.doneItem.querySelector('.counter-value');

    this.element.append(this.todoItem, this.doneItem);
    
    this.unsubscribe = this.store.subscribe(() => this.render());
  }

  createItem(titleText, withDelete = false) {
    const item = document.createElement('div');
    item.className = 'counter-item';

    const title = document.createElement('span');
    title.className = 'counter-title';
    title.textContent = titleText;

    const value = document.createElement('span');
    value.className = 'counter-value';

    item.append(title, value);

    if (withDelete) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'counter-delete-btn';
      deleteBtn.textContent = 'X';

      this.onClearClick = () => this.store.clearCompleted();
      deleteBtn.addEventListener('click', this.onClearClick);

      this.deleteBtn = deleteBtn;
      item.append(deleteBtn);
    }

    return item;
  }

  
  render() {
    const data = this.store.data;
    const todo = data.filter(t => !t.completed).length;
    const done = data.filter(t => t.completed).length;
    this.todoValue.textContent = todo;
    this.doneValue.textContent = done;
    return this.element;
  }

  dispose() {
    this.unsubscribe?.();
    if (this.deleteBtn && this.onClearClick) {
      this.deleteBtn.removeEventListener('click', this.onClearClick);
    }
  }

}
