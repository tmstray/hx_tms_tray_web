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
    mounted(){
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    },
    methods:{
       beforeunloadHandler(){
        alert("1111111")
      },
    },
    destroyed:function(){
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
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
