<template>
  <div class="privacyPolicy">
    <div class="privacyPolicy-title">
      <span>隐私政策</span>
    </div>
    <div class="privacyPolicy-text">
      <p v-html="content"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "privacyPolicy",
  data() {
    return {
        content:''
    };
  },
  created() {
    this.get_text();
  },
  methods: {
    get_text() {
      this.$get({
        url: "/app/auth/getprivacy",
        data: {
        },
        success: res => {
          window.console.log("联系我们", res);
          this.content = res.data.data;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.privacyPolicy {
  width: 1200px;
  min-height: 1012px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 180px;
  .privacyPolicy-title {
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid #eeeeee;
    display: flex;
    align-items: center;
    span {
      color: #000000;
      font-size: 20px;
      margin: 0 auto;
    }
  }
  .privacyPolicy-text {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 16px;
    color: #000000;
    p{
        padding-bottom: 100px;
    }
  }
}
</style>