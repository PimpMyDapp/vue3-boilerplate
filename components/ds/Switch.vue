<template>
  <div class="ds-switch" :class="{'_disabled': disabled}" @click.stop="handleClick">
    <div v-if="falseText" class="pp-false-text" :class="{'_active': !value}">
      {{ falseText }}
    </div>
    <div class="pp-switcher-container" :class="{'_active': value}">
      <div class="pp-ball" />
    </div>
    <div v-if="trueText" class="pp-true-text" :class="{'_active': value}">
      {{ trueText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Switcher",

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    falseText: {
      type: String,
      default: '',
    },
    trueText: {
      type: String,
      default: '',
    },
  },

  mounted() {
    this.$emit('onMountedStatus', this.value);
  },

  methods: {
    handleClick() {
      this.$emit('input', !this.value);
    },
  },
}
</script>
