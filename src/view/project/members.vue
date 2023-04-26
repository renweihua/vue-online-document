<template>
	<div class="members">
		<!-- 用户选择 -->
		<div class="user-search">
			<el-select size="medium" v-model="keyword" filterable remote placeholder="输入 账户/手机号/邮箱 搜索会员"
				:remote-method="getUserList" :loading="loading" @change="addProjectUser($event)" clearable>
				<el-option v-for="item in searchUserList" :key="item.user_id" :label="item.user_info.nick_name ? item.user_info.nick_name : ('会员：' + item.user_id)" :value="item">
					<span style="float: right">添加</span>
					<span style="float: left; color: #8492a6; font-size: 13px">{{ item.user_info.nick_name ? item.user_info.nick_name : ('会员：' + item.user_id) }}</span>
				</el-option>
			</el-select>
			<el-divider></el-divider>
		</div>
		<!-- 用户选择-结束 -->

		<!-- 项目用户 -->
		<div class="all-user" v-loading="loading">
			<el-table :data="userList" stripe style="width: 100%" border>
				<el-table-column prop="user_info.nick_name" label="昵称"></el-table-column>
				<el-table-column prop="user.user_name" label="账号" width="180"></el-table-column>
				<el-table-column prop="user.user_email" label="邮箱"></el-table-column>
				<el-table-column prop="is_leader" label="用户类型">
					<template slot-scope="scope">{{scope.row.is_leader == 1 ? '项目管理者' : '项目成员' }}</template>
				</el-table-column>
				<el-table-column prop="role_power" label="权限">
					<template slot-scope="scope">{{scope.row.role_power == 0 ? '只读' : (scope.row.role_power == 1 ? '读/写' : '创建人')}}</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-dropdown placement="bottom" trigger="click" @command="handleCommand">
							<el-button type="primary">权限设置</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{action:'setPermission',data:scope.row}">
									设置{{scope.row.role_power == 1 ? '只读' : '读/写'}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button type="danger" style="margin-left:10px" @click="quitProject(scope.row)">移出项目</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 项目用户 -->
	</div>
</template>

<script>
	const CODE_OK = 200;
	import { searchUsers } from '@/api/commom';
	import { lists, create, update, deleteMember, setRolePower } from '@/api/project-member'

	export default {
		name: "members",
		data() {
			return {
				loading: false,
				keyword: "",
				searchUserList: [],
				userList: [],
			};
		},
		created() {
			this.getProjectUserList();
		},
		methods: {
			//转换状态字符串显示
			transferState(state) {
				state = parseInt(state);
				let str = "";
				//1正常2禁用
				switch (state) {
					case 1:
						str = "正常";
						break;
					case 2:
						str = "禁用";
						break;

					default:
						str = "unkonwn";
						break;
				}

				return str;
			},
			handleCommand(val) {
				switch (val.action) {
					case "setPermission":
						this.setPermission(val.data);
						break;

					default:
						break;
				}
			},
			//获取项目用户列表
			async getProjectUserList() {
				const {data, http_status, msg} = await lists({
						project_id: this.$route.params.projectId
					});
				this.userList = data.data;
			},
			//增加项目用户
			addProjectUser(val) {
				this.$confirm(
						"将用户" + (val.user_info.nick_name || val.user_id) + "加入该项目, 是否继续?",
						"提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}
					)
					.then(() => {
						create({
								project_id: this.$route.params.projectId,
								user_id: val.user_id,
							})
							.then((res) => {
									if (res.http_status === this.HTTP_SUCCESS) {
										this.$message.success(res.msg);
										this.getProjectUserList();
									}
								},
								() => {
									this.$message.error("操作失败!");
								}
							);
					})
					.catch(() => {});
			},
			//设置用户对项目的读写权限
			setPermission(val) {
				let role_power = val.role_power == 0 ? 1 : 0;
				role_power = Number.parseInt(role_power);
				this.$confirm("您将调整会员`" + val.user_info.nick_name + "`的权限?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						setRolePower({
								project_id: this.$route.params.projectId,
								user_id: val.user_id,
								role_power: role_power,
							})
							.then(
								(res) => {
									if (res.http_status === this.HTTP_SUCCESS) {
										this.$message.success(res.msg);
										this.getProjectUserList();
									}
								}
							);
					})
					.catch(() => {});
			},
			//移除出项目
			quitProject(val) {
				this.$confirm("将" + val.nick_name + "移出该项目, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.$http
							.post("/project/quit-project", {
								userId: val.id,
								projectId: this.$route.params.projectId,
							})
							.then(
								(response) => {
									response = response.data;
									if (response.code === CODE_OK) {
										this.getProjectUserList();
										this.$message.success("成功!");
									} else {
										this.$message.faild(response.msg);
									}
								},
								() => {
									this.$message.error("操作失败!");
								}
							);
					})
					.catch(() => {});
			},
			//获取用户列表
			async getUserList(search) {
				if (search && search.length < 2) {
					return;
				}
				const {
					data,
					http_status,
					msg
				} = await searchUsers({
					search
				});
				this.searchUserList = data;
				console.log(this.searchUserList);
			},
		},
	};
</script>

<style lang="scss" scope>
	.user-search {
		margin: 10px 0;

		.el-select {
			width: 400px;
		}
	}
</style>
