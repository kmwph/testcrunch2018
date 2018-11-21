<template>

  <v-btn
    :depressed="!active"
    small
    class="todo-footer__btn"
    @click="$emit('click')"
  >

    <slot />

  </v-btn>

</template>

<script>
export default {
  name: 'TodoFooterBtn',

  props: {
    active: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>

<style scoped lang="scss">
.todo-footer__btn {
  min-width: 0;
  margin: 0;
}
</style>
