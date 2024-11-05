<template>
  <div
      class="ds-coin-input"
      :class="{
        '_focused': focused,
        '_disabled': disabled,
        '_error': hasErrors,
        '_warning': hasWarnings
  }">
    <div v-if="!disableTopRow" class="row">
      <div class="greetings">
        {{ greetMessage }}
      </div>
      <div v-if="tokenPrice > 0" class="token-price">
        1 {{ tokenSymbols.join('-') }} = ${{ tokenPrice | beautyNumber2 }}
      </div>
      <div v-else class="row">
        <div class="balance">
          Balance: {{ balance | beautyNumber3 }}
          <button
              v-if="(balance && balance > 0.0000001) && !disabled"
              class="max-button"
              @click="$emit('on-max')"
          >
            Max
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <input
          :type="type"
          :placeholder="type === 'number' ? '0' : ''"
          :disabled="disabled"
          :value="value"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="$emit('change', +$event.target.value)"
          @keydown.enter="$emit('enterHit')"
      >
      <div class="tokens-container">
        <div class="icons" :class="{'_multi': tokenIcons.length > 1}">
          <pp-icon v-for="(token, i) in tokenIcons" :key="i" :name="token" />
        </div>
        <div class="text">
          {{ tokenSymbols.join('-') }}
        </div>
      </div>
    </div>
    <div v-if="tokenPrice > 0" class="row">
      <div class="picked-price">
        ${{ amountUsdPicked | beautyNumber2}}
      </div>
      <div class="balance">
        Balance: {{ balance | beautyNumber3 }}
        <button
            v-if="(balance && balance > 0.0000001) && !disabled"
            class="max-button"
            @click="$emit('on-max')"
        >
          Max
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoinInput",

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: [String, Number],
    },
    type: {
      type: String,
      default: 'number',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    greetMessage: {
      type: String,
      default: 'Enter token amount'
    },
    tokenSymbols: {
      type: Array,
      default: () => ['PLS SET TOKEN SYMBOL']
    },
    tokenIcons: {
      type: Array,
      default: () => ['PLS SET TOKEN ICON']
    },
    tokenPrice: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
    },
    hasErrors: {
      type: Boolean,
      default: false,
    },
    hasWarnings: {
      type: Boolean,
      default: false,
    },
    disableTopRow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      focused: false,
    }
  },

  computed: {
    amountUsdPicked() {
      if (this.value && this.tokenPrice) {
        return this.tokenPrice * this.value;
      }
      return 0;
    },
  },

  methods: {
    handleFocus(e) {
      this.focused = true;
      this.$emit('focus', +e.target.value)
    },
    handleBlur(e) {
      this.focused = false;
      this.$emit('blur', +e.target.value)
    },
  },
}
</script>
