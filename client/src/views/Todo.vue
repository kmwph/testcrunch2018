<template>
  <div class="todo">

    <div class="todo__header">
      <transition name="fade">
        <v-icon
          v-if="processed"
          x-large
          color="success"
          class="todo__header__icon"
        >
          cloud_done
        </v-icon>
      </transition>

      <h1>
        Todos
      </h1>
    </div>

    <todo
      v-if="loaded"
      @updated="onUpdate"
    />

    <v-progress-circular
      v-else-if="loading"
      color="primary"
      indeterminate
      class="todo__progress" />

    <empty-state
      v-else-if="error"
      title="Critical error"
      icon="error"
    />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import debounce from '../services/debounce';

export default {
  data() {
    return {
      processed: false,
    };
  },

  computed: {
    ...mapGetters({
      loading: 'loading',
      loaded: 'loaded',
      error: 'error',
      itemIsProcessing: 'itemIsProcessing',
    }),
  },

  mounted() {
    this.debouncedProcessedDone = debounce(() => {
      this.processed = false;
    }, 1500);

    this.fetchTodos()
      .catch(e => this.$alert.error(e.message));
  },

  methods: {
    ...mapActions({
      fetchTodos: 'fetchAll',
    }),

    onUpdate() {
      // Blink effect false => true
      this.processed = false;
      this.$nextTick(() => {
        this.processed = true;
      });
      this.debouncedProcessedDone();
    },
  },
};
</script>

<style scoped lang="scss">
.todo {
  padding-top: 10px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fefefe;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 8px 8px 10px 0px #ececec;

  &__header {
    position: relative;
    color: #e4e4e4;
    text-align: center;

    h1 {
      margin: 30px 0 20px 0;
    }

    &__icon {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__progress {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
