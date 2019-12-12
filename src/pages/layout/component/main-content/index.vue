<template>
    <div class="main-container">
        <TopTabs/>
        <TopAside/>
        <Content/>
    </div>
</template>

<script>
import TopTabs from '../tabs/tabs'
import TopAside from './top-aside'
import Content from './content'
import { mapState } from 'vuex'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapState(['isSidebarNavCollapse'])
    },
    components: {
        TopAside,
        Content,
        TopTabs
    }
}
</script>
