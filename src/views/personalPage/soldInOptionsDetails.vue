<template>
  <div class="soldInOptionsDetails">
    <!-- 车辆详情介绍 -->
    <div class="carDetails">
      <!-- 标题 -->
      <div class="now-position">
        <div class="position-title">
          <!-- <span class="back" @click="back">返回上一页</span> -->
          <span>当前位置：商品详情页</span>
        </div>
        <!-- 卖车按钮 -->
        <div class="sellCar-btn">
          <button @click="releaseCarSource">我要卖车</button>
        </div>
      </div>
      <!-- 车辆介绍 -->
      <div class="car-introduce">
        <div class="introduce">
          <div class="carImg">
            <img :src="httpPath + list.images[showImg_index]" class="first-image" />
            <div class="carImg-tab">
              <img src="../../assets/img/xiangqing_left.png" @click="showImg(0)" alt />
              <div>
                <img v-for="(item,index) in list.images" :key="item" :src="httpPath + item" class="car-pic" ref="img_bor" :class="showImg_index==index?'img_bor':''" @click="showImg_index=index" />
              </div>
              <img src="../../assets/img/xiangqing_right.png" @click="showImg(1)" alt />
            </div>
          </div>
          <div class="text-introduce">
            <p>发布时间：{{list.create_time}}</p>
            <p>{{list.car_year_name}}</p>
            <p>
              <span>￥</span>
              <span>{{list.trade_price}}万</span>
              <span>车源编号：{{user.code}}</span>
            </p>
            <div class="car-card">
              <div>
                <p>行驶里程</p>
                <p>{{list.mileage}}万公里</p>
              </div>
              <span></span>
              <div>
                <p>上牌日期</p>
                <p>{{list.signtime |gettime}}</p>
              </div>
              <span></span>
              <div>
                <p>排量(L/T)</p>
                <p>{{list.output}}</p>
              </div>
              <span></span>
              <div>
                <p>车辆所在地</p>
                <p>{{list.area}}</p>
              </div>
            </div>
            <div class="consult">
              <button @click="goToDialog">咨询中心</button>
            </div>
            <p class="tit">安全提示：本平台所有二手车源信息均由会员自行发布，显示的车源信息内容仅供参考使用，交易时请以专业机构复检车况为准。在没有对车况以及合同内容确认无误之前，请不要支付任何费用。</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 车辆信息和图片 -->
    <div class="car-content">
      <div class="tit-box">
        <p :class="tit_index==1?'tit':''" @click="tit_index=1">车辆信息</p>
        <p :class="tit_index==2?'tit':''" @click="tit_index=2">车辆图片</p>
      </div>
      <div class="box">
        <div class="message-box" v-if="tit_index==1">
          <div class="car-message">
            <div class="left-carMessage">
              <p>
                上牌日期：
                <span>{{list.signtime |gettime}}</span>
              </p>
              <p>
                排量(T/L)：
                <span>{{list.output}}</span>
              </p>
              <p>
                车辆类型：
                <span>{{list.car_category}}</span>
              </p>
              <p>
                公里数：
                <span>{{list.mileage}}万公里</span>
              </p>
            </div>
            <div class="right-carMessage">
              <p>
                车身颜色：
                <span>{{list.color}}</span>
              </p>
              <p>
                排放标准：
                <span>{{list.discharge}}</span>
              </p>
              <p>
                动力类型：
                <span>{{list.fuel_type_name}}</span>
              </p>
              <p>
                变速箱：
                <span v-if="list.speed_type==1">自动</span>
                <span v-if="list.speed_type==2">手动</span>
                <span v-if="list.speed_type==3">手自动一体</span>
              </p>
            </div>
          </div>
        </div>
        <div class="car-image" v-if="tit_index==2">
          <div class="carImage-box" v-for="item in list.images" :key="item.name">
            <img :src="httpPath+item" />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗1 -->
    <div class="dialog-1" v-if="isDialog">
      <div class="dialog-1-div">
        <div>
          <p class="title">温馨提示</p>
          <p class="phone">平台电话：{{tell}}</p>
          <div class="button">
            <button @click="close">确定</button>
          </div>
        </div>
        <div class="close" @click="close"></div>
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
  name: "soldInOptionsDetails",
  data() {
    return {
      id: this.$route.query.id,
      showImg_index: 0, //图片显示
      tit_index: 1, //文字
      isDialog: false, //平台客服
      list: { images: [] },
      user: {},
      order_list: {},
      tell: {},
      loading: true,
    }
  },
  filters: {
    gettime(data) {
      return data.split("-")[0] + "-" + data.split("-")[1]
    },
  },
  created() {
    this.get_carInfo()
    // 客服电话
    this.$get({
      //   url: "/app/service/getservice",
      url: "/app/product/showEnterprise",
      data: {
        product_id: this.id,
      },
      success: (res) => {
        window.console.log("客服", res)
        this.tell = res.data.data
      },
    })
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    // 车源详情
    get_carInfo() {
      this.loading = true
      this.$get({
        url: "/app/product/pcproduct",
        data: {
          id: this.id,
        },
        success: (res) => {
          window.console.log("详情", res)
          this.loading = false
          this.list = res.data.data
          this.user = res.data.data.user
          //车型id 车体颜色id 排量
          this.getorder_list(
            res.data.data.car_category_id,
            res.data.data.car_color_id,
            res.data.data.output
          )
        },
      })
    },
    // 弹窗
    goToDialog() {
      this.isDialog = true
    },
    close() {
      this.isDialog = false
    },
    releaseCarSource() {
      this.$router.push({ name: "releaseCarSource" })
    },
    showImg(key) {
      let length = this.list.images.length
      window.console.log(length, this.$refs.img_bor)
      if (key == 0) {
        if (this.showImg_index == 0) this.showImg_index = 0
        else this.showImg_index--
      } else {
        if (this.showImg_index == length - 1) this.showImg_index = length - 1
        else this.showImg_index++
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.soldInOptionsDetails {
  width: 1200px;
  background: #f9f9f9;
  box-shadow: 0px 2px 12px 1px rgba(153, 153, 153, 0.3);
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 180px;
  .carDetails {
    width: 100%;
    height: 670px;
    background-color: rgba(255, 255, 255, 1);
    .now-position {
      width: 100%;
      height: 60px;
      background: rgba(255, 255, 255, 1);
      border-bottom: 1px solid #eeeeee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .position-title {
        margin-left: 20px;
        line-height: 60px;
        .back {
          color: #f2a500;
          margin-right: 15px;
          cursor: pointer;
          padding: 4px 8px;
          border-width: 1px;
          border-style: solid;
          border-color: #fff;
        }
        .back:hover {
          border-color: #f2a500;
          border-radius: 8px;
        }
        span {
          font-size: 16px;
          color: rgba(153, 153, 153, 1);
        }
      }
      .sellCar-btn {
        margin-right: 20px;
        button {
          width: 120px;
          height: 44px;
          background: rgba(0, 0, 0, 1);
          border-radius: 8px;
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(242, 165, 0, 1);
          line-height: 38px;
          text-align: center;
          outline: none;
          border: none;
          cursor: pointer;
        }
      }
    }
    .car-introduce {
      width: 1160px;
      height: 550px;
      margin: 20px auto;
      .introduce {
        display: flex;
        .carImg {
          position: relative;
          .first-image {
            width: 480px;
            height: 480px;
          }
          .carImg-tab {
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            > div {
              width: 400px;
              overflow-y: auto;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .car-pic {
                flex-shrink: 0;
                box-sizing: border-box;
                width: 80px;
                height: 80px;
                padding: 4px;
              }
              .img_bor {
                border: 1px solid #f2a500;
              }
            }
            /*滚动条样式*/
            > div::-webkit-scrollbar {
              /*滚动条整体样式*/
              width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
              height: 10px;
            }
            > div::-webkit-scrollbar-thumb {
              /*滚动条里面小方块*/
              border-radius: 8px;
              -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              background: rgba(0, 0, 0, 0.2);
            }
            > div::-webkit-scrollbar-track {
              /*滚动条里面轨道*/
              -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              border-radius: 0;
              background: rgba(0, 0, 0, 0.1);
            }
          }
        }
        .text-introduce {
          margin: 20px;
          p {
            &:nth-child(1) {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
            }
            &:nth-child(2) {
              font-size: 22px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(0, 0, 0, 1);
              margin: 20px 0;
            }
            &:nth-child(3) {
              color: #f2a500;
              span {
                font-size: 16px;
                &:nth-child(2) {
                  font-size: 24px;
                }
                &:nth-child(3) {
                  color: #666666;
                  font-size: 17px;
                  margin-left: 30px;
                }
              }
            }
          }
          .car-card {
            display: flex;
            border: 1px solid rgba(238, 238, 238, 1);
            text-align: center;
            justify-content: space-around;
            align-items: center;
            margin: 20px 0;
            padding: 20px 0;
            div {
              display: flex;
              flex-direction: column;
              width: 160px;
              text-align: center;
              justify-content: center;
              p {
                &:nth-child(1) {
                  font-size: 16px;
                  color: #666666;
                  line-height: 30px;
                }
                &:nth-child(2) {
                  font-size: 20px;
                  color: #333333;
                  margin: 0;
                  line-height: 30px;
                }
              }
            }
            span {
              width: 1px;
              height: 40px;
              background: rgba(238, 238, 238, 1);
            }
          }
          .consult {
            margin-top: 60px;
            text-align: center;
            button {
              width: 310px;
              height: 52px;
              background: rgba(242, 165, 0, 1);
              border-radius: 8px;
              border: none;
              outline: none;
              font-size: 20px;
              color: #ffffff;
              cursor: pointer;
            }
          }
          .tit {
            padding-top: 15px;
            color: #ccc;
            font-size: 15px;
          }
        }
      }
    }
  }
  .car-content {
    width: 100%;
    margin-top: 10px;
    background-color: #ffffff;
    .tit-box {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      > p {
        font-size: 18px;
        padding: 12px 20px;
        color: #000000;
        background: #ffffff;
        cursor: pointer;
      }
      .tit {
        color: #f2a500;
        background: #000;
      }
    }
    .box {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      .message-box {
        width: 1160px;
        height: 279px;
        border: 1px solid rgba(238, 238, 238, 1);
        margin: 0 auto;
        padding: 50px;
        .car-message {
          display: flex;
          .left-carMessage,
          .right-carMessage {
            width: 400px;
            p {
              height: 52px;
              font-size: 16px;
              color: #000000;
              span {
                &:nth-child(1) {
                  color: #999999;
                }
              }
            }
          }
        }
      }
      .car-image {
        width: 1160px;
        border: 1px solid rgba(238, 238, 238, 1);
        margin: 0 auto;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .carImage-box {
          width: 48%;
          height: 300px;
          box-sizing: border-box;
          padding-bottom: 10px;
          > img {
            width: 100%;
            max-width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .dialog-1 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .dialog-1 {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .dialog-1 .dialog-1-div {
    height: 200px;
    width: 25%;
    position: fixed;
    top: 50%;
    border-radius: 5px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
    background: #ffffff;
    color: #666666;
    font-size: 15px;
    text-align: center;
    .title {
      color: #333333;
      padding-top: 10px;
    }
    .phone {
      color: #999999;
      margin-top: 5px;
      padding: 20px 0;
    }
    .button {
      button {
        margin-top: 10px;
        background: #f2a500;
        color: #ffffff;
        border: none;
        width: 30%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-bottom: 20px;
      }
    }
    .close {
      position: absolute;
      background: url("../../assets/img/tankuang_close.png") no-repeat;
      width: 35px;
      height: 35px;
      border-radius: 20px;
      left: 50%;
      bottom: -110px;
      transform: translate(-50%, 0);
      background-size: 100% 100%;
    }
  }
}
</style>