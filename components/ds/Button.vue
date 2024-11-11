<template>
  <button
      class="ds-button"
      :tabindex="disabled || loading ? -1 : tabindex"
      :class="[
        {'_stroke': stroke},
        {'_disabled': disabled},
        {'_loading': loading},
        `_${color}`,
        ...(isSmall ? ['_small'] : []),
      ]"
  >
    <span class="triangle-top" :style="`border-color: transparent ${triangleColor} transparent transparent`" />
    <span class="triangle-bottom" :style="`border-color: transparent transparent ${triangleColor} transparent`" />
    <ds-pp-icon v-if="loading" class="loader" :name="isSmall ? 'loader-16' : 'loader-24'" />
    <slot v-else />
  </button>
</template>

<script>
/**
 * This component contains all button appearances you ever need
 */
export default {
  name: "Button",
  props: {
    triangleColor: {
      type: String,
      default: '#000'
    },
    // Set this flag if you want to disable button
    disabled: {
      type: Boolean,
      default: false,
    },
    // Set this flag if you want to enable load animation (also disables button)
    loading: {
      type: Boolean,
      default: false,
    },
    // Set this flag if you want to enable stroke button mode
    stroke: {
      type: Boolean,
      default: false,
    },
    // Set this string if you want to enable different button colors (now don't have any colors)
    color: {
      type: String,
      default: '',
      validator: color => ['', 'gray'].includes(color),
    },
    // emulate html tabindex property. Used to set navigation order by pressing TAB
    tabindex: {
      type: [Number, String],
      default: 0,
    },
    // small modification of a button
    isSmall: {
      type: Boolean,
      default: false,
    }
  },
}
</script>


<style lang="scss">
.ds-button {
  @include button-reset;
  @include get_typography(14);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  gap: 10px;
  color: $black;
  text-transform: uppercase;
  background-color: $green;
  transition: all .2s;

  .triangle-top {
    position: absolute;
    top: 0;
    right: 0;
    border-style: solid;
    border-width: 0 10px 10px 0;
    border-color: transparent $black transparent transparent;
  }

  .triangle-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    border-style: solid;
    border-width: 0 10px 10px 0;
    border-color: transparent transparent $black transparent;
  }

  &._small {
    @include get_typography(12);
    height: 32px;
    padding: 0 20px;
  }

  &:hover:not(._loading) {
    background-color: $green-700;
  }

  &:active:not(._loading) {
    background-color: $green-700;
    color: $black-500;
  }

  &._disabled {
    pointer-events: none;
    background-color: $black-700;
    color: $white-200;
  }

  &._loading {
    pointer-events: none;
  }

  &._gray {
    background-color: $black-600;
    color: $white;

    &:hover:not(._loading) {
      background-color: $black-700;
    }

    &:active:not(._loading) {
      background-color: $black-700;
      color: $white-500;
    }
  }

  .loader {
    animation: roll-anim .8s cubic-bezier(.29,.6,.68,.86) infinite;
  }
}
</style>
