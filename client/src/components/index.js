import Todo from './Todo';
import TodoItem from './TodoItem';
import TodoList from './TodoList';
import TodoCreateInput from './TodoCreateInput';
import TodoFooter from './TodoFooter';
import TodoFooterBtn from './TodoFooterBtn';
import EmptyState from './EmptyState';
import AlertContainer from './AlertContainer';

export default (Vue) => {
  Vue.component(Todo.name, Todo);
  Vue.component(TodoItem.name, TodoItem);
  Vue.component(TodoList.name, TodoList);
  Vue.component(TodoCreateInput.name, TodoCreateInput);
  Vue.component(TodoFooter.name, TodoFooter);
  Vue.component(TodoFooterBtn.name, TodoFooterBtn);
  Vue.component(EmptyState.name, EmptyState);
  Vue.component(AlertContainer.name, AlertContainer);
};
