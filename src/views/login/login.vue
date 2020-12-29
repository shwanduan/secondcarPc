<template>
  <div class="login clearfix">
    <div class="login_box">
      <div class="box">
        <p class="tit">
          <span>8亿</span>
          二手车服务平台
        </p>
        <div class="tell" style="margin-top:20px;width:100%;">
          <Input
            v-model="tell"
            clearable
            :number="true"
            @on-change="tell_msg=''"
            placeholder="手机号"
          />
          <p class="cash">{{tell_msg}}</p>
        </div>
        <div style="margin-top:10px;width:100%;">
          <div class="code">
            <Input v-model="code" clearable @on-change="code_msg=''" placeholder="验证码" />
            <Button style="color:#f2a500;" @click="get_img" v-if="code_show">获取短信验证</Button>
            <Button style="width:116px;" v-if="!code_show" disabled type="primary">{{time}}s后获取</Button>
          </div>
          <p class="cash">{{code_msg}}</p>
        </div>
        <div v-show="code_box">
          <slide-verify
            :l="42"
            :r="10"
            :w="310"
            :h="155"
            :imgs="imgs"
            v-if="img_show"
            @success="onSuccess"
            @fail="onFail"
            @refresh="onRefresh"
            :slider-text="text"
          ></slide-verify>
        </div>
        <Button type="warning" class="btn" @click="login">立即登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tell: "",
      tell_msg: "",
      code: "",
      code_msg: "",
      time: 0,
      code_show: true, //获取验证码按钮
      code_box: false, //图形盒子
      img_show: true, //图形 组件
      imgs: [],
      text: "请向右拖动滑块获取验证码",
      msg: ""
    };
  },
  created(){
    this.IEVersion();
  },
  methods: {
    //获取验证码
    get_code() {
      if (!this.tell) return (this.tell_msg = "*请输入手机号");
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.tell)) return (this.tell_msg = "*请输入正确的手机号");
      this.$Message.loading({
        content: "正在发送中...",
        duration: 5000
      });
      this.$post({
        url: "/app/auth/sendCode",
        noToken: true,
        data: {
          phone: this.tell,
          scene: "login"
        },
        success: res => {
          this.$Message.destroy();
          if (res.data.code == 1) {
            window.console.log("code", res);
            this.$Message.info("发送成功");
            this.code_show = false; //获取按钮 刷新
            this.time = 300;
            var timer = setInterval(() => {
              this.time--;
              if (this.time == 0) {
                clearInterval(timer);
                this.code_show = true;
              }
            }, 1000);
          } else this.$Message.error(res.data.msg);
        }
      });
    },
    //登录
    login() {
      if (!this.tell) return (this.tell_msg = "*请输入手机号");
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.tell)) return (this.tell_msg = "*请输入正确的手机号");
      if (!this.code) return (this.code_msg = "*请输入验证码");
      this.$post({
        url: "/app/auth/login",
        noToken: true,
        data: {
          mobile: this.tell,
          code: this.code,
          type: 3
        },
        success: res => {
          if (res.data.code == 1) {
            localStorage.setItem("token", res.data.data.token);
            this.$Message.info("登录成功");
            setTimeout(() => {
              this.$router.replace("/home");
            }, 1500);
          } else this.$Message.error(res.data.msg);
        }
      });
    },
    //显示 图形验证
    get_img() {
      if (!this.tell) return (this.tell_msg = "*请输入手机号");
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.tell)) return (this.tell_msg = "*请输入正确的手机号");
      this.code_box = true; //图形盒子
      this.img_show = true; //图像验证 刷新
    },
    //成功
    onSuccess() {
      this.code_box = false; //图形盒子
      this.img_show = false; //图像验证 刷新
      this.get_code();
    },
    //未匹配
    onFail() {
      this.$Message.error("匹配失败！");
    },
    //刷新
    onRefresh() {
      this.$Message.success("刷新成功！");
    },
    IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      var isIE11 =
        userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
      if (isIE) {
        this.$Message.error('此网站不兼容ie浏览器，请更换浏览器使用！');
      } else if (isEdge) {
         this.$Message.error('此网站不兼容ie浏览器，请更换浏览器使用！');
      } else if (isIE11) {
        this.$Message.error('此网站不兼容ie浏览器，请更换浏览器使用！');
      } else {
       console.log('不是ie浏览器');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100vh;
  min-height: 100%;
  position: absolute;
  background: url("../../assets/img/denglu_bj.png") no-repeat center top;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 100%;
    padding: 10px 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .box {
      padding: 15px 30px;
      background: #fff;
      border-radius: 10px;
      .tit {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #f2a500;
        margin-bottom: 15px;
        span {
          font-size: 16px;
          font-weight: bold;
        }
      }
      > div {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        .code {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .cash {
          box-sizing: border-box;
          width: 100%;
          text-align: left;
          font-size: 12px;
          color: #ff0000;
          padding: 4px;
        }
      }
      .btn {
        width: 100%;
        height: 36px;
        box-sizing: border-box;
        margin: 15px 0 5px 0;
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
</style>