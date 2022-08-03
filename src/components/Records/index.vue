<template>
  <div>
    <!-- 表格 -->
    <div style="width:88%;padding:20px 20px;margin:0 auto">
      <el-table
        :data="tableData"
        style="width: 100%;height:100%"
        :row-class-name="tableRowClassName"
        ref="multipleTable"
      >
        <el-table-column type="index" width="50"> </el-table-column>

        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="公司名称">
                <span>{{ props.row.company }}</span>
              </el-form-item>
              <el-form-item label="跳转链接">
                <span
                  ><a :href="props.row.link" target="_blank">{{
                    props.row.link
                  }}</a></span
                >
              </el-form-item>

              <el-form-item label="备注信息">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <template>
          <el-table-column label="公司" prop="company" width="100">
            <template v-slot:default="scope_company">
              <a
                class="run-to-link"
                :href="scope_company.row.link"
                target="_blank"
                >{{ scope_company.row.company }}</a
              >
            </template>
          </el-table-column>
          <el-table-column label="岗位" prop="job"> </el-table-column>

          <!-- 工作地点 -->
          <el-table-column label="工作地点" prop="position"></el-table-column>
          <!-- 评分行 -->
          <el-table-column label="意向评分" width="150">
            <template v-slot="scope_score">
              <el-rate v-model="scope_score.row.score" :colors="colors">
              </el-rate>
            </template>
          </el-table-column>

          <el-table-column label="开始时间" prop="startTime"></el-table-column>
          <el-table-column label="结束时间" prop="endTime"> </el-table-column>
          <el-table-column label="投递时间" width="100">
            <template v-slot:default="scope">{{
              scope.row.submitTime + "\n" + scope.row.submitHMS
            }}</template>
          </el-table-column>
          <el-table-column label="内推码" prop="recommendCode">
          </el-table-column>
          <!-- <el-table-column label="内推人" prop="recommendPerson">
          </el-table-column> -->
          <el-table-column label="处理进度" prop="dealProcess">
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template #default="scope">
              <!-- 修改功能按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="handleEdit(scope.$index)"
              ></el-button>

              <!-- 删除功能按钮 -->
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确认要删除该条记录？"
                @onConfirm="handleDelete(scope.$index)"
                :ref="`popover-${scope.$index}`"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  slot="reference"
                  style="margin-left: 10px"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 侧边按钮 -->
    <div class="sider">
      <!-- 返回顶部 -->
      <div class="side-button side-btn1" @click="backTop" title="回到顶部">
        <i class="el-icon-caret-top"></i>
      </div>
      <!-- 添加按钮 -->
      <div
        class="side-button side-btn2"
        @click="isAdding = true"
        title="添加个人记录"
      >
        添加
      </div>
      <!-- 导出按钮 -->
      <div
        class="side-button side-btn3"
        @click="saveFile"
        title="导出个人记录到本地"
      >
        导出
      </div>
      <!-- 导出按钮 -->
      <div
        class="side-button side-btn4"
        @click="handleImportRecords"
        title="导入本地记录"
      >
        导入
      </div>
      <!-- 返回底部 -->
      <div class="side-button side-btn5" @click="backBottom" title="回到底部">
        <i
          class="el-icon-caret-bottom"
          style="font-size:20px;color:#1989fa;"
        ></i>
      </div>
    </div>
    <!-- 导入功能弹窗 -->
    <el-dialog
      v-if="showImportRecordsDialog"
      top="15vh"
      title="上传记录"
      style="text-align:center;font:700 25px Helvetica Neue, Helvetica, PingFang SC,Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;"
      :destroy-on-close="true"
      :visible="true"
      width="52%"
      :before-close="cancelImport"
    >
      <el-input
        type="textarea"
        rows="15"
        placeholder="将导出的txt文本内容复制到这里~~~"
        v-model="importInfo"
      ></el-input>
      <div style="margin-top:20px">
        <el-button @click="cancelImport">取消</el-button>
        <el-button type="primary" @click="confirmImport">确认</el-button>
      </div>
    </el-dialog>

    <!-- 功能按钮 -->
    <template>
      <!-- 添加框 -->
      <Add-Item
        v-if="isAdding"
        v-on:confirm-add="confirmAdd"
        v-on:cancel-add="cancelAdd"
      />
      <!-- 编辑框 -->
      <Edit-Item
        v-if="isEditing"
        :oldJobnote="oldJobnote"
        v-on:confirm-edit="confirmEdit"
        v-on:cancel-edit="cancelEdit"
      />
    </template>
  </div>
</template>

<script>
import AddItem from "./add-item";
import EditItem from "./edit-item";

