<template>
  <div class="ds-pagination" :class="{'_adaptive-wide': $mq === 'sm'}">
    <div
      class="pagination-button prev-btn no-highlights no-select"
      :class="{'_disabled': currentPage === 1}"
      @click.prevent="pickPage(currentPage - 1)"
    >
      <ds-icon name="shevron-left-24" />
    </div>
    <div
      v-if="totalPages > 6 && currentPage > ($mq === 'sm' ? 2 : 4)"
      class="first-page pagination-button no-highlights no-select"
      :class="{'_active': currentPage === 1}"
      @click.prevent="pickPage(1)"
    >
      1
    </div>
    <div v-if="currentPage > ($mq === 'sm' ? 2 : 4)" class="dots">
      ...
    </div>
    <div
      v-for="item in pagesList"
      :key="item"
      class="pagination-button no-highlights no-select"
      :class="{'_active': currentPage === item}"
      @click.prevent="pickPage(item)"
    >
      {{ item }}
    </div>
    <div v-if="totalPages > 6 && currentPage < (totalPages - ($mq === 'sm' ? 1 : 3))" class="dots">
      ...
    </div>
    <div
      v-if="totalPages > 6 && currentPage < (totalPages - ($mq === 'sm' ? 1 : 2))"
      class="last-page pagination-button no-highlights no-select"
      :class="{'_active': currentPage === totalPages}"
      @click.prevent="pickPage(totalPages)"
    >
      {{ totalPages }}
    </div>
    <div
      class="pagination-button next-btn no-highlights no-select"
      @click.prevent="pickPage(currentPage + 1)"
      :class="{'_disabled': currentPage === totalPages}"
    >
      <ds-icon name="shevron-right-24" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-plusplus */
/**
 * @desc Component for pagination
 *
 * @vue-props {Number} totalResults - Total amount of items exists
 * @vue-props {Number} initPage - On which page should page be set on load. Most of the time it's = 1
 * @vue-props {Number} resultOnPage - How much results per page
 *
 * @vue-data {Number} totalPages - Total pages base on resultsAmount and resultOnPage
 * @vue-data {Number} currentPage - current page (yeah)
 * @vue-data {Array} pagesList - Array of numbers which are used as page numbers
 *
 * @vue-emit {Number} page - Returning page number that pagination component has calculated
 */
export default {
  name: 'Pagination',
  props: {
    totalResults: {
      type: Number,
    },
    initPage: {
      type: Number,
      default: 1,
    },
    resultOnPage: {
      type: Number,
      default: 6,
    },
  },

  data: () => ({
    totalPages: 0,
    currentPage: 0,
    pagesList: [],
  }),

  watch: {
    totalResults() {
      this.init();
    },
    resultOnPage() {
      this.init();
    },
    initPage() {
      this.init();
    }
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.calcPage();
      this.calcPageRange();
    },
    /**
     * Calc total available pages
     */
    calcPage() {
      this.totalPages = Math.ceil(this.totalResults / this.resultOnPage);
      this.currentPage = this.initPage;
    },
    /**
     * Calc pagination for all except mobiles
     */
    calcPageRange() {
      const list = [];
      if (this.totalPages <= 6) {
        for (let i = 1; i <= this.totalPages; i++) {
          list.push(i);
        }
      } else {
        if (this.$mq === 'sm') {
          this.calcPagesForMobile();
          return;
        }
        // Filling left part
        if (this.currentPage <= 4) {
          for (let i = 1; i <= this.currentPage; i++) {
            list.push(i);
          }
        } else {
          for (let i = this.currentPage - 1; i <= this.currentPage; i++) {
            list.push(i);
          }
        }
        // Filling right part
        if (this.currentPage + 2 <= this.totalPages) {
          const end = this.currentPage + 2;
          for (let i = this.currentPage + 1; i <= end; i++) {
            list.push(i);
          }
        } else if (this.currentPage + 2 > this.totalPages) {
          for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
            list.push(i);
          }
        }
      }
      this.pagesList = list.sort((a, b) => a - b);
    },
    /**
     * Calc pagination for mobiles
     */
    calcPagesForMobile() {
      const list = [];
      // Filling left part
      if (this.currentPage <= 2) {
        for (let i = 1; i <= this.currentPage; i++) {
          list.push(i);
        }
      } else {
        for (let i = this.currentPage - 1; i <= this.currentPage; i++) {
          list.push(i);
        }
      }
      // Filling right part
      if (this.currentPage + 1 <= this.totalPages) {
        const end = this.currentPage + 1;
        for (let i = this.currentPage + 1; i <= end; i++) {
          list.push(i);
        }
      } else if (this.currentPage + 1 > this.totalPages) {
        for (let i = this.currentPage + 1; i <= this.totalPages; i++) {
          list.push(i);
        }
      }
      this.pagesList = list.sort((a, b) => a - b);
    },
    /**
     * Picking page and letting now parent it's number
     * @param page
     */
    pickPage(page) {
      this.currentPage = page;
      this.$emit('page', page);
      this.calcPageRange();
    },
    /**
     * Reset pagination. Like after apply filters. Called from parent
     */
    paginationReset() {
      this.currentPage = 1;
      this.init();
    },
  },
};
</script>
