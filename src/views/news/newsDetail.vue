<template>
  <div class="news">
    <div class="mainBox">
      <h2 class="headLine01">查看全文</h2>
      <div class="content">
        <h3 class="headLine02">{{data.title}}</h3>
        <p class="time">{{data.create_time}}</p>
        <p class="text">{{data.instro}}</p>
        <div class="photo"
             v-html="data.content">
        </div>
      </div>
    </div>
    <Spin fix
          v-if="loading">
      <Icon type="ios-loading"
            size=20
            class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
export default {
  name: "news",
  data () {
    return {
      id: this.$route.query.id,
      data: {},
      loading: false,
    }
  },
  created () {
    this.loading=true;
    this.$get({
      url: "/app/message/index",
      data: { id: this.id },
      success: res => {
        this.loading=false;
        window.console.log("消息", res)
        this.data = res.data.data;
        if (res.data.data.is_read == 0) {
          this.readMessage();
        }
      }
    });
  },
  methods: {
    readMessage () {
      this.$post({
        url: "/app/message/readMessage",
        data: { id: this.id },
        success: res => {
          window.console.log("读取消息", res);
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.news {
  .mainBox {
    margin: 20px auto 60px;
    padding-bottom: 100px;
    width: 1200px;
    box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
    background-color: white;
    .headLine01 {
      margin-bottom: 40px;
      padding: 20px 0;
      color: #000000;
      font-size: 20px;
      font-weight: 400;
      text-align: center;
      border-bottom: 1px solid #eeeeee;
    }
    .content {
      margin: 0 auto;
      width: 960px;
      .headLine02 {
        margin-bottom: 10px;
        color: #000000;
        font-size: 20px;
        font-weight: 400;
        text-align: center;
      }
      .time {
        margin-bottom: 10px;
        color: #999999;
        font-size: 16px;
        text-align: center;
      }
      .text {
        margin-bottom: 20px;
        color: #666666;
        font-size: 18px;
        line-height: 1.7;
      }
      .photo {
        /deep/img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        /deep/video {
          max-width: 100%;
          height: auto;
          display: block;
        }
      }
    }
  }
}
</style>
