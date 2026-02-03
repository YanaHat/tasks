export class Store {
  constructor() {
    this.data = [];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }

  notify() {
    localStorage.setItem('todos', JSON.stringify(this.data));
    this.listeners.forEach(fn => fn(this.data));
  }

  generateId() {
    return Date.now() + Math.random().toString(16).slice(2);
  }

  load() {
    const raw = localStorage.getItem('todos');
    this.data = raw ? JSON.parse(raw) : [];

    this.data = this.data.map(t => ({
      id: t.id || this.generateId(),
      title: t.title,
      completed: !!t.completed
    }));

    this.notify();
  }

  add(title) {
    this.data.push({
      id: this.generateId(),
      title,
      completed: false
    });
    this.notify();
  }

  update(id, changes) {
    const task = this.data.find(t => t.id === id);
    if (!task) return;

    Object.assign(task, changes);
    this.notify();
  }

  remove(id) {
    this.data = this.data.filter(t => t.id !== id);
    this.notify();
  }

  clearCompleted() {
    this.data = this.data.filter(t => !t.completed);
    this.notify();
  }
}