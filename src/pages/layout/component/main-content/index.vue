<template>
    <div class="main-container">
        <TopAside/>
        <TopTabs/>
        <Content/>
    </div>
</template>

<script>
import TopTabs from '../tabs/tabs'
import TopAside from './top-aside'
import Content from './content'
import { mapState,mapActions } from 'vuex'

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
    },
    methods:{
        
    },
    mounted(){
    }
}
</script>
