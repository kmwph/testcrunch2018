import http from 'axios';

class ToDoApi {
  constructor() {
    this.urlPrefix = 'http://localhost:5000/api/v1';
  }

  async getAll() {
    const response = await http.get(`${this.urlPrefix}/todos`);
    return response.data.data;
  }

  async create(todo) {
    const response = await http.post(`${this.urlPrefix}/todos`, todo);
    return response.data.data;
  }

  delete(id) {
    return http.delete(`${this.urlPrefix}/todos/${id}`);
  }

  patch(id, data) {
    return http.patch(`${this.urlPrefix}/todos/${id}`, data);
  }
}

export default new ToDoApi();
