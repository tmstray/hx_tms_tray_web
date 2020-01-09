<template>
    <router-view class="content" v-if="flag"></router-view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            
        }
    },
    computed:{
        ...mapState('tagsView', ['visitedViews']),
        flag(){
            if(this.visitedViews.length==0){
                return false
            }else{
                return true
            }
        }
    },
    mounted(){
        
    }

}
</script>

<style lang="scss" scoped>
</style>
