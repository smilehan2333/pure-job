<template>
  <el-dialog
    top="3vh"
    title="修改投递记录"
    style="text-align:center;font: 700 25px Helvetica Neue, Helvetica, PingFang SC,Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;"
    width="52%"
    :destroy-on-close="true"
    :visible="true"
    :before-close="cancelEdit"
  >
    <el-form top="5vh" ref="newJobnote" :model="newJobnote" label-width="80px">
      <el-form-item label="公司名称">
        <el-input v-model="newJobnote.company"></el-input>
      </el-form-item>
      <el-form-item label="岗位批次">
        <el-input v-model="newJobnote.job"></el-input>
      </el-form-item>

      <el-form-item label="工作地点">
        <el-input v-model="newJobnote.position"></el-input>
      </el-form-item>

      <el-form-item label="起止时间">
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="开始时间"
            v-model="newJobnote.startTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd "
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="结束时间"
            v-model="newJobnote.endTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd "
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="投递时间">
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="投递日期"
            v-model="newJobnote.submitTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd "
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <!-- <el-col class="line" :span="2">-</el-col> -->
        <el-col :span="12">
          <el-time-picker
            placeholder="投递时刻"
            v-model="newJobnote.submitHMS"
            format="HH 时 mm 分 ss 秒"
            value-format="HH:mm:ss"
            style="width: 100%;"
          ></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="内推信息">
        <el-input
          style="width:50%;"
          placeholder="内推码"
          v-model="newJobnote.recommendCode"
        ></el-input
        ><el-input
          style="width:50%;"
          placeholder="内推人"
          v-model="newJobnote.recommendPerson"
        ></el-input>
      </el-form-item>

      <el-form-item label="处理进度" style="text-align:left">
        <el-select
          style="width:50%;"
          v-model="newJobnote.dealProcess"
          placeholder="请选择当前进度"
        >
          <el-option label="待处理" value="待处理"></el-option>
          <el-option label="不考虑" value="不考虑"></el-option>
          <el-option label="已投递" value="已投递"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转链接">
        <el-input v-model="newJobnote.link"></el-input>
      </el-form-item>

      <el-form-item label="备注信息">
        <el-input
          type="textarea"
          rows="3"
          v-model="newJobnote.remark"
        ></el-input>
      </el-form-item>

      <el-form-item
        style="margin-left:-80px;margin-bottom:0;display:flex;justify-content:center"
      >
        <el-button type="primary" @click="saveEdit()">保存修改</el-button>
        <el-button @click="cancelEdit()">取消修改</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: ["oldJobnote"],
  data() {
    return {
      newJobnote: null
    };
  },
  created() {
    this.newJobnote = JSON.parse(JSON.stringify(this.oldJobnote));
  },
  methods: {
    //保存修改
    saveEdit() {
      this.$confirm("确认修改吗?", "提示", {
        confirmButtonText: "考虑好了",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          //保存修改
          this.$emit("confirm-edit", this.newJobnote);

          //弹出提示
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "info",
            message: "修改已取消！"
          });
        });
    },

    //取消修改
    cancelEdit() {
      this.$confirm("确认取消吗?", "提示", {
        confirmButtonText: "考虑好了",
        cancelButtonText: "我再想想",
        type: "warning"
      }).then(() => {
        this.$emit("cancel-edit");
      });
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding: 10px;
}
.el-form-item {
  margin-bottom: 18px;
}
</style>
