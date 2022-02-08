<template>
  <div class="modal" v-show="isShow">
    <div class="mask" @click="close()"></div>
    <div class="layui-layer layui-layer-page" :class="{'active': isShow}">
      <div class="layui-layer-title">
        签到活跃榜 - TOP
        <i class="layui-icon layui-icon-close pull-right" @click="close()"></i>
      </div>
      <div class="layui-layer-content pd0">
        <div class="layui-tab layui-tab-brief">
          <ul class="layui-tab-title">
            <li :class="{'layui-this': current === 0 }" @click="choose(0)">最新签到</li>
            <li :class="{'layui-this': current === 1 }" @click="choose(1)">今日最快</li>
            <li :class="{'layui-this': current === 2 }" @click="choose(2)">总签到榜</li>
          </ul>
          <div class="layui-tab-content">
            <ul class="layui-tab-item layui-show">
                <template v-if="current !== 2">
                  <li v-for="(item,index) in lists" :key="'sign' + index">
                    <img :src="item.uid.pic" alt class="mr1" />
                    <router-link :to="{name: 'home', params:{uid:item.uid._id}}">
                      <cite class="fly-link">{{item.uid.name}}</cite>
                    </router-link>
                    <span class="fly-grey">签到于 {{item.created | moment}}</span>
                  </li>
                </template>
                <template v-else>
                  <li v-for="(item,index) in lists1" :key="'sign' + index">
                    <img :src="item.pic" alt class="mr1" />
                    <router-link :to="{name: 'home', params:{uid:item._id}}">
                      <cite class="fly-link">{{item.name}}</cite>
                    </router-link>
                    <span class="fly-grey">
                      已经连续签到
                      <i class="orange">{{item.count}}</i>天
                    </span>
                  </li>
                </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNewestSign, getEarlyestSign, getTopSign } from '@/api/user'
export default {
  name: 'sign-list',
  props: {
    isShow: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      current: 0,
      lists: [],
      lists1: []
    }
  },
  mounted () {
    // this.choose(0)
  },
  methods: {
    choose (val) {
      this.current = val
      // 请求后台拉取数据
      if (val === 0) {
        // 拉取最新签到
        getNewestSign().then((res) => {
          if (res.code === 200) {
            this.lists = res.data
            // console.log(this.lists)
          }
        })
      } else if (val === 1) {
        // 拉取今日最快
        getEarlyestSign().then((res) => {
          if (res.code === 200) {
            this.lists = res.data
          }
        })
      } else {
        // 拉取总签到榜
        getTopSign().then((res) => {
          if (res.code === 200) {
            this.lists1 = res.data
          }
        })
      }
    },
    close () {
      this.$emit('closeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
