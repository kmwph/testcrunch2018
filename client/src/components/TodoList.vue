<template>

  <div>

    <transition-group
      name="slide-fade"
      @before-enter="$emit('animate', true)"
      @after-leave="$emit('animate', false)"
    >

      <todo-item
        v-for="todo of todosData"
        :key="todo.__temporaryId || todo.id"
        :value="todo"
        :disabled="todo.__state === $options.modelStates.processing
        || todo.__state === $options.modelStates.error"
        :progress="todo.__state === $options.modelStates.processing"
        @patch="(data) => onPatch(todo.id, data)"
        @remove="onRemove(todo.id)"
      >

        <template
          v-if="todo.__state === $options.modelStates.error"
          slot="actions"
        >
          <v-btn
            v-if="!todo.__retry"
            small
            @click="onRetry(todo.id)"
          >
            Retry action
          </v-btn>

          <v-btn
            v-if="!todo.__reverse"
            small
            @click="onReverse(todo.id)"
          >
            Cancel
          </v-btn>

        </template>

      </todo-item>

    </transition-group>

  </div>

</template>

<script>
import { modelStates } from '../store';

export default {
  name: 'TodoList',
  modelStates,

  props: {
    todos: {
      type: Array,
      default: () => ([]),
    },
  },

  data() {
    return {
      todosData: [],
    };
  },

  watch: {
    todos: {
      immediate: true,
      deep: true,
      handler(to) {
        this.todosData = JSON.parse(JSON.stringify(to));
      },
    },
  },

  methods: {
    onPatch(id, data) {
      this.$emit('patch', id, data);
    },
    onRemove(data) {
      this.$emit('remove', data);
    },
    onRetry(id) {
      this.$emit('retry', id);
    },
    onReverse(id) {
      this.$emit('reverse', id);
    },
  },
};
</script>

<style scoped lang="scss">
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .2s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>
