<template>
  <div class="news">
    <div class="mainBox">
      <Tabs v-model="key" @on-click="click_tit">
        <Tab-pane label="新闻资讯" key="0">
          <div class="itemBox" v-for="val in tableData.data" :key="val.id">
            <div class="imgBox clearfix">
              <div class="phoBox">
                <img :src="httpPath+val.img" alt />
              </div>
              <div class="textBox">
                <p class="ttl">
                  <span class="tit">{{val.title}}</span>
                  <span class="time">{{val.create_time}}</span>
                </p>
                <p class="text">
                  <span class="tit">{{val.instro}}</span>
                  <span @click="goDetail(val)" class="more">查看全文</span>
                </p>
              </div>
            </div>
          </div>
        </Tab-pane>
        <Tab-pane label="系统消息" key="1">
          <div class="itemBox" v-for="val in tableData.data" :key="val.id">
            <div class="imgBox clearfix">
              <div class="textBox">
                <p class="ttl">
                  <span class="tit">{{val.title}}</span>
                  <span class="time">{{val.create_time}}</span>
                </p>
                <p class="text">
                  <span class="tit">{{val.instro}}</span>
                  <span @click="goDetail(val)" class="more">查看全文</span>
                </p>
              </div>
            </div>
          </div>
        </Tab-pane>
      </Tabs>
      <div class="page_box">
        <Page
          :total="tableData.total"
          :page-size="tableData.per_page"
          :current="tableData.current_page"
          prev-text="上一页"
          next-text="下一页"
          @on-change="getDatapage"
        />
      </div>
    </div>
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
export default {
  name: "news",
  data() {
    return {
      type: 1,
      loading: false,
      tableData: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
        data: []
      },
      page: 1
    };
  },
  created() {
    this.type = Number(this.key + 1);
    this.getData();
  },
  computed: {
    key: {
      get() {
        if (this.$route.query.key) return Number(this.$route.query.key);
        else return 0;
      },
      set() {}
    }
  },
  watch: {
    key(data) {
      this.type = Number(data + 1);
      this.getData();
    }
  },
  methods: {
    getData() {
      this.tableData = {};
      this.loading = true;
      this.$get({
        url: "/app/message/index",
        data: { type: this.type, page: this.page },
        success: res => {
          this.loading = false;
          window.console.log("消息-type", this.type, res);
          this.tableData = res.data.data;
        }
      });
    },
    click_tit(name) {
      this.type = Number(name + 1);
      this.tableData = {};
      this.getData();
    },
    //跳转商品详情
    goDetail(val) {
      let routeData = this.$router.resolve({
        name: "newsDetail",
        query: { id: val.id }
      });
      window.open(routeData.href, "_blank");
      // this.$router.push({ name: "newsDetail", query: { id: val.id } });
    },
    //分页
    getDatapage(page) {
      this.page = page;
      this.tableData = {};
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.news {
  .mainBox {
    margin: 20px auto 60px;
    padding-bottom: 30px;
    width: 1200px;
    box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
    background-color: white;
    /deep/.ivu-tabs-ink-bar {
      height: 0;
    }
    /deep/.ivu-tabs-nav {
      /deep/.ivu-tabs-tab {
        margin-right: 0;
        padding: 20px 30px;
        color: #000000;
        font-size: 20px;
        line-height: 1;
      }
      /deep/.ivu-tabs-tab-active {
        color: #f2a500;
        background-color: #000000;
      }
    }
    .itemBox {
      margin: 0 100px 20px;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #eeeeee;
      &:last-child {
        margin-bottom: 0;
      }
      .imgBox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .phoBox {
          margin-right: 20px;
          float: left;
          img {
            width: 140px;
            height: auto;
            display: block;
          }
        }
        .textBox {
          flex: 1;
          .ttl {
            margin-bottom: 10px;
            color: #000000;
            font-size: 20px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tit {
              width: 75%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              font-weight: normal;
            }
            .time {
              width: 20%;
              color: #999999;
              font-size: 16px;
            }
          }
          .text {
            color: #666666;
            font-size: 18px;
            line-height: 1.7;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .tit {
              max-width: 75%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              font-weight: normal;
            }
            .more {
              padding: 0 20px;
              display: inline-block;
              color: #f2a500;
              font-size: 22px;
              background: url("../../assets/img/news_up.png") no-repeat center
                right;
              cursor: pointer;
            }
          }
        }
      }
    }
    .page_box {
      width: 100%;
      text-align: center;
      margin-top: 80px;
    }
  }
}
</style>
