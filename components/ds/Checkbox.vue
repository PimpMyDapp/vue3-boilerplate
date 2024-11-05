<template>
  <div class="ds-checkbox" @click="handlePick">
    <div class="box" :class="{'_active': isActuallyPicked}">
      <pp-icon v-if="isActuallyPicked" name="check-16" />
    </div>
    <template v-if="$slots.default">
      <slot />
    </template>
    <div v-else class="label" v-html="label" />
  </div>
</template>

<script>
export default {
  name: "Checkbox",

  props: {
    label: {
      type: String,
    },
    isPicked: {
      type: Boolean,
    },
  },

  data: () => ({
    isActuallyPicked: false,
  }),

  mounted() {
    this.isActuallyPicked = this.isPicked;
  },

  watch: {
    isPicked() {
      if (this.isPicked !== this.isActuallyPicked) {
        this.isActuallyPicked = this.isPicked;
      }
    },
  },

  methods: {
    handlePick() {
      this.isActuallyPicked = !this.isActuallyPicked;
      this.$emit('change', this.isActuallyPicked);
    }
  },
}
</script>
