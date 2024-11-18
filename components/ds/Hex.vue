<template>
  <div class="ds-hex text-md">
    {{ displayText }}
  </div>
</template>

<script setup>
import { cutHex } from '~/composables/helpers/blockchainHelpers';

const props = defineProps({
  hex: {
    type: String,
  },
  text: {
    type: String,
  },
  href: {
    type: String,
  },
  short: {
    type: Boolean,
  },
  full: {
    type: Boolean,
  },
})

const displayText = ref('');
const hexType = ref('');

init();

watch(() => props.hex, () => {
  init();
})

// methods
function init() {
  if (props.hex) {
    if (props.full) {
      displayText.value = props.hex;
    } else {
      displayText.value = cutHex(props.hex);
    }

    if (props.hex.length === 42) {
      hexType.value = 'address';
    } else if (props.hex.length === 66) {
      hexType.value = 'transaction';
    }
  } else if (props.text) {
    displayText.value = props.text;
  }

}
</script>

<style lang="scss" scoped>
.ds-hex {
  color: $white;
}
</style>
