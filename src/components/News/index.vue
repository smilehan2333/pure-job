<template>
  <div>
    <div class="news-container">
      <template>
        <el-table :data="lists" style="width: 100%" stripe>
          <el-table-column type="index" width="50"> </el-table-column>

          <!-- 展开部分 -->
          <el-table-column type="expand" width="30">
            <template #default="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="备注信息">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <!-- 主体部分 -->
          <el-table-column prop="theme" label="主题">
            <template v-slot:default="scope_company">
              <a
                class="run-to-link"
                :href="scope_company.row.link"
                target="_blank"
                >{{ scope_company.row.theme }}</a
              >
            </template>
          </el-table-column>

          <!-- <el-table-column prop="remark" label="描述"> </el-table-column> -->
          <el-table-column prop="createAtTime" label="创建时间" width="150">
            <template v-slot:default="props">
              <span>{{
                formatDate(props.row.createAtTime).split(" ")[0]
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
            <template #default="scope">
              <!-- 修改功能按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="handleEdit(scope.row)"
              ></el-button>

              <!-- 删除功能按钮 -->
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确认要删除该条记录？"
                @onConfirm="handleDelete(scope.row.uuid)"
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
        </el-table>
      </template>
    </div>

    <div class="sider">
      <!-- 添加按钮 -->
      <div
        class="side-button side-btn2"
        @click="isAdding = true"
        title="与大家一起分享招聘信息吧 !"
      >
        添加
      </div>
    </div>

    <handle-item
      v-if="isAdding || isEditing"
      :dialogTitle="dialogTitle"
      :oldJobinfo="oldJobinfo"
      @cancelHandle="cancelHandle"
      @confirmAdd="confirmAdd"
      @confirmEdit="confirmEdit"
    />
  </div>
</template>
<script>
import axios from "axios";
import HandleItem from "./handle-item.vue";
import formatDate from "@/utils/format-date";

export default {
  components: { HandleItem },
  created() {
    this.refreshJobinfos(); //刷新服务器数据
  },
  data() {
    return {
      isAdding: false,
      isEditing: false,
      oldJobinfo: null,
      lists: [
        {
          theme: "字节跳动2023校园招聘研发提前批启动，2000+研发Offer等你来！",
          link: "http://www.baidu.com",
          remark: "说明222",
          createAtTime: "2022-07-11"
        }
      ]
    };
  },
  computed: {
    dialogTitle() {
      if (this.isAdding) return "添加信息";
      if (this.isEditing) return "修改信息";
    }
  },

  methods: {
    formatDate(dateString) {
      return formatDate(dateString);
    },
    // 取消操作
    cancelHandle() {
      this.isAdding = false;
      this.isEditing = false;
      this.oldJobinfo = null;
    },
    // 删除
    handleDelete(uuid) {
      console.log(uuid);
      axios
        .post("http://81.68.132.87:3011/jobinfos/delete_jobinfo", {
          uuid: uuid
        })
        .then(() => {
          this.refreshJobinfos(); //刷新服务器数据
        });
    },
    // 修改
    handleEdit(row) {
      this.oldJobinfo = JSON.parse(JSON.stringify(row));
      this.isEditing = true;
    },
    confirmEdit(newInfo) {
      console.log(newInfo);
      axios
        .post("http://81.68.132.87:3011/jobinfos/edit_jobinfo", {
          newInfo: newInfo
        })
        .then(() => {
          this.cancelHandle();
          this.refreshJobinfos(); //刷新服务器数据
        });
    },
    // 添加
    confirmAdd(newInfo) {
      console.log(newInfo);
      axios
        .post("http://81.68.132.87:3011/jobinfos/add_jobinfo", {
          newInfo: newInfo
        })
        .then(() => {
          this.cancelHandle();
          this.refreshJobinfos(); //刷新服务器数据
        });
    },
    // 获取服务器记录
    refreshJobinfos() {
      const that = this;
      axios.get("http://81.68.132.87:3011/jobinfos/get_jobinfos").then(res => {
        that.lists = res.data;
      });
    }
  }
};
</script>
<style scoped>
.news-container {
  /* background: orange; */
  width: 70%;
  margin: 0 auto;
  padding-top: 20px;
}
a,
ul,
li {
  text-decoration: none;
  list-style-type: none;
}

.sider {
  position: fixed;
  right: 30px;
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
  font: 700 18px "宋体";
  line-height: 40px;
  padding: 12px;

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
.side-btn2 {
  background-color: rgb(64, 158, 255);
}
</style>
