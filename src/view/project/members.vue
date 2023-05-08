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
						<el-link v-if="scope.row.is_leader == 1" icon="el-icon-s-custom" type="primary" @click.stop="setLeaderHandle(scope.row)">设为`普通成员`</el-link>
						<el-link v-else icon="el-icon-s-custom" type="primary" @click.stop="setLeaderHandle(scope.row)">设为`管理员`</el-link>

						<el-divider direction="vertical"></el-divider>

						<el-link v-if="scope.row.role_power == 1" icon="el-icon-setting" type="primary" @click.stop="setPermission(scope.row)">设为`只读`权限</el-link>
						<el-link v-else icon="el-icon-setting" type="primary" @click.stop="setPermission(scope.row)">设为`读/写`权限</el-link>

						<el-divider direction="vertical"></el-divider>

						<el-link type="danger" icon="el-icon-delete" @click.stop="quitProject(scope.row)">移出成员</el-link>
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
	import { lists, create, update, deleteMember, setRolePower, setLeader } from '@/api/project-member'

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
								}
							);
					})
					.catch(() => {});
			},
			// 设置成员的管理员权限
			setLeaderHandle(val) {
				let is_leader = val.is_leader == 0 ? 1 : 0;
				is_leader = Number.parseInt(is_leader);
				this.$confirm("您将调整会员`" + val.user_info.nick_name + "`的管理员权限?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						setLeader({
								project_id: this.$route.params.projectId,
								user_id: val.user_id,
								is_leader: is_leader,
							})
							.then(
								(res) => {
									if (res.http_status === this.HTTP_SUCCESS) {
										this.$message.success(res.msg);
										val.is_leader = is_leader;
									}
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
										val.role_power = role_power;
									}
								}
							);
					})
					.catch(() => {});
			},
			//移除出项目
			quitProject(val) {
				this.$confirm("确定要将会员`" + val.user_info.nick_name + "`移出该项目?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteMember({
								user_id: val.user_id,
								project_id: this.$route.params.projectId,
							})
							.then((res) => {
									if (res.http_status === this.HTTP_SUCCESS) {
										this.$message.success(res.msg);
										this.getProjectUserList();
									}
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
