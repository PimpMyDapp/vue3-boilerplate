<template>
  <div class="ds-tabs-scroll-container">
    <div class="ds-tabs" :class="{'shimmer-animation': loading}">
      <template v-if="!loading" v-for="(tab, i) in list">
        <template v-if="tab.length">
          <!--  Case when tab is an array of strings  -->
          <button
              :key="i"
              class="pp-tab"
              :class="{'_active': tab === value}"
              :tabindex="tab === value ? -1: 0"
              @click="handlePick(tab)"
          >
            {{ tab }}
          </button>
        </template>
        <template v-else>
          <!--  Case when tab is object with name and value  -->
          <button
              :key="i"
              class="pp-tab"
              :class="{'_active': tab.value === value}"
              :tabindex="tab.value === value ? -1: 0"
              @click="handlePick(tab.value)"
              v-html="tab.name"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * With that component you can use tabs in your interfaces.
 * 1) Send list with tabs. It could be an array of strings or array of objects (object should include "name" and "value" keys)
 * 2) If you're using list ob objects you can set markdown inside "tab.name" and it will be interpreted.
 * 3) You can use Tab button to navigate tags
 * 4) Tabs will try to use all space possible, but if space is not enough container will enable scroll (scrollbar is visible only in firefox)
 */

export default {
  name: "Tabs",

  // If you want to use v-model, use that object
  model: {
    prop: 'value',
    event: 'picked',
  },

  props: {
    // send true if tabs should play load animation
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: [Array, Object],
    },
    // v-model is sending that prop
    value: {
      type: String,
    },
  },

  methods: {
    handlePick(value) {
      this.$emit('picked', value);
    },
  },
}
</script>
