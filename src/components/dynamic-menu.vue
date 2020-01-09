<template>
  <div class="menu-container">
    <template v-for="v in menuList">
      <el-submenu
        :index="v.name"
        v-if="v.children&&v.children.length>0"
        :key="v.name"
       >
        <template slot="title">
          <i
            class='iconfont'
            :class='v.meta.icon'
          ></i>
          <!-- <svg-icon
            v-if="v.meta&&v.meta.icon"
            :icon-class="v.meta.icon"
          ></svg-icon> -->
          <span>{{v.meta.title}}</span>
        </template>
        <el-menu-item-group>
          <my-nav :menuList="v.children"></my-nav>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item
        :key="v.name"
        :index="v.name"
        @click="gotoRoute(v)"
        v-else
      >
        <i
          class='iconfont'
          :class='v.meta.icon'
        ></i>
        <span slot="title">{{v.meta.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'my-nav',
    props: {
        menuList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    methods: {
        gotoRoute(v) {
            //判断是否是当前路由
            if(v.path=="home"){
                this.$router.push({
                    path: 'redirect',
                    query: v.path
                })
            }
            var name = v.path
            // 像topTab添加标签
            this.addView(v)
            for(let i=0;i<this.visitedViews.length;i++){
              if(this.visitedViews[i].params==undefined){
                this.visitedViews.splice(i,1)
              }
            }
            this.$router.push({ name })
        },
        ...mapActions('tagsView', ['addView'])
    },
    created() {
    },
    computed: {
        ...mapState('tagsView', ['visitedViews', 'cachedViews']),
        
    }
}
</script>

<style lang='scss'>
.menu-container {
    .svg-icon {
        margin-right: 10px;
    }
}
</style>
