<template>
  <div class="pp-multiple-selector" v-click-outside="closeDropdown">
    <div class="dropdown-selected" :class="{'_active': isOpen}" @click="toggleDropdown">
      <div class="dropdown-selected-zone">
        <div v-if="selected.length === 0">
          {{ placeholder }}
        </div>
        <div v-else class="selected-item">
          {{ selected.length }}
          &nbsp;
          <span v-if="selected.length === 1">{{ singlePickText }}</span>
          <span v-if="selected.length > 1">{{ multiPickText }}</span>
        </div>
      </div>
      <pp-icon
          class="arrow"
          name="shevron-down-24"
          :class="{'_active': isOpen}"
      />
    </div>
    <div v-if="isOpen" class="dropdown-container">
      <div class="dropdown-menu">
        <div
            class="dropdown-item"
            v-for="option in options"
            :key="option.value"
        >
          <PpCheckbox
              :is-picked="selected.includes(option)"
              @change="handleChange(option, $event)"
          >
            <pp-icon v-if="option.icon" class="checkbox-container" :path="option.icon" />
            <div v-else class="checkbox-filler" />
            {{ option.text }}
          </PpCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import PpCheckbox from "../Checkbox.vue";

export default {
  name: 'PPMultiSelector',
  components: {PpCheckbox},
  data() {
    return {
      isOpen: false,
      selected: [],
    };
  },
  directives: {
    ClickOutside,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Select item',
    },
    singlePickText: {
      type: String,
      default: 'item',
    },
    multiPickText: {
      type: String,
      default: 'items',
    },
    options: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    closeDropdown() {
      this.isOpen = false;
    },
    handleChange(el, status) {
      if (status) {
        this.selected.push(el);
      } else {
        this.selected = this.selected.filter(item => item.value !== el.value);
      }
      this.$emit('change', this.selected);
    },
  },
};
</script>
