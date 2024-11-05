<template>
  <div class="pp-single-selector" v-click-outside="closeDropdown">
    <div class="dropdown-selected" :class="{'_passive': passive}" @click="toggleDropdown">
      <div class="dropdown-selected-zone">
        <div v-if="!selected.value">
          {{ placeholder }}
        </div>
        <div v-else class="selected-item">
          <img v-if="selected.icon" class="icon" :src="selected.icon">
          <span v-html="selected.text" />
        </div>
      </div>
      <pp-icon
          v-if="!passive"
          class="arrow"
          name="shevron-down-24"
          :class="{'_active': isOpen}"
      />
    </div>
    <div v-if="isOpen && !passive" class="dropdown-container" :style="freeDropdown ? 'width: auto; max-width: 100%;' : ''">
      <div class="dropdown-menu">
        <div
            class="dropdown-item"
            :class="{'_picked': option.value === selected.value}"
            v-for="option in options"
            :key="option.value"
            @click="handleChange(option)"
        >
          <img v-if="option.icon" class="icon" :src="option.icon">
          <span v-html="option.text"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'PPSingleSelector',
  directives: {
    ClickOutside,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Select option',
    },
    passive: {
      type: Boolean,
    },
    options: {
      type: Array,
      required: true,
    },
    defaultPicked: {
      type: String,
      default: '',
    },
    freeDropdown: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      isOpen: false,
      selected: {},
    };
  },

  watch: {
    defaultPicked: {
      handler() {
        this.handleDefault();
      },
      immediate: true,
    }
  },

  methods: {
    handleDefault() {
      if (this.defaultPicked && this.options.length) {
        const optionElement = this.options.find(option => option.value === this.defaultPicked);
        if (optionElement) {
          this.handleChange(optionElement)
        }
      } else if (this.selected.value && !this.defaultPicked) {
        this.selected = {};
      }
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    closeDropdown() {
      this.isOpen = false;
    },
    handleChange(option) {
      this.closeDropdown();
      if (this.selected.value === option.value) return;
      this.selected = option;
      this.$emit('change', this.selected);
    },
  },
};
</script>
