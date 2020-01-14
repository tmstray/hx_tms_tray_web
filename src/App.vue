<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import Mycontent from './pages/layout/index.vue'
import http from '@/config/httpConfig.js'
export default {
    name: 'App',
    components: {
        // Mycontent
    },
    destroyed(){
      http.get('/transport/stop').then(res=>{})
    }
}
</script>

<style lang="scss">
#app {
    height: 100%;
    > div {
        height: 100%;
    }
}
</style>
