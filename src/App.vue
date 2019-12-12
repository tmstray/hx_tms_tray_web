<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import Mycontent from './pages/layout/index.vue'
export default {
    name: 'App',
    components: {
        // Mycontent
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
