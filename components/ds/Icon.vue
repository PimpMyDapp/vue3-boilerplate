<template>
  <div class="ds-icon" @click="$emit('click', $event)">
    <nuxt-icon :name="name" :filled="filled" />
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    name: {
      type: String,
    },
    filled: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss">
.nuxt-icon,
.nuxt-icon svg{
  width: 100%;
  height: 100%;
  margin-bottom: 0;

  transition: color .2s;
}

.nuxt-icon {
  display: block;
}
</style>
