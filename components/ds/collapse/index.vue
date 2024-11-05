<template>
  <div class="ds-collapse">
    <ds-collapse-item
        v-for="item in optionWithIds"
        :id="item.id"
        :opened="openedItems"
        use-show
        @openItem="handleOpens($event, 'open')"
        @closeItem="handleOpens($event, 'close')"
    >
      <template #header>
        <div class="nice-hat">
          <div class="text-md title">{{ item.head }}</div>
          <ds-icon class="arrow" name="shevron-down-24" />
        </div>
      </template>
      <template #body>
        <span class="text-md text">{{ item.body }}</span>
      </template>
    </ds-collapse-item>
  </div>
</template>

<script setup>

const props = defineProps({
  options: Array, // Array of objects. Object always have to includes "head": String, and "body": String
});

const openedItems = ref([]);

const optionWithIds = computed(() => {
  return props.options.map((option, i) => ({
    ...option,
    id: i,
  }))
});

function handleOpens(id, action) {
  if (action === 'open') {
    openedItems.value.push(id);
  } else {
    openedItems.value = openedItems.value.filter(item => item !== id);
  }
}
</script>
<script>
 export default {
   name: "CollapseList"
 }
</script>

<style lang="scss" scoped>
.ds-collapse {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text {
  color: $white-500;
}

.nice-hat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  width: 24px;
  min-width: 24px;
  height: 24px;
  transition: transform .2s;
}

::v-deep(.header) {
  .arrow {
    color: $white-500;
  }

  &._header-active {
    .arrow {
      transform: rotate(180deg);
      color: $white;
    }
  }

  &:hover {
    .arrow {
      color: $white;
    }
  }
}
</style>
