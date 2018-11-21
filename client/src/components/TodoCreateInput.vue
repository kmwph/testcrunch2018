<template>

  <div class="todo-create-input">
    <v-text-field
      v-model="valueData"
      label="What needs to be done?"
      solo
      data-cy="create-input"
      @keypress.enter="create"
    >

      <v-icon
        v-if="valueData"
        slot="append"
        class="todo-create-input__add"
        @click="create"
      >
        add_circle
      </v-icon>

    </v-text-field>

  </div>

</template>

<script>
export default {
  name: 'TodoCreateInput',

  props: {
    value: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      valueData: undefined,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(to) {
        this.valueData = to;
      },
    },
    valueData(to) {
      this.$emit('input', to);
    },
  },

  methods: {
    create() {
      this.$emit('create', this.valueData);
    },
  },
};
</script>


<style scoped lang="scss">
.todo-create-input {

  &__add:hover {
    color: green;
  }
}
</style>
