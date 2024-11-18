<template>
  <div class="ds-single-selector" :class="{'_disabled': disabled}">
    <div v-if="label || subLabel" class="labels text-sm">
      <div v-if="label" class="label">
        {{ label }}
        <!--        <ds-hint v-if="hint" :text="hint" />-->
      </div>
      <div v-if="subLabel" class="sub-label">{{ subLabel }}</div>
    </div>
    <OnClickOutside @trigger="closeDropdown">
      <div class="dropdown-selected" :class="{'_passive': passive}" @click="toggleDropdown">
        <div class="dropdown-selected-zone text-md">
          <div v-if="!selected.value" class="placeholder">
            {{ placeholder }}
          </div>
          <div v-else class="selected-item">
            <img v-if="selected.icon" class="icon" :src="selected.icon">
            <span v-html="selected.text" />
          </div>
        </div>
        <ds-icon
            v-if="!passive"
            class="arrow"
            name="shevron-down-24"
            :class="{'_active': isOpen}"
        />
      </div>
      <div v-if="isOpen && !passive" class="dropdown-container text-md" :style="freeDropdown ? 'width: auto; max-width: 100%;' : ''">
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
            <ds-icon v-if="option.value === selected.value" class="check" name="check-16" />
          </div>
        </div>
      </div>
    </OnClickOutside>
  </div>
</template>

<script>
import { OnClickOutside } from '@vueuse/components'

export default {
  name: 'PPSingleSelector',
  components: {
    OnClickOutside
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    subLabel: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
    },
    options: {
      handler() {
        this.handleDefault();
      },
    }
  },

  methods: {
    handleDefault() {
      if (this.defaultPicked && this.options.length) {
        const optionElement = this.options.find(option => option.value === this.defaultPicked);
        if (optionElement) {
          this.handleChange(optionElement, true)
        }
      } else if (this.selected.value && !this.defaultPicked) {
        this.selected = {};
      }
    },
    toggleDropdown() {
      if (!this.disabled) {
        this.isOpen = !this.isOpen;
      }
    },
    closeDropdown() {
      this.isOpen = false;
    },
    handleChange(option, isDefaultCall = false) {
      this.closeDropdown();
      if (this.selected.value === option.value) return;
      this.selected = option;
      if (!isDefaultCall) this.$emit('change', this.selected);
    },
  },
};
</script>

<style lang="scss" scoped>
.ds-single-selector {
  z-index: 10;
  position: relative;
  display: inline-block;
  color: white;

  .labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .sub-label {
      color: $white-500;
    }
  }

  &._disabled {
    .labels {
      .label,
      .sub-label {
        color: $white-300;
      }
    }

    .dropdown-selected {
      cursor: default;
      border: 1px solid $black-700 !important;
      background: $black !important;
      color: $white-300 !important;

      .arrow {
        color: $white-300 !important;
      }

      img {
        opacity: .5;
      }
    }

    .selected-item {
      color: $white-300 !important;
    }
  }
}

.dropdown-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  border: 1px solid $black-700;
  background-color: $black-900;
  transition: border .2s;
  cursor: pointer;

  &._passive {
    padding-right: 16px;
  }

  .arrow {
    margin-left: auto;
    color: $white-500;
    transition: transform .2s;

    &._active {
      transform: rotate(180deg);
    }
  }

  &:hover {
    border-color: $black-500;
  }
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 16px;
    height: 16px;
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  padding: 8px 0;
  background-color: $black;
  border: 1px solid $black-700;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover:not(._picked) {
    background-color: $black-700;
    cursor: pointer;
  }

  .check {
    margin-left: auto;
    color: $white-500;
    margin-right: 2px;
  }
}
</style>
