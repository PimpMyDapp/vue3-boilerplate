<template>
  <div class="collapse-item">
    <div class="header" :class="{'_header-active': isActive}" @click="headerClickHandler">
      <slot name="header" />
    </div>
    <div
        class="body"
        :class="{'_active': isActive}"
        :style="`max-height:${height}`"
    >
      <div ref="content" class="grow-container">
        <template v-if="useShow">
          <div class="v-show-keeper" v-show="isActive">
            <slot name="body" />
          </div>
        </template>
        <template v-else>
          <slot v-if="isActive" name="body" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @desc That component helps to render a collapse element
 * @vue-prop id { String } - unique id for a collapse element. If you use Boolean as opened value, it's not required
 * @vue-prop opened { String, Array } - Active element name or array of active elements (array<string>)
 * @vue-data height { String } - Secondary value for an animation. Can't be changed to computed, because it won't be reactive
 * @vue-computed isActive { Boolean } - calculating if collapse should be opened
 */
export default {
  name: "Collapse",

  props: {
    id: {
      type: [String, Number],
      default: '',
    },
    opened: {
      type: [String, Number, Array, Boolean],
      default: '',
    },
    useShow: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    height: '0px',
  }),

  created() {
    if (this.isActive) {
      this.height = 'unset';
    }
  },

  computed: {
    isActive() {
      if (Array.isArray(this.opened)) {
        return this.opened.includes(this.id);
      } else if (this.opened === true || this.opened === false) {
        return this.opened;
      }
      return this.opened === this.id;
    },
  },

  methods: {
    /**
     * Collapse toggler
     */
    headerClickHandler() {
      if (Array.isArray(this.opened)) { // incase opened element is array
        if (this.opened.includes(this.id)) {
          this.$emit('closeItem', this.id);
        } else {
          this.$emit('openItem', this.id);
        }
      } else if (this.opened === true || this.opened === false) {
        this.$emit('onClick', !this.opened);
      } else { // incase opened element is simple string
        if (this.id === this.opened) {
          this.$emit('onClick', '');
        } else {
          this.$emit('onClick', this.id);
        }
      }
      this.calcHeight();
    },

    /**
     * Calculating max height for a smooth open animation
     * @return {Promise<void>}
     */
    async calcHeight() {
      await this.$nextTick();
      if (this.isActive && this.$refs.content) {
        // opening moment
        this.height = this.$refs.content.scrollHeight + "px";
        // We should drop max height after a 200ms in case body height will change on opened collapse
        setTimeout(() => {
          this.height = 'unset'
        }, 200)
      } else {
        // closing moment. Closing animation only works with useShow prop
        this.height = this.$refs.content.scrollHeight + "px";
        setTimeout(() => {
          this.height = '0px'
        }, 0)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.collapse-item {
  padding: 24px;
  color: $white;
  border: 1px solid $black-700;
}

.header {
  position: relative;
  cursor: pointer;

  &::before {
    position: absolute;
    top: -24px;
    left: -24px;
    content: "";
    width: 100%;
    height: calc(100% + 48px);
  }
}

.body {
  transition: all .3s ease-in-out;
  overflow: hidden;
}

.v-show-keeper {
  padding-top: 24px;
}
</style>
