<script>
export default {
  data() {
    return {
      isInView: false,
    }
  },
  mounted() {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.isInView = true;
      }
    }, options);

    observer.observe(this.$el);
  },
}
</script>
