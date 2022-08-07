<template>
  <el-dialog
    top="8vh"
    :title="dialogTitle"
    style="text-align:center;font:700 25px Helvetica Neue, Helvetica, PingFang SC,Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;"
    :destroy-on-close="true"
    :visible="true"
    width="52%"
    :before-close="cancelHandle"
  >
    <el-form
      top="5vh"
      label-width="80px"
      ref="newInfo"
      :model="newInfo"
      :rules="rules"
    >
      <!-- <el-form-item label="作者">
        <el-input
          v-model="author"
          placeholder="首次上传需要输入名称哦~~~"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="主题" prop="theme">
        <el-input v-model="newInfo.theme"></el-input>
      </el-form-item>
      <el-form-item label="地点" prop="position">
        <el-input v-model="newInfo.position"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="newInfo.link"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          rows="10"
          placeholder="请勿超过500字~~~"
          v-model="newInfo.remark"
        ></el-input>
      </el-form-item>

      <el-form-item
        style="margin-left:-80px;margin-bottom:0;display:flex;justify-content:center"
      >
        <el-button type="primary" @click="confirmHandle()">确认</el-button>
        <el-button @click="cancelHandle()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "HandleItem",
  props: ["dialogTitle", "oldJobinfo"],
  created() {
    //如果oldJobinfo中有值，说明是修改状态
    if (this.oldJobinfo) {
      this.state = "editing";
      this.newInfo = JSON.parse(JSON.stringify(this.oldJobinfo));
    }
  },

  // created() {
  //   // 如果本地没有这个字段，并且输入框输入了值
  //   if (!localStorage.hasOwnProperty("whoru") && true) {
  //     localStorage.setItem("whoru", "smilehanhanhan");
  //   } else {
  //     const user = localStorage.getItem("whoru");
  //     this.author=user
  //     console.log(user);
  //   }
  // },
  data() {
    return {
      // 表单输入规则
      rules: {
        theme: [
          {
            required: true,
            message: "请输入主题(100字以内)~~~",
            trigger: "blur"
          },
          { min: 1, max: 100 }
        ],
        position: [
          {
            required: false,
            trigger: "blur"
          },
          { min: 0, max: 99 }
        ],
        link: [
          {
            required: true,
            message: "请输入链接(800字以内)~~~",
            trigger: "blur"
          },
          { min: 1, max: 800 }
        ],
        remark: [
          {
            required: false,
            message: "请输入描述(1000字以内)~~~",
            trigger: "blur"
          },
          { min: 0, max: 999 }
        ]
      },
      newInfo: {
        theme: "",
        position: "",
        link: "https://www.baidu.com",
        remark: ""
      },
      state: "adding",
      author: ""
    };
  },

  methods: {
    cancelHandle() {
      this.$emit("cancelHandle");
    },
    confirmHandle() {
      if (this.state === "editing") {
        this.$emit("confirmEdit", this.newInfo);
      } else {
        this.$emit("confirmAdd", this.newInfo);
      }
    }
  }
};
</script>
