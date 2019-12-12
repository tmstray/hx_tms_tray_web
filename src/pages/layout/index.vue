<template>
    <div :class="{navCollapsed:isSidebarNavCollapse}">
        <sidebarNav  class="sidebar"/>
        <mainContent/>
    </div>
</template>

<script>
// import topTabs from './component/tabs/tabs'
import sidebarNav from './component/sidebar-nav'
import mainContent from './component/main-content/index'
import { mapState } from 'vuex'
export default {
    data() {
        return {}
    },
    computed: {
        ...mapState(['isSidebarNavCollapse'])
    },
    components: {
        sidebarNav,
        mainContent

    }
}
</script>

<style lang="scss" scoped>

</style>
