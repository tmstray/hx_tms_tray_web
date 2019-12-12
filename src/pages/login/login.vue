<template>
    <div class="login-container">
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <h3 class="title">后台管理系统</h3>
            <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="login" v-model="loginForm.password" autoComplete="on"
                placeholder="password"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="login">
                Sign in
                </el-button>
            </el-form-item>
            <div class="tips">用户为admin的时候，能够看到所有的权限列表，其余账号只能看到部分</div>
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/permission'
import { mapMutations } from 'vuex'
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
                username: 'admin',
                password: '123456'
            },
            loginRules: {
                username: [
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
        ...mapMutations('permission', ['SET_PERMISSION_LIST']),
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        async login() {
            try {
                let data = await login(this.loginForm)
                let token = data.token
                this.$store.commit('LOGIN_IN', token)
                this.$router.replace('/')
                // 获取权限

                let labelPermission = [{
                    path: '',
                    name: 'container',
                    redirect: 'home',
                    meta: {
                        requiresAuth: true,
                        name: '首页',
                        icon: 'tree'
                    },
                    children: [{
                        id: 1,
                        path: 'home',
                        name: 'home',
                        meta: {
                            name: '首页',
                            icon: 'tree'
                        }
                    }]
                }, {
                    path: 'order',
                    name: 'order-manage',
                    meta: {
                        name: '订单管理',
                        icon: 'example'
                    },
                    children: [
                        {
                            path: 'list',
                            name: 'order-list',
                            meta: {
                                name: '订单列表',
                                icon: 'table'
                            },
                            id: 3123
                        },
                        {
                            path: 'product',
                            name: 'product-manage',
                            meta: {
                                name: '生产管理',
                                icon: 'user'
                            },
                            children: [
                                {
                                    path: 'list',
                                    name: 'product-list',
                                    meta: {
                                        name: '生产列表',
                                        icon: 'table'
                                    },
                                    id: 2345
                                },
                                {
                                    path: 'review',
                                    name: 'review-manage',
                                    meta: {
                                        name: '审核管理',
                                        icon: 'eye'
                                    },
                                    id: 5345
                                }
                            ]
                        },
                        {
                            path: 'returnGoods',
                            name: 'return-goods',
                            meta: {
                                name: '退货管理',
                                icon: 'nested'
                            }
                        }
                    ]
                },
                {
                    path: '/goods',
                    name: 'goods',
                    meta: {
                        name: '产品管理',
                        icon: 'user'
                    },
                    children: [
                        {
                            path: 'list',
                            name: 'goods-list',
                            meta: {
                                name: '产品列表',
                                icon: 'table'
                            },
                            id: 4234

                        },
                        {
                            path: 'classify',
                            name: 'goods-classify',
                            meta: {
                                name: '产品分类',
                                icon: 'tree'
                            },
                            id: 4254
                        }
                    ]
                },
                {
                    path: '/permission',
                    name: 'permission',
                    meta: {
                        name: '权限管理',
                        icon: 'table'
                    },
                    children: [
                        {
                            path: 'user',
                            name: 'user-manage',
                            meta: {
                                name: '用户管理',
                                icon: 'table'
                            },
                            id: 234
                        },
                        {
                            path: 'role',
                            name: 'role-manage',
                            meta: {
                                name: '角色管理',
                                icon: 'eye'
                            },
                            id: 465
                        },
                        {
                            path: 'menu',
                            name: 'menu-manage',
                            meta: {
                                name: '菜单管理',
                                icon: 'tree'
                            }
                        }
                    ]
                }]
                this.SET_PERMISSION_LIST(labelPermission)
            } catch (e) {
                console.log(e)
            }
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
    .fontcontainer{
        color:#889aa4;
        padding-left:10px;
    }
}
</style>
