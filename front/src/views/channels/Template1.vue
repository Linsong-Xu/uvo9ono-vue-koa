<template>
  <div class="layui-container">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8">
        <uvo9ono-list></uvo9ono-list>
      </div>
      <div class="layui-col-md4">
        <uvo9ono-hotlist></uvo9ono-hotlist>
        <uvo9ono-ads></uvo9ono-ads>
        <uvo9ono-links></uvo9ono-links>
      </div>
    </div>
  </div>
</template>

<script>
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import Links from '@/components/sidebar/Links'
import List from '@/components/contents/List'
export default {
  name: 'template1',
  components: {
    'uvo9ono-hotlist': HotList,
    'uvo9ono-ads': Ads,
    'uvo9ono-links': Links,
    'uvo9ono-list': List
  }
}
</script>

<style lang="scss" scoped>
</style>
