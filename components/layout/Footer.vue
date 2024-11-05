<template>
  <footer>
    <div class="main-container">
      <div class="copyright text-sm">
        {{ getCopyright }}
      </div>
      <div v-if="getLinks && getLinks.length" class="follow">
        <span class="text-sm">FOLLOW US</span>
        <a v-for="item in getLinks" :href="item.link" target="_blank">
          <ds-icon :name="item.icon" :filled="false" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: '',
  }
})

const currentYear = new Date().getFullYear();

const getLinks = computed(() => {
  if (props.type === 'legacy') {
    return [
      {
        icon: 'github-16',
        link: 'https://github.com/CryptoCust',
      },
      {
        icon: 'twitter-16',
        link: 'https://x.com/0xcust',
      }
    ]
  }

  return [
    {
      icon: 'github-16',
      link: 'https://github.com/CryptoCust',
    },
    {
      icon: 'twitter-16',
      link: 'https://x.com/0xcust',
    }
  ]
});

const getCopyright = computed(() => {
  if (props.type === 'legacy') {
    return `CRYPTOLEGACY ${currentYear}`
  }

  return `CRYPTOCUSTOMS ${currentYear}`
})
</script>

<style lang="scss" scoped>
  footer {
    width: 100%;
    border-top: 1px solid $black-700;
    margin-top: 220px;

    .main-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .copyright {
      color: $white-500;
    }

    .follow {
      display: flex;
      align-items: center;
      column-gap: 24px;

      .ds-icon {
        color: $white-500;
      }

      a {
        color: #fff;
        text-decoration: none;

        &:hover {
          .ds-icon {
            color: $white;
          }
        }
      }
    }

    @include tablet {
      margin-top: 160px;
    }

    @include mobile {
      margin-top: 100px;
    }
  }
</style>
