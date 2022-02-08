<template>
  <div></div>
</template>

<script>
import { activateUser } from '@/api/user'
export default {
  name: 'Active',
  mounted () {
    let queryStr = window.location.href.replace(/.*\?/, '')
    activateUser(queryStr).then((res) => {
      this.$alert(res.msg)
      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    })
  }
}

</script>

<style scoped>

</style>
