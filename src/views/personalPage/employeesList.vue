<template>
  <div div class="personal-box" @click="get_staffList()">
    <div class="personalBox-title">
      <span>员工列表</span>
    </div>
    <div class="personalList-box">
      <div class="personalList" v-for="(item,index) in tableData.data" :key="index">
        <div @click="goDetail(item.id)">
          <img :src="httpPath + item.avatar" alt />
          <span>{{item.nickname}}</span>
          <span>{{item.mobile}}</span>
        </div>
        <p @click="deleteOne(item)">删除</p>
      </div>
      <Page
        :total="tableData.total"
        :page-size="Number(tableData.per_page)"
        :current="tableData.current_page"
        show-total
        prev-text="上一页"
        next-text="下一页"
        @on-change="getData"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "employeesList",
  data() {
    return {
      page: 1,
      tableData: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        data: []
      }
    };
  },
  created() {
    this.get_staffList();
  },
  methods: {
    // 跳转员工详情
    goDetail(id) {
      this.$router.push({ name: "employeesDetails", query: { id } });
    },
    // 获取员工列表
    get_staffList() {
      this.$get({
        url: "/app/user/enterpriseList",
        data: {
          page: this.page,
          pagesize: 10
        },
        success: res => {
          if (res.data.code === 1) {
            //赋值
            this.tableData = res.data.data;
          }
        }
      });
    },
    //删除员工
    deleteOne(item) {
      let _this = this;
      axios
        .delete("/app/user/enterpriseDelete", {
          params: { id: item.id, token: localStorage.getItem("token") }
        })
        .then(function(response) {
          window.console.log(response);
          if (response.data.code === 1) {
            _this.get_staffList();
          }
        });
    },
    //分页
    getData(page) {
      window.scrollTo(0, 60);
      this.page = page;
      this.get_staffList();
    }
  }
};
</script>
<style lang="scss" scoped>
.personal-box {
  width: 820px;
  height: 100%;

  // 管理中心右边部分标题
  .personalBox-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 61px;
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 8px;

    span {
      margin-left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 204, 69, 1);
    }
  }

  .personalList-box {
    width: 100%;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px;
    text-align: center;
    .personalList {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      &:nth-child(odd) {
        background: #f2a500;
        color: #ffffff;
      }
      &:nth-child(even) {
        background: #ffffff;
        span {
          color: #000000;
        }
      }
      div {
        width: 70%;
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 78px;
          height: 78px;
          background: #000000;
          border-radius: 50%;
        }
        span {
          width: 200px;
          color: #ffffff;
          &:nth-child(2) {
            font-size: 20px;
          }
          &:nth-child(3) {
            font-size: 18px;
          }
        }
      }
      p {
        width: 80px;
        height: 36px;
        background: rgba(255, 0, 0, 1);
        border-radius: 18px;
        color: #ffffff;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }
  /deep/.ivu-page {
    margin-top: 20px;
  }
}
</style>