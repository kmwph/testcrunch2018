import Vue from 'vue';

class AlertManager {
  constructor() {
    this.lastId = 0;

    this.data = new Vue({
      data() {
        return {
          alerts: [],
        };
      },
    });
  }

  get alerts() {
    return this.data.alerts;
  }

  add(type, message) {
    this.alerts.push({
      id: this.lastId += 1,
      type,
      message,
    });
  }

  remove(id) {
    const index = this.alerts.findIndex(i => i.id === id);
    this.alerts.splice(index, 1);
  }

  clear() {
    this.alerts.splice(0, this.alerts.length);
  }

  success(message) {
    this.add('success', message);
  }

  error(message) {
    this.add('error', message);
  }

  info(message) {
    this.add('info', message);
  }

  warning(message) {
    this.add('warning', message);
  }
}

export default () => {
  Vue.prototype.$alert = new AlertManager();
};
