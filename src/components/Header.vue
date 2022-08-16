<template>
  <div style="position:relative">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#2274A5"
      text-color="#fff"
      active-text-color="#F1C40F"
      style="display:flex;flex-direction:row;justify-content: center;text-align:center;user-select:none;"
    >
      <el-menu-item index="/records" title="个人记录将会保存在本地"
        >个人记录</el-menu-item
      >
      <el-menu-item
        index="/news"
        title="招聘信息将会上传，与大家共享，同时你也可以看到大家上传的信息"
        >招聘信息</el-menu-item
      >
    </el-menu>

    <!-- 登录按钮 -->
    <div class="login">
      <el-button type="primary" circle @click="handleLogin">
        <!-- 未登录显示图标 -->
        <template v-if="stateOfLogin === 'offline'"
          ><i :class="icon[0]"></i
        ></template>
        <!-- 已登录显示名 -->
        <template v-else>
          <span>{{ avator }}</span>
        </template>
      </el-button>
    </div>
    <!-- 登录组件 -->
    <Login v-if="isLogining" @cancelLogin="cancelLogin" />
  </div>
</template>
<script>
import Login from "./Login.vue";
import { mapGetters } from "vuex";

export default {
  name: "Header",
  components: { Login },
  data() {
    return {
      activeIndex: "/news",
      icon: ["el-icon-user-solid", "el-icon-user"],
      stateOfLogin: "offline",
      avator: "",
      isLogining: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.validateLoginState();
    }, 500);
  },
  computed: {
    ...mapGetters(["Author"])
  },
  methods: {
    //导航栏跳转
    handleSelect(key, keyPath) {
      this.$router.push(key).catch(err => {});
    },
    // 用户登录
    handleLogin() {
      this.isLogining = true;
    },
    cancelLogin() {
      this.isLogining = false;

      this.validateLoginState();
    },
    validateLoginState() {
      if (this.Author) {
        this.stateOfLogin = "online";
        const arr = this.Author.split("");
        this.avator = arr[arr.length - 1];
      } else this.stateOfLogin = "offline";
    }
  }
};
</script>
<style scoped>
.el-menu-item {
  font-size: 20px;
  width: 15%;
}
.login {
  position: absolute;
  padding: 5px;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  text-align: center;
}
</style>
