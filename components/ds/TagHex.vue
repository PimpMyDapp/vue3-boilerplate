<template>
  <div class="ds-tag-hex" :key="$mq">
    <a v-if="showLink" :href="hexUrl" target="_blank">
      <PpTag color="gray" :class="{'_transparent': transparent}">
        <div v-if="customText">{{ customText }}</div>
        <pretty-hex v-else :hex="hex" :short="alwaysShort ? true : $mq === 'sm'" :full="full" />

        <ds-icon name="inner-link-16" />
        <ds-icon v-if="showCopy" class="copy" name="copy-16" @click.native="makeCopy" />
      </PpTag>
    </a>
    <span v-else>
      <PpTag color="gray" :class="{'_transparent': transparent}">
        <div v-if="customText">{{ customText }}</div>
        <pretty-hex v-else :hex="hex" :short="alwaysShort ? true : $mq === 'sm'" :full="full" />

        <ds-icon v-if="showCopy" class="copy" name="copy-16" @click.native="makeCopy" />
      </PpTag>
    </span>
  </div>
</template>

<script>
import PpTag from './Tag.vue';
import Helper from '@galtproject/frontend-core/services/helper';
import EthData from '@galtproject/frontend-core/libs/EthData';

export default {
  name: "TagHex",
  props: {
    hex: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    customText: {
      type: String,
      default: '',
    },
    showCopy: {
      type: Boolean,
      default: true,
    },
    showLink: {
      type: Boolean,
      default: true,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    alwaysShort: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    PpTag
  },

  computed: {
    type() {
      if (this.hex.length === 42) {
        return 'address';
      } else if (this.hex.length === 66) {
        return 'transaction';
      }
      return 'undefined';
    },
    hexUrl() {
      if (this.link) {
        return this.link;
      }
      else if (this.type === 'address') {
        return this.getExplorerAddressUrl();
      } else if (this.type === 'transaction') {
        return this.getExplorerTxUrl();
      }
      return this.hex;
    },
  },

  methods: {
    makeCopy(e) {
      e.preventDefault();
      e.stopPropagation();

      Helper.copyToClipboard(this.hex);
      this.$notify({
        type: 'success',
        title: this.$locale ? this.$locale.get('pretty_hex.copied_to_clipboard') : "Copied to Clipboard",
      });
    },

    getExplorerAddressUrl() {
      return ((this.$store && this.$store.state && this.$store.state.explorer_address_url) || EthData.explorerAddressUrl()) + this.hex;
    },
    getExplorerTxUrl() {
      return ((this.$store && this.$store.state && this.$store.state.explorer_tx_url) || EthData.explorerTxUrl()) + this.hex;
    },
  },
}
</script>
