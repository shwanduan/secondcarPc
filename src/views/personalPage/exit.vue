<template>
  <div div
       class="personal-box">
    <div class="personalBox-title">
      <span>退出</span>
    </div>
    <div class="personalList-box">
      <div class="exit-box">
        <p>温馨提示</p>
        <p>确定退出账号吗？</p>
        <Button type="warning"
                @click="quit">确定</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "exit",
  data () {
    return {};
  },
  methods: {
    quit () {
      this.$get({
        url: "/app/auth/quit",
        success: res => {
          window.console.log("退出", res);
          if (res.data.code == 1) {
            this.$Message.success('退出登录成功');
            localStorage.removeItem("token");
            setTimeout(() => {
              this.$router.replace({ name: 'login' })
            }, 1000);
          } else {
            this.$Message.warning(res.data.msg);
          }
        }
      });
    }
  },
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
    padding-bottom: 300px;
    .exit-box {
      display: flex;
      flex-direction: column;
      width: 540px;
      height: 294px;
      background: rgba(245, 245, 245, 1);
      border-radius: 10px;
      margin: 0 auto;
      p {
        margin: 15px 0;
        text-align: center;
        &:nth-child(1) {
          font-size: 24px;
          color: #000000;
        }
        &:nth-child(2) {
          font-size: 20px;
          color: #999999;
        }
      }
      button {
        width: 290px;
        height: 52px;
        margin: 50px auto 0;
        color: #ffffff;
      }
    }
  }
}
</style>