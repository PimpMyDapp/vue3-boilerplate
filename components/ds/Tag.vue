<template>
  <div
      class="ds-tag"
      :class="[getColorClass, {'_no-hover': noHover}]"
      :style="{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "Tag",

  props: {
    color: {
      type: String,
      default: '',
      validator: color => ['', 'purple', 'blue', 'orange', 'red', 'gray', 'green', 'uniswap'].includes(color),
    },
    noHover: {
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
  },

  computed: {
    getColorClass() {
      if (this.color) {
        return `_${this.color}`;
      }
      return '';
    },
  },
}
</script>
