<template>
  <div class="footer">
    {{ msg }}
  </div>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {
      msg: "footer"
    };
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;

  line-height: 50px;
  background-color: bisque;

  text-align: center;
}
</style>
