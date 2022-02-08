<template>
  <div class="layui-container">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8">
        <uvo9ono-top></uvo9ono-top>
        <uvo9ono-list></uvo9ono-list>
      </div>
      <div class="layui-col-md4">
        <uvo9ono-tips></uvo9ono-tips>
        <uvo9ono-sign></uvo9ono-sign>
        <uvo9ono-hotlist></uvo9ono-hotlist>
        <uvo9ono-ads></uvo9ono-ads>
        <uvo9ono-links></uvo9ono-links>
      </div>
    </div>
  </div>
</template>

<script>
import Tips from '@/components/sidebar/Tips'
import Sign from '@/components/sidebar/Sign'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import Links from '@/components/sidebar/Links'
import List from '@/components/contents/List'
import Top from '@/components/contents/Top'
export default {
  name: 'index',
  components: {
    'uvo9ono-tips': Tips,
    'uvo9ono-sign': Sign,
    'uvo9ono-hotlist': HotList,
    'uvo9ono-ads': Ads,
    'uvo9ono-links': Links,
    'uvo9ono-list': List,
    'uvo9ono-top': Top
  }
}
</script>

<style lang="scss" scoped>
</style>
