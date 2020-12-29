<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {}
};
</script>
<style>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ivu-modal {
  top: 0;
}
h5 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: normal;
}

/* 清浮动样式 */

* html .clearfix {
  zoom: 1;
}

* + html .clearfix {
  zoom: 1;
}

.clearfix:after {
  height: 0;
  visibility: hidden;
  content: ".";
  display: block;
  clear: both;
} /* 清浮动样式 */

* html .clearfix {
  zoom: 1;
}

* + html .clearfix {
  zoom: 1;
}

.clearfix:after {
  height: 0;
  visibility: hidden;
  content: ".";
  display: block;
  clear: both;
}
.ivu-page-item-active {
  border: none;
  background: #f2a500;
}
.ivu-page-item-active a,
.ivu-page-item-active:hover a {
  color: #fff;
}
.ivu-page-next,
.ivu-page-prev {
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding: 0 6px;
}
</style>
