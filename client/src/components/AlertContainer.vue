<template>
  <div
    class="alert-container"
  >

    <div class="alert-container__alerts">
      <transition-group name="slide-fade">
        <v-alert
          v-for="alert of alerts"
          :key="alert.id"
          :value="true"
          :type="alert.type"
          dismissible
          class="alert-container__alerts__alert"
          data-cy="alert"
          @input="$alert.remove(alert.id)"
        >
          {{ alert.message }}
        </v-alert>
      </transition-group>
    </div>

    <div class="alert-container__foot">
      <v-btn
        v-if="alerts.length > 1"
        flat
        small
        @click="$alert.clear()"
      >
        Clear all
      </v-btn>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AlertContainer',

  computed: {
    alerts() {
      return this.$alert.alerts;
    },
  },
};
</script>

<style scoped lang="scss">
.alert-container {
  &__alerts {
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;

    &__alert {
      word-break: break-word;
    }
  }

  &__foot {
    text-align: right;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
