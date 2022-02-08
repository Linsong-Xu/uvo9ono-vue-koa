<template>
  <div class="fly-footer">
    <p>
      <a href="" target="_blank">uvo9ono技术社区</a> 2019 &copy;
      <a href="" target="_blank">xls56i 出品</a>
    </p>
    <p>
      <a href="" target="_blank">加入团队</a>
      <a href="" target="_blank">React</a>
      <a
        href="javascript:void(0)"
        @mouseover="show()"
        @mouseout="hide()"
        style="position:relative;"
      >
        微信号
        <img class="qr" v-if="isShow" src="../assets/img/adu2670.jpg" alt />
      </a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      setTimeout(() => {
        this.isShow = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.qr {
  width: 120px;
  height: 120px;
  position: absolute;
  left: 0;
  top: -130px;
}
</style>
