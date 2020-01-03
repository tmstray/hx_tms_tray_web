<template>
    <el-menu
        :collapse="isSidebarNavCollapse"
        background-color="#304156"
        text-color="#eee"
        active-text-color="#4dbcff"
        :default-active="currentMenu"
    >
        <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
    </el-menu>
</template>

<script>
import DynamicMenu from '@/components/dynamic-menu'
import { mapState } from 'vuex'
import http from '@/config/httpConfig.js'

export default {
    data() {
        return {
            isCollapse: true,
            sidebarMenu: [
        
            ]
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse']),
        ...mapState('permission', [ 'currentMenu'])
    },
    methods: {},
    components: {
        DynamicMenu
    },
    mounted(){
        http.get('getRouters').then(res=>{
            this.sidebarMenu = res.data.data
        })
    }
}
</script>