export default {
  components: { AddItem, EditItem },

  created() {
    if (localStorage.hasOwnProperty("tableData_job")) {
      this.getStore("tableData_job"); //生成时
    }
  },
  mounted() {
    // 先不滚动，有bug：从个人记录快速切换到招聘信息页面时，可能会直接滚动到底部
    // setTimeout(() => {
    //   this.backBottom(); //滚动到底部
    // }, 600);
  },
  data() {
    return {
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      isAdding: false,
      isEditing: false,
      nowRow: null, //编辑选中行
      oldJobnote: {}, //向子组件传值
      tableData: [],
      importInfo: "",
      showImportRecordsDialog: false
    };
  },

  watch: {
    //监听表格数据
    tableData: {
      handler(newValue, oldValue) {
        localStorage.setItem("tableData_job", JSON.stringify(newValue));
      },
      deep: true
    }
  },

  methods: {
    getStore(dataString) {
      //读取本地数据
      this.tableData = JSON.parse(localStorage.getItem(dataString));
      // this.$message({
      //   type: "success",
      //   duration: 500,
      //   message: "记录读取成功!"
      // });
    },

    //控制当前状态函数
    tableRowClassName({ row, rowIndex }) {
      if (row.dealProcess === "待处理") {
        return "";
      } else if (row.dealProcess === "已投递") {
        return "warning-row";
      } else if (row.dealProcess === "已完成") {
        return "success-row";
      } else if (row.dealProcess === "不考虑") {
        return "giveup-row";
      }
      return "";
    },

    //
    //
    //显示或隐藏添加框
    cancelAdd() {
      this.isAdding = !this.isAdding;
    },
    //操作-增加
    confirmAdd(data) {
      this.tableData.push(data);
      this.isAdding = false;
    },

    //操作-删除
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },

    // 操作-修改
    handleEdit(index) {
      this.nowRow = index; //获取选中行
      this.oldJobnote = JSON.parse(JSON.stringify(this.tableData[this.nowRow])); //获取记录，传给编辑框
      this.isEditing = true; //打开编辑框
    },
    cancelEdit() {
      this.nowRow = null;
      this.isEditing = false;
    },
    confirmEdit(data) {
      this.tableData.splice(this.nowRow, 1, data); //替换修改后的值
      this.isEditing = false; //关闭修改窗口
    },

    // 返回顶部
    backTop() {
      $("body,html").animate({ scrollTop: -document.body.scrollHeight }, 500);
    },
    //返回底部
    backBottom() {
      $("body,html").animate({ scrollTop: document.body.scrollHeight }, 500);
    },

    // 导入记录
    handleImportRecords() {
      this.showImportRecordsDialog = true;
    },
    cancelImport() {
      this.importInfo = "";
      this.showImportRecordsDialog = false;
    },
    confirmImport() {
      this.$confirm("本操作会覆盖当前记录，确认上传吗?", "提示", {
        confirmButtonText: "确定上传",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          const arr = this.importInfo
            .split("\n*********************************\n")
            .map(item => JSON.parse(item));

          if (arr[0].hasOwnProperty("company")) {
            this.tableData = arr;
          } else {
            alert("导入格式错误!!!");
          }

          this.importInfo = "";
          this.showImportRecordsDialog = false;
        })
        .catch(() => {
          alert("导入格式错误!!!");
          this.importInfo = "";
          this.showImportRecordsDialog = false;
        });
    },

    //保存文件
    saveFile() {
      const arr = this.tableData.map(obj => JSON.stringify(obj));
      const exportData = arr.join("\r\n*********************************\r\n"); //要导出的数据
      const date = new Date();
      const year = date.getFullYear();
      const tempMonth = date.getMonth() + 1;
      const month = tempMonth < 10 ? "0" + tempMonth : tempMonth; //补全
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const fileName = `tableData:${year}.${month}.${day}.txt`; //文件名
      this.exportRaw(exportData, fileName); //导出文件
    },
    exportRaw(data, name) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      save_link.click();
    }
  }
};
</script>

<style>
a {
  color: #409eff;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table .giveup-row {
  background: #909399;
  background: rgb(200, 200, 200);
}
.el-table .warning-row {
  background: #e6a23c7c;
}
.el-table .success-row {
  background: #67c23aa9;
}

.sider {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}
.side-button {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-top: 10px;

  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  color: white;
  font: 700 15px "宋体";
  line-height: 40px;
  /* padding-top: 12px; */

  transition: all 0.5s;

  text-decoration: none;
  list-style-type: none;
}
.side-button:hover {
  cursor: pointer;
  background-color: #1ee82edd;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.2);
}
.side-btn1 {
  font-size: 20px;
  color: #1989fa;
}
.side-btn2 {
  background-color: rgb(64, 158, 255);

  /* width: 66px;
  height: 66px; */
}
.side-btn3 {
  /* background-color: rgb(230, 162, 60); */
  background-color: grey;
}
.side-btn4 {
  /* background-color: rgb(245, 108, 108); */
  background-color: grey;
}
</style>
