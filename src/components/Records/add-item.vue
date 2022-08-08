<template>
  <el-dialog
    top="1vh"
    title="添加投递记录"
    style="text-align:center;font:700 25px Helvetica Neue, Helvetica, PingFang SC,Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;"
    :destroy-on-close="true"
    :visible="true"
    width="52%"
    :before-close="cancelAdd"
    :close-on-click-modal="false"
  >
    <el-form top="5vh" label-width="80px" ref="newCompany" :model="newCompany">
      <el-form-item label="公司名称">
        <el-input v-model="newCompany.company"></el-input>
      </el-form-item>
      <el-form-item label="岗位批次">
        <el-input v-model="newCompany.job"></el-input>
      </el-form-item>

      <el-form-item label="工作地点">
        <el-input v-model="newCompany.position"></el-input>
      </el-form-item>

      <el-form-item label="起止日期">
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="开始日期"
            v-model="newCompany.startTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd "
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="结束日期"
            v-model="newCompany.endTime"
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
            v-model="newCompany.submitTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd "
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <!-- <el-col class="line" :span="2">-</el-col> -->
        <el-col :span="12">
          <el-time-picker
            placeholder="投递时刻"
            v-model="newCompany.submitHMS"
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
          v-model="newCompany.recommendCode"
        ></el-input
        ><el-input
          style="width:50%;"
          placeholder="内推人"
          v-model="newCompany.recommendPerson"
        ></el-input>
      </el-form-item>

      <el-form-item label="处理进度" style="text-align:left">
        <el-select
          style="width:50%;"
          v-model="newCompany.dealProcess"
          placeholder="请选择当前进度"
        >
          <el-option label="待处理" value="待处理"></el-option>
          <el-option label="不考虑" value="不考虑"></el-option>
          <el-option label="已投递" value="已投递"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转链接">
        <el-input v-model="newCompany.link"></el-input>
      </el-form-item>

      <el-form-item label="备注信息">
        <el-input
          type="textarea"
          rows="3"
          v-model="newCompany.remark"
        ></el-input>
      </el-form-item>

      <el-form-item
        style="margin-left:-80px;margin-bottom:0;display:flex;justify-content:center"
      >
        <el-button type="primary" @click="saveAdd()">立即添加</el-button>
        <el-button @click="cancelAdd()">取消添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      newCompany: {
        company: "",
        job: "",
        position: "",
        score: 5,
        link: "",
        startTime: "",
        endTime: "",
        submitTime: "",
        submitHMS: "",
        recommendCode: "",
        recommendPerson: "",
        dealProcess: "待处理",
        remark: ""
      }
    };
  },
  methods: {
    saveAdd() {
      this.$confirm("确认添加吗?", "提示", {
        confirmButtonText: "考虑好了",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          //添加数据
          this.$emit("confirm-add", this.newCompany);

          //弹出提示
          this.$message({
            type: "success",
            message: "添加成功!",
            duration: 800
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "取消添加！"
          });
        });
    },

    //关闭添加窗口
    cancelAdd() {
      this.$confirm("确认取消吗?", "提示", {
        confirmButtonText: "考虑好了",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          this.$emit("cancel-add");
        })
        .catch(() => {});
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
