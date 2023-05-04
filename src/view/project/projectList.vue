<template>
	<div class="project-list">
		<div class="project-list-bar">
			<el-button @click="dialogFormVisible = true; " :disabled="!controlShow()">+新增项目</el-button>
		</div>
		<!-- 项目列表-开始 -->
		<div class="project-list-content">
			<el-table :data="projectList" v-loading="loading" @cell-click="detail" size="medium">
				<el-table-column prop="project_name" label="项目名称"></el-table-column>
				<el-table-column prop="project_version" label="版本号" width="180"></el-table-column>
				<el-table-column prop="project_type_text" label="类型" width="180"></el-table-column>
				<el-table-column prop="time_formatting" label="创建时间"></el-table-column>
				<el-table-column prop label="操作">
					<template slot-scope="scope">
						<el-button type="info" @click.stop="detail(scope.row);">详情</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="primary" @click.stop="form = scope.row;dialogFormVisible = true; isUpdate = true;"
							:disabled="$store.state.userInfo.type == 1">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="danger" slot="reference" @click.stop="deleteData(scope.row.project_id)"
							:disabled="$store.state.userInfo.type == 1">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 项目列表-结束 -->
		<div class="page-wrapper" v-if="itemCount > pageSize">
			<el-pagination background layout="total,prev, pager, next" :total="parseInt(itemCount)"
				:page-size="pageSize" :current-page="currPage" @current-change="jumpPage($event)"></el-pagination>
		</div>
		<!-- 编辑添加项目 -->
		<el-dialog title="添加项目" :visible.sync="dialogFormVisible">
			<el-form :model="form" label-width="80px" ref="form" :rules="rules">
				<el-form-item label="项目名称" prop="project_name">
					<el-input v-model="form.project_name" autocomplete="off" placeholder="项目名称"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="project_version">
					<el-input v-model="form.project_version" autocomplete="off" placeholder="版本号"></el-input>
				</el-form-item>
				<el-form-item label="项目类型" prop="project_type">
					<el-select v-model="form.project_type" placeholder="请选择">
						<el-option label="PC端" :value="0"></el-option>
						<el-option label="Web移动端" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="项目描述" prop="project_description">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.project_description">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false;$refs.form.resetFields();isUpdate = false;">取 消</el-button>
				<el-button type="primary" @click=" isUpdate ? updateProject(): createProject() ; ">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑添加项目-结束 -->
	</div>
</template>

<script>
	import controlShow from "../../mixins/controlShow";
	import {
		lists,
		create,
		update
	} from '@/api/project';
	export default {
		name: "projectList",
		mixins: [controlShow],
		data() {
			return {
				projectList: [],
				pageSize: 10,
				currPage: 1,
				itemCount: 0,
				loading: true,
				dialogFormVisible: false,
				isUpdate: false,
				form: {
					project_name: "",
					project_version: "",
					project_description: "",
					project_type: 0,
				},
				rules: {
					project_name: [{
							required: true,
							message: "请输入名称",
							trigger: "blur"
						},
						{
							min: 2,
							max: 50,
							message: "长度在 2 到 50 个字符",
							trigger: "blur",
						},
					],
					project_type: [{
						required: true,
						message: "请选择类型",
						trigger: "blur"
					}],
					project_description: [{
						min: 2,
						max: 50,
						message: "长度在 2 到 50 个字符",
						trigger: "blur",
					}, ],
					project_version: [{
							required: true,
							message: "请输入版本号",
							trigger: "blur"
						},
						{
							min: 1,
							max: 50,
							message: "长度在 6 到 50 个字符",
							trigger: "blur",
						},
					],
				},
			};
		},
		methods: {
			jump(route) {
				this.$router.push({
					path: "/" + route
				});
			},
			//获取项目列表
			async getProjectList(curr) {
				this.loading = true;
                const {data, http_status, msg} = await lists(this.listQuery);
                this.projectList = data.data;
                this.itemCount = Number(data.total);
                this.pageSize = Number(data.per_page);
                this.loading = false;
			},
			//创建项目
			createProject() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						create(this.form)
							.then((res) => {
								if (res.http_status === this.HTTP_SUCCESS) {
									this.$message.success(res.msg);
									this.getProjectList(this.currPage);
									this.dialogFormVisible = false;
									this.$refs.form.resetFields();
								}
							});
					}
				});
			},
			//删除数据
			deleteData(id) {
				this.$confirm("此操作将删除该分组, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.$http
							.post("/project/delete", {
								id,
							})
							.then((res) => {
								let response = res.data;
								if (response.code === CODE_OK) {
									this.$message.success("成功!" + response.msg);
									this.getProjectList(this.currPage);
								} else {
									this.$message.error("失败!" + response.msg);
								}
							});
					})
					.catch(() => {});
			},
			//更新
			updateProject() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						update(this.form)
							.then((res) => {
								let response = res.data;
								if (res.http_status === this.HTTP_SUCCESS) {
									this.$message.success(res.msg);
									this.dialogFormVisible = false;
									this.$refs.updateData.resetFields();
									this.getProjectList(this.currPage);
								}
								this.update = false;
							})
							.catch(() => {
								this.update = false;
							});
					}
				});
			},
			jumpPage(page) {
				this.currPage = page;
				this.getProjectList(page);
			},
			detail(row) {
				this.$router.push("/detail/" + row.project_id);
			},
		},
		created() {
			this.getProjectList(this.currPage);
		},
	};
</script>

<style lang="scss" scoped>
	.project-list {
		.project-list-bar {
			margin-bottom: 10px;
		}

		.project-list-content {
			min-height: 600px;
		}

		.page-wrapper {
			text-align: right;
		}
	}
</style>
