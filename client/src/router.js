import Vue from 'vue';
import Router from 'vue-router';
import Todo from './views/Todo';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: { name: 'todo' },
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo,
    },
  ],
});
