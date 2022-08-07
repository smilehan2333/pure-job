<template>
  <div>
    <div class="news-container">
      <template>
        <!-- 分页功能 -->
        <el-pagination
          background
          style="text-align:right;margin:0 -10px 10px 0;"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="lists.length"
          @prev-click="prevClick"
          @next-click="nextClick"
          @current-change="currentChange"
        >
        </el-pagination>
        <!-- 表格 -->
        <el-table
          :data="sortLists"
          style="width: 100%"
          v-loading="isLoading"
          stripe
        >
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
          <el-table-column prop="position" label="地点">
            <template v-slot:default="scope">
              {{ scope.row.position ? scope.row.position : "" }}
            </template>
          </el-table-column>

          <!-- <el-table-column prop="remark" label="描述"> </el-table-column> -->
          <el-table-column prop="createPerson" label="创建者" width="100">
          </el-table-column>
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
        class="side-button side-btn1"
        @click="handleAdd"
        title="与大家一起分享招聘信息吧 !"
      >
        添加
      </div>
      <!-- 测试按钮 -->
      <!-- <div class="side-button side-btn1" @click="test">
        测试
      </div> -->
      <div style="text-align:center">
        <span style="color:grey;font-size:10px;">常用链接</span>
      </div>
      <div class="side-button side-btn2" v-for="item in outerLinks">
        <a :href="item.href" target="_blank">{{ item.title }}</a>
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
import { mapGetters, mapMutations } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  components: { HandleItem },
  created() {
    this.refreshJobinfos(); //刷新服务器数据
  },
  data() {
    return {
      isLoading: true,
      isAdding: false,
      isEditing: false,
      oldJobinfo: null,
      pageSize: 10,
      currentPage: 1,
      outerLinks: [
        {
          title: "牛客网",
          href: "https://www.nowcoder.com/jobs/recommend/campus"
        },
        {
          title: "交大招聘",
          href: "https://jiuye.swjtu.edu.cn/eweb/jygl/zpfw.so"
        },
        {
          title: "国资央企",
          href: "https://cujiuye.iguopin.com/?v=3.1.1&inviteCode=55zY4"
        }
      ],
      lists: [
        // {
        //   theme: "字节跳动2023校园招聘研发提前批启动，2000+研发Offer等你来！",
        //   position: "成都",
        //   link: "http://www.baidu.com",
        //   remark: "说明222",
        //   createAtTime: "2022-07-11"
        // }
      ]
    };
  },
  mounted() {
    // 通过本地Cookie信息，向服务器获取用户名
    const uuid = getToken();
    if (uuid) {
      const Author = axios
        .get(`${this.API.LOGIN}/get_username?uuid=${uuid}`)
        .then(res => {
          this.setAuthor(res.data.author);
        });
    }
  },
  computed: {
    ...mapGetters(["Author"]),

    dialogTitle() {
      if (this.isAdding) return "添加信息";
      if (this.isEditing) return "修改信息";
    },
    sortLists() {
      const tempList = JSON.parse(JSON.stringify(this.lists));
      // 计算分页后，每一页显示项目的起止序号
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const currentPageLists = tempList.reverse().slice(startIndex, endIndex);
      const newList = JSON.parse(JSON.stringify(currentPageLists));
      return newList;
    }
  },
  methods: {
    ...mapMutations({ setAuthor: "setAuthor" }),

    // 分页功能
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    nextClick(currentPage) {
      this.currentPage = currentPage;
    },
    prevClick(currentPage) {
      this.currentPage = currentPage;
    },
    // 添加用户接口
    test() {
      const authorLists = [
        "杨新宇",
        "汪盛",
        "罗鑫",
        "孙文锦",
        "乔晓琪",
        "花张羽",
        "吴鉴霖",
        "卢彻",
        "杨帆",
        "李佳洛",
        "刘茂青"
      ];

      for (let i = 0; i < authorLists.length; i++) {
        axios.post(`${this.API.LOGIN}/add_user`, { username: authorLists[i] });
      }
      console.log("test");
    },
    // 日期格式化
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
      if (!this.Author) {
        this.$message("请先登录!");
        return;
      }

      axios
        .post(`${this.API.JOBINFO}/delete_jobinfo`, {
          uuid: uuid
        })
        .then(() => {
          // this.refreshJobinfos(); //刷新服务器数据。删除之后不向服务器请求数据，直接操作本地数据即可
          for (let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].uuid === uuid) {
              this.lists.splice(i, 1);
              break;
            }
          }

          this.$message({
            type: "success",
            duration: 500,
            message: "删除成功!"
          });
        });
    },
    // 修改
    handleEdit(row) {
      if (!this.Author) {
        this.$message("请先登录!");
        return;
      }
      this.oldJobinfo = JSON.parse(JSON.stringify(row));
      this.isEditing = true;
    },
    confirmEdit(newInfo) {
      axios
        .post(`${this.API.JOBINFO}/edit_jobinfo`, {
          newInfo: newInfo
        })
        .then(() => {
          // this.refreshJobinfos(); //刷新服务器数据。修改之后也不用重新请求服务器，直接修改本地即可
          for (let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].uuid === newInfo.uuid) {
              // this.lists[i] = JSON.parse(JSON.stringify(newInfo));//这样不行，视图不会立即更新
              this.$set(this.lists[i], "theme", newInfo.theme);
              this.$set(this.lists[i], "position", newInfo.position);
              this.$set(this.lists[i], "link", newInfo.link);
              this.$set(this.lists[i], "remark", newInfo.remark);
              break;
            }
          }
          this.cancelHandle();

          this.$message({
            type: "success",
            duration: 500,
            message: "修改成功!"
          });
        });
    },
    // 添加
    handleAdd() {
      if (!this.Author) {
        this.$message("请先登录!");
        return;
      }

      this.isAdding = true;
    },
    confirmAdd(newInfo) {
      axios
        .post(`${this.API.JOBINFO}/add_jobinfo`, {
          newInfo: newInfo,
          author: this.Author
        })
        .then(() => {
          this.cancelHandle();
          this.refreshJobinfos(); //刷新服务器数据。添加操作需要在后台生成uuid，所以必须重新请求

          this.$message({
            type: "success",
            duration: 500,
            message: "添加成功!"
          });
        });
    },
    // 获取服务器记录
    refreshJobinfos() {
      const that = this;
      axios.get(`${this.API.JOBINFO}/get_jobinfos`).then(res => {
        that.lists = res.data;
        this.isLoading = false; //加载动画消失
      });
    }
  }
};
</script>
<style scoped>
.news-container {
  /* background: orange; */
  width: 88%;
  margin: 0 auto;
  padding-top: 20px;
}
a,
ul,
li {
  text-decoration: none;
  list-style-type: none;
  color: rgb(64, 158, 255);
}

.sider {
  position: fixed;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}
.side-button {
  height: 36px;
  width: 36px;
  border-radius: 50%;
  margin-top: 10px;

  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  color: white;
  font: 700 16px "宋体";
  line-height: 36px;
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
.side-btn1 {
  background-color: rgb(64, 158, 255);

  margin-bottom: 50px;
}
.side-btn2 {
  /* background-color: rgb(64, 158, 255); */

  border-radius: 5px;
  font: 700 16px "宋体";
  line-height: 20px;
  padding: 10px;
}
</style>
