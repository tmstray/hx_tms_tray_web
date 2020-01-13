<template>
    <aside class="aside__top">
        <!-- <span
            class="iconfont icon-nav toggleNavCollapse"
            :class="{active:isSidebarNavCollapse}"
            @click="toggleNavCollapse"
        >
        </span> -->
        <!-- <el-breadcrumb separator="/">
            <transition-group name="breadcrumb"> -->
                <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
                <!-- <template v-for="(route,i) in crumbList">
                    <el-breadcrumb-item
                        :key="route"
                        :class="{'is-last-link':i==crumbList.length-1}"
                    >
                        {{route}}
                    </el-breadcrumb-item>
                </template>
            </transition-group>
        </el-breadcrumb> -->
        <div class="aside__top--right">
            <div class="user-msg">
                <img class="user-img" :src="avatar" alt="">
                欢迎
                <span class="user-name" v-if="account">{{account}}</span>
                <span class="user-name" v-else>{{userName}}</span>
                <el-dropdown trigger="click" placement="top" @command="handleCommand"> 
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">个人中心</el-dropdown-item>
                        <el-dropdown-item command="2" v-if='isShow'>修改密码</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="quit-system" @click="loginOut">
                <el-button  class="logout-button" size='mini'>登出</el-button>
            </div>
        </div>
        <el-dialog title="修改密码" 
            :visible.sync="isDialog" 
            :modal-append-to-body="false" 
            :before-close="cancel" 
            style="width:70%;margin:auto;margin-top:50px;"
            :close-on-click-modal="false"
            append-to-body>
          <el-form>
              <el-row :gutter="24">
                <el-col :span="18">
                  <el-form-item label="原密码" :label-width="formLabelWidth">
                    <el-input v-model="originPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="18">
                  <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input v-model="newPassword" :type="'password'"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="18">
                  <el-form-item label="确认密码" :label-width="formLabelWidth">
                    <el-input v-model="newpwdAgain" :type="'password'"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
          </el-form>
          <div class="button-container" style="margin-top:20px;">
             <div style="display: flex;justify-content: space-between;margin:0 20%;">
                <el-button @click="cancel" style="margin-left:10px;width:80px;height:30px;">关闭</el-button>
                <el-button @click="confirm" style="margin-left:100px;width:80px;height:30px;">确定</el-button>
            </div>
          </div>
    </el-dialog>
    </aside>
</template>

<script>
import { mapState,mapActions } from 'vuex'
import http from '@/config/httpConfig.js'
import { isPermisson } from '@/utils/btnPermission'
export default {
    data() {
        return {
            isDialog:false,
            formLabelWidth:"150px",
            originPassword:"",
            newPassword:"",
            newpwdAgain:"",
            userName:"",
            isShow:true,
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse', 'crumbList']),
        ...mapState('permission', ['avatar', 'account']),
        ...mapState('tagsView', [ 'isclear']),
    },
    methods: {
        ...mapActions('tagsView', ['removeViews','removeMenus','clearTimer']),
        toggleNavCollapse() {
            this.$store.commit('toggleNavCollapse')
        },
        loginOut() {
            this.clearTimer()
            console.log(this.isclear)
            this.removeMenus()
            this.removeViews()
            this.$router.push({ path: '/login' })
            window.localStorage.clear()
        },
        handleCommand(item){
            if(item=='2'){
                console.log(localStorage.getItem('userId'))
                this.isDialog=true
            }
        },
        cancel(){
            this.isDialog=false
        },
        confirm(){
            if(this.newPassword!=this.newpwdAgain){
                this.$message({type: 'warning',message: "两次密码输入不一致"});   
                return ; 
            }
            http.put("/system/user/resetPwd",{
                userId:localStorage.getItem('userId'),
                oldPassword:this.originPassword,
                password:this.newPassword
            }).then(res=>{
                if(res.status=='200'){
                    this.$message({type: 'success',message: '修改成功'});
                    this.$store.commit('LOGIN_OUT')
                    this.$router.push({ path: '/login' })
                    this.isDialog=false
                }else{
                    this.$message({type: 'warning',message: res.data.msg});
                }
            })
        }
    },
    mounted(){
        this.userName=localStorage.getItem('userName')
        this.isShow = isPermisson("system:user:resetPwd")
    }
}
</script>

<style lang="scss" scoped>
.aside__top {
    border-bottom: 1px solid #e5e5e5;
    height: 50px;
    line-height: 50px;
    position: relative;
    left:0;
    top: 0;
    background: #fff;
    z-index: 1000;
    transition: left 0.25s;
    .toggleNavCollapse {
        display: inline-block;
        margin-left: 8px;
        padding: 0 10px;
        font-size: 26px;
        vertical-align: middle;
        color: #333;
        cursor: pointer;
        transition: all 0.5s;
        &.active {
            transform: rotate(90deg);
        }
    }

    .aside__top--right {
        position: absolute;
        right: 10px;
        top: -1px;
        bottom: 0px;
        > div {
            position: relative;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin-left: 10px;
            padding: 0 15px;
            cursor: pointer;
            &:hover::after {
                transform-origin: 0 0;
                transform: scaleX(1);
            }
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
}
.breadcrumb-enter,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all 0.6s;
}

.breadcrumb-leave-active {
    position: absolute;
}
</style>
