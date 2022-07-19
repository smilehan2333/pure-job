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
    <el-form top="5vh" label-width="80px" ref="newInfo" :model="newInfo">
      <el-form-item label="主题">
        <el-input v-model="newInfo.theme"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="newInfo.link"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" rows="10" v-model="newInfo.remark"></el-input>
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
  data() {
    return {
      newInfo: {
        theme: "",
        link: "https://www.baidu.com",
        remark: ""
      },
      state: "adding"
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
