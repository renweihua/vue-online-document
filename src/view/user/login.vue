<template>
    <div class="login-page">
        <div class="login-page-content">
            <div class="title">
                <span>apiDoc</span>
            </div>
            <div class="login-box" v-loading="loading">
                <el-form :inline="true" :model="form" :rules="rules" ref="form" @submit.native.prevent>
                    <el-form-item prop="user_name">
                        <el-input v-model="form.user_name" placeholder="用户名" style="width: 240px"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" type="password" placeholder="密码" style="width: 240px"
                            @keyup.enter.native="login()"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login()" icon="el-icon-arrow-left">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="remember">
                <input type="checkbox" name="remember" id="remember" />
                <label for="remember">记住密码</label>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        login as auth
    } from '@/api/auth';
    import {
        setUser, removeUser
    } from '@/utils/auth';
    export default {
        name: "loginPage",
        created() {
            this.loginByLocalStorage();
        },
        data() {
            return {
                form: {
                    user_name: "",
                    password: "",
                },
                rules: {
                    user_name: [{
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }],
                    password: [{
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }],
                },
                loading: false,
            };
        },
        methods: {
            //用户登录
            login() {
                this.$refs.form.validate((validate) => {
                    if (validate) {
                        this.loading = true;
                        auth(this.form).then(
                            (response) => {
                                if (response.http_status === this.HTTP_SUCCESS) {
                                    let userInfo = response.data;
                                    this.$store.commit("saveUserInfo", userInfo);
                                    setUser(userInfo);
                                    this.$router.push("/").catch(() => {});
                                } else {
                                    this.$message.error(response.msg);
                                    removeUser();
                                    this.$router.push("/login").catch(() => {});
                                }
                                this.loading = false;
                            },
                            () => {
                                this.$message.error("请求失败!");
                            }
                        );
                    } else {
                        return false;
                    }
                });
            },
            //通过localStorage登录
            loginByLocalStorage() {
                let userInfo1 = JSON.parse(localStorage.getItem("userInfo"));
                if (userInfo1) {
                    let currDate = new Date();
                    let expireTime = new Date(Date.parse(userInfo1.token_expire_time));
                    if (expireTime > currDate) {
                        this.$store.commit("saveUserInfo", userInfo1);
                        this.$router.push("/");
                    } else {
                        localStorage.removeItem("userInfo");
                    }
                }
            },
        },
        components: {},
    };
</script>
<style>
    /* 中间内容开始 */
    .login-page-content {
        position: absolute;
        left: 50%;
        top: 30%;
        transform: translate(-50%);
    }

    .login-page-content .title {
        height: 140px;
        font-size: 50px;
        line-height: 140px;
        text-align: center;
    }

    span.login-text {
        color: white;
    }

    .remember {
        text-align: right;
        margin-top: 10px;
        font-size: 14px;
        color: #666;
        height: 20px;
        line-height: 20px;
    }

    .remember input {
        vertical-align: middle;
    }

    .remember label {
        vertical-align: middle;
        cursor: pointer;
    }

    .remember label:hover {
        color: black;
    }

    /* 中间内容结束 */
</style>
