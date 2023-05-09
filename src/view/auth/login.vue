<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
                 label-position="left">

            <div class="title-container">
                <h3 class="title">
                    登录
                </h3>
            </div>

            <el-form-item prop="user_name">
        <span class="svg-container">
                <i class="el-icon-user"></i>
        </span>
                <el-input
                    ref="user_name"
                    v-model="loginForm.user_name"
                    placeholder="请输入登录账户"
                    name="user_name"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
              <span class="svg-container">
                <i class="el-icon-lock"></i>
              </span>
                    <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="请输入登录密码"
                        name="password"
                        tabindex="2"
                        autocomplete="on"
                        @keyup.native="checkCapslock"
                        @blur="capsTooltip = false"
                        @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
          <i :icon-class="passwordType === 'password' ? 'el-icon-turn-off' : 'el-icon-open'"></i>
          </span>
                </el-form-item>
            </el-tooltip>

            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                       @click.native.prevent="handleLogin">
                登录
            </el-button>

        </el-form>
    </div>
</template>

<script>
    import {
        login as auth
    } from '@/api/auth';
    import {
        getUser, setUser, removeUser
    } from '@/utils/auth';
    export default {
        name: 'Login',
        data() {
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('The password can not be less than 6 digits'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    user_name: '',
                    password: ''
                },
                loginRules: {
                    user_name: [{required: true, message: "请输入用户名", trigger: 'blur'}],
                    password: [{required: true, message: "请输入密码", trigger: 'blur', validator: validatePassword}]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                showDialog: false,
            }
        },
        watch: {
        },
        created() {
            this.loginByLocalStorage();
        },
        mounted() {
            if (this.loginForm.user_name === '') {
                this.$refs.user_name.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
        },
        destroyed() {
        },
        methods: {
            checkCapslock(e) {
                const {key} = e
                this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        auth(this.loginForm).then(
                            (response) => {
                                if (response.http_status === this.HTTP_SUCCESS) {
                                    let userInfo = response.data;
                                    this.$store.commit("saveUserInfo", userInfo);
                                    setUser(userInfo);
                                    this.$router.push("/").catch(() => {});
                                } else {
                                    removeUser();
                                    this.$router.push("/login").catch(() => {});
                                }
                                this.loading = false;
                            },
                            () => {
                                this.loading = false;
                            }
                        );
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            //通过localStorage登录
            loginByLocalStorage() {
                let userInfo1 = getUser();
                if (userInfo1) {
                    let currDate = new Date();
                    let expireTime = new Date(userInfo1.expires_time * 1000);
                    if (expireTime > currDate) {
                        this.$store.commit("saveUserInfo", userInfo1);
                        setUser(userInfo1);
                        this.$router.push("/");
                    } else {
                        removeUser();
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    html, body, #app{
        height: 100%;
    }
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
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

<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
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
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }

            .set-language {
                color: #fff;
                position: absolute;
                top: 3px;
                font-size: 18px;
                right: 0px;
                cursor: pointer;
            }
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

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }

        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }
</style>
