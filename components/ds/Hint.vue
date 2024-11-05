<template>
  <div class="ds-hint" :key="`${text}`" @click="preventPropaganda">
    <popper hover :placement="placement">
      <template v-if="$slots.default">
        <div class="slot-content">
          <slot />
        </div>
      </template>
      <template v-else>
          <span class="hint-default-bubble">
            <ds-icon name="help-24" />
          </span>
      </template>

      <template #content>
        <span v-html="text" />
      </template>
    </popper>
  </div>
</template>

<script>
/**
 * A hint component with wide features
 *
 * @vue-props placement - Which side should bubble appear. Only top and bottom (for now)
 * @vue-props showArrow - Should show arrow that's point on a bubble source
 * @vue-props localeSrc - If your text is on locale file, use this prop to send a link
 * @vue-props text - If is plain text, use that prop
 */
export default {
  name: 'Hint',
  props: {
    placement: {
      type: String,
      default: 'top',
      validator: prop => ['', 'top', 'bottom', 'left', 'right'].includes(prop),
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
    },
  },

  methods: {
    preventPropaganda(e) {
      e.stopPropagation();
    }
  },
}
</script>

<style lang="scss" scoped>
:deep(.popper) {
  @include get_typography(12);
  background: $black-700;
  padding: 8px 16px;
  color: #fff !important;
  max-width: 288px;
  text-align: center;
  text-transform: uppercase;
  box-shadow: 0 2px 0 0 rgba(17, 17, 17, 0.50);
  border: 1px solid $black-500;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  background: #2e2e2e;
}
</style>
