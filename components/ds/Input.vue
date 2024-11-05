<template>
  <div
      class="ds-input"
      :class="{
        '_focused': focused,
        '_disabled': disabled,
        '_error': hasErrors,
        '_warning': hasWarnings
  }">
    <div v-if="label || labelSecondary" class="top-label-container">
      <label v-if="label" class="label-main" v-html="label" />
      <div v-if="labelSecondary" class="label-secondary" v-html="labelSecondary" />
    </div>
    <div class="input-container">
      <div v-if="$slots['pre-icon']" class="pre-icon">
        <slot name="pre-icon" />
      </div>
      <input
          ref="inputNative"
          :type="type"
          :placeholder="type === 'number' ? '0' : placeholder"
          :disabled="disabled"
          :value="value"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @click="selectOnClickHandler"
          @keyup="$emit('keyup', $event)"
      >
      <div v-if="$slots['after-icon']" class="after-icon">
        <slot name="after-icon" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Input",

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    label: {
      type: String,
      default: '',
    },
    labelSecondary: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasErrors: {
      type: Boolean,
      default: false,
    },
    hasWarnings: {
      type: Boolean,
      default: false,
    },
    selectOnClick: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      focused: false,
    }
  },

  methods: {
    selectOnClickHandler(e) {
      this.$emit('click', e);
      if (!this.selectOnClick) return;
      const input = this.$refs.inputNative;
      input.select();
      input.focus();
    },
    handleFocus(e) {
      this.focused = true;
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.focused = false;
      this.$emit('blur', e);
    },
    handleInput(e) {
      this.$emit('change', e.target.value);
      this.$emit('input', e);
    },
  },
}
</script>
