<template>
  <div class="todo-container">

    <todo-create-input
      v-model="newTodoName"
      class="todo-container__input"
      @create="onCreate"
    />

    <template v-if="!animate">
      <empty-state
        v-if="noItem"
        title="You have nothing to do"
        icon="sentiment_very_satisfied"
      />

      <empty-state
        v-else-if="noFilteredItem"
        title="No item for such a filter"
        icon="search"
      />
    </template>

    <todo-list
      :todos="todos"
      class="todo-container__list"
      @patch="onPatch"
      @remove="onRemove"
      @reverse="onReverse"
      @retry="onRetry"
      @animate="onAnimate"
    />

    <todo-footer
      @filter="onFilter"
      @deleteCompleted="onRemoveCompleted"
    />

  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import { todoMutations } from '../store';

export default {
  name: 'Todo',

  data() {
    return {
      newTodoName: undefined,
      animate: false,
    };
  },

  computed: {
    ...mapState({
      allTodos: 'all',
    }),
    ...mapGetters({
      todos: 'filtered',
    }),
    noFilteredItem() {
      return this.todos.length === 0;
    },
    noItem() {
      return this.allTodos.length === 0;
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.setFilter(to.query.show);
      },
    },
  },

  methods: {
    ...mapActions({
      createTodo: 'create',
      patchTodo: 'patch',
      deleteTodo: 'delete',
      deleteCompeletedTodos: 'deleteCompleted',
      retry: 'retry',
      reverse: 'reverse',
    }),
    ...mapMutations({
      setFilter: todoMutations.setFilter,
      removeFromStore: todoMutations.delete,
    }),

    onCreate() {
      if (!this.newTodoName) {
        return;
      }

      this.createTodo({ name: this.newTodoName })
        .then(() => this.$emit('updated'))
        .catch(e => this.$alert.error(e.message));
      this.newTodoName = undefined;
    },

    onPatch(id, data) {
      return this.patchTodo({ id, data })
        .then(() => this.$emit('updated'))
        .catch(e => this.$alert.error(e.message));
    },

    onRemove(id) {
      return this.deleteTodo(id)
        .then(() => this.$emit('updated'))
        .catch(e => this.$alert.error(e.message));
    },
    onRemoveCompleted() {
      return this.deleteCompeletedTodos()
        .then(() => this.$emit('updated'))
        .catch(e => this.$alert.error(e.message));
    },
    onFilter(key) {
      this.$router.replace({ ...this.$route, query: { show: key } });
    },
    onAnimate(isAnimating) {
      this.animate = isAnimating;
    },
    onRetry(id) {
      this.retry(id)
        .then(() => this.$emit('updated'))
        .catch(e => this.$alert.error(e.message));
    },
    onReverse(id) {
      this.reverse(id)
        .catch(e => this.$alert.error(e.message));
    },
  },
};
</script>

<style scoped lang="scss">
.todo-container {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__input{
    margin: 0 20px;
  }

  &__list {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
