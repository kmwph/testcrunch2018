<template>

  <div
    :class="{
      'todo-item--finished': value.finished,
      'todo-item--disabled': disabled,
    }"
    :data-cy-name="value.name"
    data-cy="todo-item"
    class="todo-item"
  >

    <div
      class="todo-item__controls"
    >

      <v-checkbox
        v-model="value.finished"
        readonly
        class="todo-item__controls__finish"
        @click.native.prevent="toggleStatus"
      />

      <div class="todo-item__controls__name">
        <v-text-field
          v-if="focused"
          ref="inputName"
          v-model="value.name"
          @keypress.enter="debouncedUpdateName"
          @blur="debouncedUpdateName"
        />

        <span
          v-else
          class="todo-item__controls__name__placeholder"
          data-cy="todo-item__name"
          @click="focus"
        >
          {{ value.name }}
        </span>

      </div>

      <v-icon
        v-if="!focused && !disabled"
        class="todo-item__controls__remove"
        @click="remove"
      >
        delete_outline
      </v-icon>

      <div
        v-if="$slots.actions"
        class="todo-item__controls__slot"
      >
        <slot name="actions" />
      </div>

    </div>

    <v-progress-linear
      v-if="progress"
      height="2"
      indeterminate
      class="todo-item__progress"
    />

  </div>

</template>

<script>
import debounce from '../services/debounce';

export default {
  name: 'TodoItem',

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    progress: {
      type: Boolean,
      default: () => false,
    },
  },

  data() {
    return {
      originalName: undefined,
      focused: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(to) {
        this.originalName = to.name;
      },
    },
  },

  mounted() {
    const debouncedFn = debounce(this.updateName, 10);
    this.debouncedUpdateName = () => {
      this.blur();
      debouncedFn();
    };
  },

  methods: {
    focus() {
      if (this.focused) {
        return;
      }
      this.focused = true;
      this.$nextTick(() => this.$refs.inputName.focus());
    },
    blur() {
      if (!this.focused) {
        return;
      }
      this.$refs.inputName.blur();
      this.focused = false;
    },
    remove() {
      if (this.disabled) {
        return;
      }
      this.$emit('remove');
    },
    toggleStatus() {
      if (this.disabled) {
        return;
      }
      this.$emit('patch', { finished: !this.value.finished });
    },
    updateName() {
      if (this.disabled) {
        return;
      }

      if (this.originalName === this.value.name) {
        return;
      }
      this.$emit('patch', { name: this.value.name });
    },
  },
};
</script>

<style scoped lang="scss">
.todo-item {
  position: relative;
  transition: all 0.3s;

  &__progress {
    margin: 0;
    position: absolute;
    bottom: -1px;
    animation: fadeInFromNone 0.5s ease-out;
  }

  &__controls {
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;

    &__finish {
      flex: 0;
    }

    &__name {
      display: flex;
      flex: 1;
      align-items: center;
      word-break: break-all;

      &__placeholder {
        display: flex;
        flex: 1;
        cursor: pointer;
      }
    }

    &__slot {
      pointer-events: all;
    }

    &__remove {
      display: none;

      &:hover {
        color: red;
      }
    }

    &:hover &__remove {
      display: initial;
    }
  }

  &--finished {
    .todo-item__name__placeholder {
      text-decoration: line-through;
      color: #999;
    }
  }

  &--disabled {
    background: #eee;
    cursor: not-allowed;

    .todo-item__controls {
      pointer-events: none;
    }
  }
}

@keyframes fadeInFromNone {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
