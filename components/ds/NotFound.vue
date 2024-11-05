<template>
  <div class="ds-not-found">
    <div class="not-found-container">
      <img :src="img" alt="apps not found">
    </div>
    <div class="main-description">
      {{ text }}
    </div>
    <pp-button v-if="button" @click="$emit('buttonClick', $event)">
      {{ button }}
    </pp-button>
  </div>
</template>

<script>
export default {
  name: "NotFound",

  props: {
    text: {
      type: String,
      default: 'Test text. Please provide proper text'
    },
    img: {
      type: String,
      default: '/images/app-market/apps-unaviable.png'
    },
    button: {
      type: String,
    },
  },
}
</script>
