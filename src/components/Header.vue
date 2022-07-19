<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="display:flex;flex-direction:row;justify-content: center;text-align:center"
    >
      <!-- <el-menu-item index="/home">首页</el-menu-item> -->
      <el-menu-item index="/records">个人记录</el-menu-item>
      <el-menu-item index="/news">招聘信息</el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      activeIndex: "/home"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key).catch(err => {});
    }
  }
};
</script>
<style scoped>
.el-menu-item {
  font-size: 20px;
  width: 15%;
}
</style>
