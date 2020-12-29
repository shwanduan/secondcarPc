<template>
  <div div class="personal-box">
    <!-- 标题 -->
    <div class="personalBox-title">
      <span>在售车源</span>
      <!-- 搜索框 -->
      <div class="search-box" style="width:30%;">
        <Input style="width:90%;" search enter-button v-model="search" placeholder="请输入关键词搜索" @on-search="search_car" />
      </div>
    </div>
    <!-- 在售车源信息 -->
    <div class="personalList-box">
      <!-- 在售车源 -->
      <div class="carList-one" v-for="(item,index) in tableData.data" :key="index">
        <div class="imgbox">
          <!-- <img :src="httpPath + item.images[0]" /> -->
          <img v-lazy="httpPath+item.images[0]" @click="goDetail(item.id)" />
        </div>
        <h5 class="h5" @click="goDetail(item.id)">{{item.car_year_name}}</h5>
        <h5 class="h6" @click="goDetail(item.id)">{{item.mileage}}万公里/{{item.signtime | gettime}}/{{item.area}}</h5>
        <div>
          <p @click="goDetail(item.id)">{{item.trade_price}}万</p>
          <p>
            <span @click="unShelve(item)">下架</span>
            <span @click="goEdit(item.id)">编辑</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div style="text-align:center;padding-bottom:10px;">
      <Page :total="tableData.total" :page-size="Number(tableData.per_page)" :current="tableData.current_page" prev-text="上一页" next-text="下一页" @on-change="getData" />
    </div>
    <Modal title="提示" v-model="add_show" @on-ok="add_remove" class-name="vertical-center-modal">
      <p>确定要下架此车源？</p>
    </Modal>
    <Spin fix v-if="loading" style="z-index:5">
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script>
export default {
  name: "soldInOptions",
  data() {
    return {
      search: "",
      page: 1,
      tableData: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        data: [],
      },
      removeid: "",
      add_show: false,
      loading: false,
    }
  },
  filters: {
    gettime(data) {
      return data.split("-")[0] + "-" + data.split("-")[1]
    },
  },
  created() {
    this.get_Message()
  },
  methods: {
    //获取在售车源列表
    get_Message() {
      this.loading = true
      this.$get({
        url: "/app/product/pcmyproduct",
        data: {
          page: this.page,
          pageSize: 30,
        },
        success: (res) => {
          this.loading = false
          window.console.log("在售车源列表", res)
          this.tableData = res.data.data
        },
      })
    },
    //搜索
    search_car() {
      this.$get({
        url: "/app/product/pcproduct",
        data: {
          name: this.search,
          page: this.page,
        },
        success: (res) => {
          window.console.log("在售车源列表", res)
          this.tableData = res.data.data
        },
      })
    },
    //下架
    unShelve(item) {
      this.add_show = true
      this.removeid = item.id
    },
    add_remove() {
      this.$post({
        url: "/app/product/shelf",
        data: {
          id: this.removeid,
        },
        success: (res) => {
          window.console.log("下架", res)
          this.data = []
          this.page = 1
          this.get_Message()
          this.$Message.success("已下架")
        },
      })
    },
    //分页
    getData(page) {
      window.scrollTo(0, 60)
      this.page = page
      this.get_Message()
    },
    //跳转详情页
    goDetail(id) {
      let routeData = this.$router.resolve({
        name: "soldInOptionsDetails",
        query: { id },
      })
      window.open(routeData.href, "_blank")
      // this.$router.push({ name: "soldInOptionsDetails", query: { id } });
    },
    //跳转编辑页
    goEdit(id) {
      this.$router.push({ name: "soldEditor", query: { id } })
    },
  },
}
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

    .search-box {
      box-sizing: border-box;
      width: 40% !important;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /deep/ .ivu-input-search {
        background: #f2a500 !important;
        border-color: #f2a500 !important;
      }
    }
  }

  .personalList-box {
    width: 800px;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 20px;
    .carList-one {
      width: 30%;
      transition: all 0.5s;
      box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
      border-radius: 10px;
      margin: 10px;
      overflow: hidden;
      padding-bottom: 6px;
      .imgbox {
        width: 100%;
        height: 214px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .h5 {
        color: #333333;
        font-size: 16px;
        margin: 8px 0;
        padding-left: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-weight: normal;
      }
      .h6 {
        color: #999999;
        font-size: 16px;
        margin: 8px 0;
        padding-left: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-weight: normal;
      }
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 7px;
        p {
          font-size: 15px;
          font-weight: bold;
          color: rgba(255, 0, 0, 1);
        }
        span {
          display: inline-block;
          padding: 0 8px;
          border-radius: 13px;
          text-align: center;
          margin: 0 5px;
          cursor: pointer;
          &:nth-child(1) {
            border: 1px solid rgba(153, 153, 153, 1);
            color: #999999;
          }

          &:nth-child(2) {
            background: rgba(242, 165, 0, 1);
            color: #ffffff;
          }
        }
      }
    }
    .carList-one:hover {
      transform: scale(1.1);
    }
    /deep/.ivu-page {
      margin-top: 20px;
    }
  }
}
</style>