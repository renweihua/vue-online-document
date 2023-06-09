<template>
	<div class="user-center">
        <img v-if="user.user_info" :src="user.user_info.user_avatar" class="avatar" />

		<!-- 用户信息 -->
		<div class="info">
			<ul>
				<li v-if="user.user_name">
					<em>登录名：</em>
					<p>{{ user.user_name }}</p>
				</li>
				<li>
					<em>昵称：</em>
					<p>{{ user.user_info ? user.user_info.nick_name : '未设置' }}</p>
				</li>
				<li v-if="user.user_email">
					<em>邮箱：</em>
					<p>{{ user.user_email }}</p>
				</li>
				<li v-if="user.user_info">
					<em>创建时间：</em>
					<p>{{ user.user_info.time_formatting }}</p>
				</li>
                <li v-if="user.user_mobile">
                  <em>手机：</em>
                  <p>{{ user.user_mobile }}</p>
                </li>
			</ul>
			<div class="btn" v-if="false">
				<el-button @click="dialogFormVisible = true" type="primary">修改密码</el-button>
				<el-button type="primary" @click="updateNickname()">修改昵称</el-button>
			</div>
		</div>
		<!-- 用户信息-结束 -->

		<!-- 修改密码 -->
		<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
			<el-form :model="form" label-width="80px" ref="form" :rules="rules">
				<el-form-item label="旧密码" prop="old_pwd">
					<el-input v-model="form.old_pwd" autocomplete="off" type="password" placeholder="旧密码"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="form.pwd" autocomplete="off" type="password" placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item label="重复密码" prop="re_pwd">
					<el-input v-model="form.re_pwd" autocomplete="off" type="password" placeholder="重复密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="updatePwd()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 修改密码-结束 -->
	</div>
</template>

<script>
    import { me } from "@/api/auth";
	const CODE_OK = 200;

	export default {
		name: "userCenter",
		data() {
			//自定义的 密码验证，判断两次密码是否一致
			var validatePass = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请输入密码"));
				} else {
					if (this.form.pwd !== "") {
						this.$refs.form.validateField("re_pwd");
					}
					callback();
				}
			};
			var reValidatePass = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请再次输入密码"));
				} else if (value !== this.form.pwd) {
					callback(new Error("两次输入密码不一致!"));
				} else {
					callback();
				}
			};

			return {
				avatarUrl: "",
				user: {},
				editNickName: false,
				form: {
					old_pwd: "",
					pwd: "",
					re_pwd: "",
				},
				dialogFormVisible: false,
				rules: {
					old_pwd: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 6,
							max: 50,
							message: "长度在 6 到 50 个字符",
							trigger: "blur",
						},
					],
					pwd: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 6,
							max: 50,
							message: "长度在 6 到 50 个字符",
							trigger: "blur",
						},
						{
							validator: validatePass,
							trigger: "blur"
						},
					],
					re_pwd: [{
							required: true,
							message: "请再次输入密码",
							trigger: "blur"
						},
						{
							min: 6,
							max: 50,
							message: "长度在 6 到 50 个字符",
							trigger: "blur",
						},
						{
							validator: reValidatePass,
							trigger: "blur"
						},
					],
				},
			};
		},
		created() {
			this.getUserInfo();
		},
		methods: {
			//获取用户信息
			async getUserInfo() {
				const {data, http_status, msg} = await me();
				if (http_status === this.HTTP_SUCCESS) {
					this.user = data;
					this.$store.commit("saveUserInfo", this.user);
				}
			},
			//更新密码
			updatePwd() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						if (this.form.pwd === this.form.old_pwd) {
							this.$message.error("新旧密码不能相同");
							return;
						}

						this.$http
							.post("/user/update-pwd", {
								oldPwd: this.form.old_pwd,
								newPwd: this.form.pwd,
								rePwd: this.form.re_pwd,
							})
							.then(
								(res) => {
									let response = res.data;
									if (response.code !== CODE_OK) {
										this.$message.error(response.msg);
									} else {
										this.$message.success("success");
										this.getUserInfo();
										this.dialogFormVisible = false;
										this.$refs.form.resetFields();
									}
								},
								() => {
									this.$message.error("请求发生错误");
								}
							);
					} else {
						return false;
					}
				});
			},
			updateNickname() {
				this.$prompt("请修改昵称", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						inputValue: this.user.user_info.nick_name,
						inputPattern: /.{1,50}/,
						inputErrorMessage: "昵称不正确",
					})
					.then(({
						value
					}) => {
						//验证名字是否一样
						if (value === this.user.user_info.nick_name) {
							this.$message.error("昵称没有修改");
							return;
						}

						this.updateUserInfo(value, null);
					})
					.catch(() => {});
			},

			//更新昵称
			updateUserInfo(nickName = "", faceUrl = "") {
				if (!nickName && !faceUrl) {
					return;
				}

				this.$http
					.post("/user/update", {
						nick_name: nickName,
						face_url: faceUrl,
					})
					.then(
						(res) => {
							let response = res.data;
							if (response.code !== CODE_OK) {
								this.$message.error("failed:" + response.msg);
								return;
							} else {
								this.getUserInfo();
								this.$message({
									type: "success",
									message: "保存成功",
								});
							}
						},
						() => {
							this.$message.error("请求发生错误");
						}
					);
			},
		},
		computed: {},
	};
</script>

<style lang="scss" scoped>
	.user-center {
		border: 1px solid rgb(195, 195, 195);
		width: 50%;
		margin: 0 auto;
		padding: 50px 0;

		// .avatar-uploader {
		//   text-align: center;

		//   ::v-deep .el-upload {
		//     border: 1px solid #d9d9d9;
		//     border-radius: 178px;
		//     cursor: pointer;
		//     position: relative;
		//     overflow: hidden;
		//     &:hover {
		//       border-color: #409eff;
		//     }
		//   }

		//   .avatar-uploader-icon {
		//     font-size: 28px;
		//     color: #8c939d;
		//     width: 178px;
		//     height: 178px;
		//     line-height: 178px;
		//     text-align: center;
		//   }
		//   .avatar {
		//     width: 178px;
		//     height: 178px;
		//     display: block;
		//   }
		// }

		.info {
			.btn {
				margin: 20px auto;
				width: 100%;
				text-align: center;
			}

			ul {
				width: 350px;
				margin: 0 auto;
				padding: 0;
				font-size: 14px;

				li {
					border-bottom: 1px dashed gray;
					list-style: none;

					&last-child {
						margin-bottom: 10px;
					}

					em {
						width: 100px;
						display: inline-block;
						text-align: right;
						margin-right: 40px;
						font-style: normal;
						font-size: 12px;
					}

					p {
						display: inline-block;
					}
				}
			}
		}
	}
</style>