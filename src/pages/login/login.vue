<template>
    <div class="login-container">
        <el-form
            class="login-form"
            autocomplete="on"
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left"
        >
            <h3 class="title">后台管理系统</h3>
            <el-form-item prop="userName">
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span>
                <el-input type="text" v-model="loginForm.userName" autocomplete="on" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input
                    :type="pwdType"
                    @keyup.enter.native="login"
                    v-model="loginForm.password"
                    autocomplete="on"
                ></el-input>
                <span class="show-pwd" @click="showPwd">
                    <svg-icon icon-class="eye" />
                </span>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width:100%;"
                    :loading="loading"
                    @click.native.prevent="loginin"
                >Sign in</el-button>
            </el-form-item>
            <div class="tips">用户为admin的时候，能够看到所有的权限列表，其余账号只能看到部分</div>
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/permission'
import { mapMutations,mapActions } from 'vuex'
import http from '@/config/httpConfig.js'
export default {
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                userName: 'admin',
                password: 'admin123'
            },
            loginRules: {
                userName: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateUsername
                    }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ]
            },
            loading: false,
            pwdType: 'password'
        }
    },
    methods: {
        ...mapActions('tagsView', ['getUserId','getAllMenus','getUserInfo']),
        ...mapMutations('permission', ['SET_PERMISSION_LIST']),
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        //登录
        loginin() {
            this.getToken().then(data=>{
                return this.getMenus()
            }).then(data=>{
                return this.pageIn()
            })
        },
        //获取token
        getToken(){
            return new Promise((resolve,reject)=>{
                login(this.loginForm).then(res=>{
                    let token = res.data.token
                    this.$store.commit('LOGIN_IN', token)
                    resolve(res)
                })
            })
        },
        //获取菜单
        getMenus(){
            return new Promise((resolve,reject)=>{
                resolve('res')
            })
        },
        //进入页面
        pageIn(){
            return new Promise((resolve,reject)=>{
                http.get('getInfo').then(res=>{
                    localStorage.setItem('userId',res.data.user.userId)
                    localStorage.setItem('userName',res.data.user.userName)
                    localStorage.setItem('permission',JSON.stringify(res.data.permissions))
                    this.getUserInfo(res.data)
                    this.$router.replace('/')
                    resolve(res)
                })
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 90%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 520px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;
        &::v-deep .el-input .el-input__inner {
            color: white !important;
        }
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .fontcontainer {
        color: #889aa4;
        padding-left: 10px;
    }
}
</style>
