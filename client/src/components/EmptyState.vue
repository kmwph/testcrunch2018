<template>

  <div class="empty-state">

    <v-icon
      v-if="icon"
      x-large
    >
      {{ icon }}
    </v-icon>

    <h3
      v-if="title"
    >
      {{ title }}
    </h3>

  </div>

</template>

<script>
export default {
  name: 'EmptyState',

  props: {
    icon: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
</style>
