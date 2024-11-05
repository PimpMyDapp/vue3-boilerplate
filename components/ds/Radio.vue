<template>
  <div class="pp-radio">
    <div class="radio-list">
      <div
          v-for="(option, i) in options"
          :key="i"
          class="radio-item"
          :class="{'_not-active': pickedButtonIndex !== i, '_active': pickedButtonIndex === i}"
          @click="pickRadio(i)"
      >
        <div class="clicker" />
        <div class="label" v-html="option.label" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
    },
    defaultPickedIndex: {
      type: Number,
      default: undefined,
    }
  },
  name: "PPRadio",

  data() {
    return {
      pickedButtonIndex: '',
    }
  },

  watch: {
    defaultPickedIndex: {
      handler() {
        this.initPicked();
      },
      immediate: true,
    }
  },

  methods: {
    initPicked() {
      if (this.defaultPickedIndex) {
        this.pickRadio(this.defaultPickedIndex);
      } else {
        this.pickRadio(0);
      }
    },

    pickRadio(index) {
      this.pickedButtonIndex = index;
      this.$emit('change', this.pickedButtonIndex);
    }
  },
}
</script>
