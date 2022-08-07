<template>
  <el-dialog
    title="用户登录"
    :visible="true"
    width="30%"
    :before-close="cancelLogin"
  >
    <!-- 登录页面 -->
    <template v-if="!hasLogin">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <div style="display:flex;justify-content:flex-start">
            <span class="svg-container" style="width:5%;">
              <i class="el-icon-s-custom"></i>
            </span>
            <el-input
              style="width:95%"
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div style="display:flex;justify-content:flex-start">
            <span class="svg-container" style="width:5%;">
              <i class="el-icon-unlock"></i>
            </span>
            <el-input
              style="width:95%"
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              show-password
              tabindex="2"
              auto-complete="off"
              @keyup.enter.native="confirmLogin"
            />
            <!-- <span class="show-pwd" @click="showPwd">
              <i class="el-icon-view"></i>
            </span> -->
          </div>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="confirmLogin"
          >登录</el-button
        >

        <div class="tips" style="color:rgb(64,158,255,0.5)">
          <div style="margin-right:20px;">
            username: 张三 or your chinese name
          </div>
          <div>password: default 123456</div>
        </div>
      </el-form>
    </template>
    <!-- 已经登录 -->
    <template v-else>
      <!-- 非正在修改密码页面 -->
      <template v-if="!isUpdatingPwd">
        <span>{{ Author }}，你好!</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logout">退出登录</el-button>
          <el-button type="primary" @click="handleUpdatePwd"
            >修改密码</el-button
          >
        </span>
      </template>
      <!-- 正在修改密码页面 -->
      <template v-else>
        <div
          style="display:flex;justify-content:flex-start;align-items:center;padding:5px;"
        >
          <span style="color:grey;width:10%;margin-right:10px;">输入密码</span>
          <el-input
            style="flex:1;"
            placeholder="请输入新密码"
            show-password
            v-model="newPassword[0]"
          ></el-input>
        </div>
        <div
          style="display:flex;justify-content:flex-start;align-items:center;padding:5px;"
        >
          <span style="color:grey;width:10%;margin-right:10px;">确认密码</span>
          <el-input
            style="flex:1;"
            placeholder="请确认密码"
            show-password
            v-model="newPassword[1]"
          ></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelLogin">取消</el-button>
          <el-button type="primary" @click="confirmUpdatePwd">确认</el-button>
        </span>
      </template>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { validUsername } from "@/utils/validate";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Login",
  created() {
    if (getToken()) this.hasLogin = true;
    else this.hasLogin = false;
  },
  computed: {
    ...mapGetters(["Author"])
  },
  data() {
    // 验证用户名格式
    // 这儿还可以写东西是我没想到的！！！
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名!"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不得少于6位!"));
      }
    };

    return {
      dialogVisible: "",
      hasLogin: false,
      isUpdatingPwd: false,
      newPassword: ["", ""],
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password"
    };
  },
  methods: {
    ...mapMutations({ setAuthor: "setAuthor", resetAuthor: "resetAuthor" }),

    // 取消登录/关闭窗口
    cancelLogin() {
      this.$emit("cancelLogin");
    },
    // 确认登录
    confirmLogin() {
      const userInfo = this.loginForm;

      axios
        .post(`${this.API.LOGIN}/validate_user`, { ...userInfo })
        .then(res => {
          if (res.data === "登录验证失败!") {
            this.$message.error("用户名或密码错误!");
          } else {
            setToken(res.data); //存入cookie
            this.setAuthor(userInfo.username); //vuex存入用户名
            this.cancelLogin();

            this.$message({
              message: "登录成功!",
              type: "success"
            });
          }
        });
    },
    // 退出登录
    logout() {
      removeToken();
      this.resetAuthor();

      this.$message({
        message: "退出登录成功!",
        type: "success"
      });
      this.cancelLogin();
    },
    //修改密码
    handleUpdatePwd() {
      this.isUpdatingPwd = true;
    },
    confirmUpdatePwd() {
      // 验证输入的密码长度
      if (this.newPassword[0].length < 6 || this.newPassword[1].length < 6) {
        this.$message("密码长度不小于6位!");
        return;
      }
      // 验证两次输入的密码是否相等
      if (!(this.newPassword[0] === this.newPassword[1])) {
        this.$message("两次输入的密码不一致!");
        return;
      }

      axios
        .post(`${this.API.LOGIN}/edit_user`, {
          uuid: getToken(),
          newPassword: this.newPassword[0]
        })
        .then(res => {
          this.newPassword = ["", ""];
          this.logout();
          this.$message({
            message: "密码修改成功，请重新登录!",
            type: "success"
          });
        });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;

  .canvas {
    position: fixed;
    z-index: -999;
    width: 100%;
    height: 100%;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
