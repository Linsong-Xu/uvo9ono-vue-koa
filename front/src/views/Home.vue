
<template>
  <div>
    <uvo9ono-panel></uvo9ono-panel>
    <router-view></router-view>
  </div>
</template>

<script>
import Panel from '@/components/Panel'

export default {
  name: 'home',
  components: {
    'uvo9ono-panel': Panel
  }
}
</script>

<style lang="scss" scoped>
</style>
