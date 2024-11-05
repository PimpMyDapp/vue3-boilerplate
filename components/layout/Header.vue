<template>
  <header>
    <div class="main-container">
      <img v-if="isMobile" class="logo" :style="`height: ${getLogo.height}`" :src="getLogo.mobile">
      <img v-else class="logo" :style="`height: ${getLogo.height}`" :src="getLogo.desktop">
      <div class="options text-sm">
        <div class="item" @mouseenter="productsDrop = true" @mouseleave="productsDrop = false">
          <div class="item-text">
            Products
            <ds-icon class="arrow" :class="{'_active': productsDrop}" name="shevron-down-16" />
          </div>
          <div v-show="productsDrop" style="width: 210px;" class="dropdown">
            <a
                target="_blank"
                href="/legacy"
                class="dropdown-item"
                :class="{'_picked': $route.name === 'legacy'}"
            >
              CryptoLegacy
              <ds-icon name="shevron-right-16" class="hover-arrow" />
            </a>
            <div
                target="_blank"
                class="dropdown-item"
                style="pointer-events: none"
            >
              <span>Referral NFT Pass</span>
              <div class="sooner">SOON</div>
            </div>
          </div>
        </div>
        <div class="item" @mouseenter="mediaDrop = true" @mouseleave="mediaDrop = false">
          <div class="item-text">
            Media
            <ds-icon class="arrow" :class="{'_active': mediaDrop}" name="shevron-down-16" />
          </div>
          <div v-show="mediaDrop" class="dropdown">
            <a
                v-for="item in getMediaLinks"
                target="_blank"
                :href="item.link"
                class="dropdown-item"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
        <div class="item">
          <a href="#" target="_blank" class="item-text">
            docs
          </a>
        </div>
        <div class="item">
          <a href="#" target="_blank" class="item-text">
            Github
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core';

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})

const productsDrop = ref(false);
const mediaDrop = ref(false);

const isMobile = useMediaQuery('(max-width: 600px)')

const getMediaLinks = computed(() => {
  if (props.type === 'legacy') {
    return [
      {
        title: "Twitter",
        link: 'https://x.com/0xcust',
      }
    ]
  }

  return [
    {
      title: "Twitter",
      link: 'https://x.com/0xcust',
    }
  ]
});

const getLogo = computed(() => {
  if (props.type === 'legacy') {
    return {
      desktop: '/legacy/logo-desktop.png',
      mobile: '/legacy/logo.png',
      height: '36px',
    }
  }
  return {
    desktop: '/logo-desktop.png',
    mobile: '/logo.png',
    height: '32px',
  }
})

</script>

<style lang="scss" scoped>
  header {
    position: relative;
    z-index: 10;
    width: 100%;
    border-bottom: 1px solid $black-700;

    .logo {
      height: 32px;
    }

    .main-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .options {
      display: flex;
      align-items: center;
      gap: 48px;
      margin-left: auto;
      text-transform: uppercase;

      .item {
        position: relative;
      }

      a {
        @include a-reset;
      }
    }

    .item-text {
      @include get_typography(12, "bold");
      display: flex;
      align-items: center;
      gap: 2px;
      color: $white-700 !important;

      & > .ds-icon {
        position: relative;
        top: -3px;
        width: 22px;
        height: 22px;
      }

      &:hover {
        color: $white !important;
      }
    }

    .arrow {
      transition: transform .2s;

      &._active {
        transform: rotate(180deg);
      }
    }

    .dropdown {
      position: absolute;
      display: flex;
      flex-direction: column;
      gap: 16px;
      right: 0;
      top: calc(100% + 15px);
      padding: 16px;
      border: 1px solid $black-500;
      background-color: $black-700;
      box-shadow: 0 2px 0 0 rgba(17, 17, 17, 0.50);

      &::before {
        position: absolute;
        bottom: 100%;
        left: 0;
        content: "";
        width: 100%;
        height: 22px;
      }
    }

    .dropdown-item {
      @include get_typography(12, "bold");
      display: flex;
      gap: 16px;
      color: $white-700 !important;

      .hover-arrow {
        position: relative;
        display: none;
        top: -3px;
        left: -10px;
        color: $green !important;
        width: 22px;
        height: 22px;
        margin-bottom: -3px;
      }

      &:hover,
      &._picked {
        color: $white !important;

        .hover-arrow {
          display: block;
        }
      }

      &._picked {
        pointer-events: none;
      }
    }

    .sooner {
      color: $white-500 !important;
    }
  }
</style>
