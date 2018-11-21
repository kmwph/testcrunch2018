<template>

  <div class="todo-footer">

    <div
      class="todo-footer__group"
    >
      {{ active.length }} item{{ active.length == 1 ? '' : 's' }} left
    </div>

    <div class="todo-footer__group todo-footer__group--center">
      <todo-footer-btn
        v-for="filter of filters"
        :key="filter.name"
        :active="filter.active"
        @click="setFilter(filter.name)"
      >
        {{ filter.name }}
      </todo-footer-btn>
    </div>

    <div class="todo-footer__group  todo-footer__group--right">
      <v-btn
        v-if="completed.length > 0"
        :disabled="itemIsProcessing || completedError"
        flat
        color="error"
        @click="deleteCompleted"
      >
        Delete completed
      </v-btn>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import { todoFilters } from '../constants';
import { modelStates } from '../store';

export default {
  name: 'TodoFooter',

  computed: {
    ...mapGetters({
      active: 'active',
      completed: 'completed',
      itemIsProcessing: 'itemIsProcessing',
    }),
    activeFilter() {
      return this.$route.query.show
        ? this.$route.query.show
        : todoFilters.all;
    },
    filters() {
      return Object.values(todoFilters)
        .map(i => ({
          name: i,
          active: this.activeFilter === i,
        }));
    },
    completedError() {
      return this.completed.some(i => i.__state === modelStates.error);
    },
  },

  methods: {
    setFilter(key) {
      this.$emit('filter', key);
    },
    deleteCompleted() {
      this.$emit('deleteCompleted');
    },
  },
};
</script>

<style scoped lang="scss">
.todo-footer {
  min-height: 50px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px -15px 20px 0px #ffffffd1;
  z-index: 9;

  &__group {
    display: flex;
    flex: 1;

    &--center {
      justify-content: center;
    }

    &--right {
      justify-content: flex-end;
    }
  }
}
</style>
