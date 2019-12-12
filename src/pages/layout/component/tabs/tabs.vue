/*
 *@description: tag页签
 *@author: lichenxi (2019-9-26 15:20)
 */
<template>
    <div>
        <el-tabs
            v-model="activeTab"
            type="card"
            :closable="visitedViews.length > 1"
            @tab-remove="onTabsRemoved"
            @tab-click="onTabSelect"
        >
            <el-tab-pane
                v-for="item in visitedViews"
                :key="item.name"
                :label="item.meta.name"
                :params="item.params"
                :myQuery="item.query"
                :name="item.name"
            ></el-tab-pane>
        </el-tabs>

        <!-- 退出按钮 -->
        <div class="aside__top--right">
            <div class="user-msg">
                <img class="user-img" :src="avatar" alt />
                <span class="user-name">{{account}}</span>
                <el-dropdown trigger="click" placement="top">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="quit-system">
                <el-button @click="loginOut" class="logout-button" size='mini'>登出</el-button>
            </div>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
import { mapState, mapActions } from 'vuex'
export default {
    name: '',
    data() {
        return {
            tabClosable: true,
            activeTab: '',
            tabIndex: 2,
            lastActTab: ''
        }
    },
    watch: {
        $route(a) {
            this.addTag()
        }
    },
    computed: {
        ...mapState('tagsView', ['visitedViews', 'cachedViews']),
        ...mapState('permission', ['avatar', 'account'])
    },
    created() {
        this.activeTab = this.$route.name
        this.addView(this.$route)
    },
    methods: {
        ...mapActions('tagsView', ['addView', 'delView']),
        // 新增tab
        addTag() {
            this.addView(this.$route)
            this.activeTab = this.$route.name
        },
        // tab页签选中事件
        onTabSelect(selTab) {
            this.$router.push({
                name: selTab.name,
                params: selTab.$attrs.params,
                query: selTab.$attrs.myQuery
            })
        },
        // tab页签关闭事件
        onTabsRemoved(targetName) {
            this.delView(targetName).then(res => {
                let nextTab =
                    res.visitedViews[res.delIndex - 1] ||
                    res.visitedViews[res.delIndex + 1]
                if (nextTab) {
                    this.$router.push({
                        name: nextTab.name,
                        params: nextTab.params,
                        query: nextTab.myQuery
                    })
                }
            })
        },
        loginOut() {
            console.log('this', this)
            this.$store.commit('LOGIN_OUT')
            this.$router.push({ path: '/login' })
            /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
            // window.location.reload()
        }
    }
}
</script>

<style scoped lang = "scss">
.aside__top--right {
    position: absolute;
    right: 10px;
    top: 20px;
    bottom: 0px;
    height: 56px;
    > div {
        position: relative;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        margin-left: 10px;
        padding: 0 15px;
        cursor: pointer;
        &:first-child:before {
            border: none;
        }
        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background: #ef4747;
            transform: scaleX(0);
            transform-origin: right 0;
            transition: transform 0.5s;
        }
        &::before {
            content: '';
            position: absolute;
            height: 20px;
            top: 50%;
            left: -8px;
            margin-top: -10px;
            border-left: 1px solid #ccc;
        }
        &.email {
            i {
                position: absolute;
                left: 18px;
                top: -12px;
                border-radius: 20px;
                background: red;
                color: #fff;
                text-align: center;
                font-size: 12px;
                line-height: 1.5;
                min-width: 20px;
                min-height: 20px;
            }
        }
        &.user-msg {
            .user-img {
                width: 34px;
                height: 34px;
                border-radius: 50%;
                vertical-align: middle;
            }
            .user-name {
                color: #758eb5;
                padding: 0 4px;
            }
        }
        .iconfont {
            position: relative;
            font-size: 24px;
            color: #758eb5;
        }
    }
}

.logout-button {}
</style>
