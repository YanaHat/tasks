export class Counter {
  constructor(data, onClearDone) {
    this.data = data;
    this.onClearDone = onClearDone;

    this.element = document.createElement('div');
    this.element.className = 'counter-container';

    this.todoItem = this.createItem('TO DO');
    this.todoValue = this.todoItem.querySelector('.counter-value');

    this.doneItem = this.createItem('DONE', true);
    this.doneValue = this.doneItem.querySelector('.counter-value');

    this.element.append(this.todoItem, this.doneItem);

    this.render();
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
      deleteBtn.textContent = '✕';

      deleteBtn.addEventListener('click', () => {
        this.onClearDone();
      });

      item.append(deleteBtn);
    }

    return item;
  }

  update(data) {
    this.data = data;
    this.render();
  }

  render() {
    const todo = this.data.filter(t => !t.completed).length;
    const done = this.data.filter(t => t.completed).length;

    this.todoValue.textContent = todo;
    this.doneValue.textContent = done;

    return this.element;
  }
}
