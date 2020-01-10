<template>
    <el-menu
        :collapse="isSidebarNavCollapse"
        background-color="#304156"
        text-color="#eee"
        active-text-color="#4dbcff"
        :default-active="currentMenu"
    >
        <DynamicMenu :menuList="menus"></DynamicMenu>
    </el-menu>
</template>

<script>
import DynamicMenu from '@/components/dynamic-menu'
import { mapState ,mapActions} from 'vuex'
import http from '@/config/httpConfig.js'
export default {
    data() {
        return {
            isCollapse: true,
            // sidebarMenu: [
        
            // ]
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse']),
        ...mapState('permission', [ 'currentMenu']),
        ...mapState('tagsView', [ 'menus','visitedViews','userinfo']),
    },
    methods: {

    },
    components: {
        DynamicMenu
    },
    mounted(){
        console.log("我输出了",this.userinfo.permissions[0])
        this.userinfo.permissions.forEach((item)=>{
            console.log(item)
        })
    },
    created(){
        
        if(this.menus.length=='0'){
            this.menus = []
            http.get('getRouters').then(res=>{
                for(let i=0;i<res.data.data.length;i++){
                    this.menus.push(res.data.data[i])
                }
            })
        }
    }
}
</script>
