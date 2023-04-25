<template>
	<div class="field-wrapper">
		<div class="btn-wrapper">
			<el-button @click="showAddWindow = true">
				<i class="el-icon-plus"></i>
				新增
			</el-button>
			<el-divider></el-divider>

			<!-- 表单-开始 -->
			<el-dialog title="添加映射字段" :visible.sync="showAddWindow" :show-close="false" @close="actionCancel">
				<el-form :model="fieldMapping" label-width="80px" ref="form" :rules="rules">
					<el-form-item label="字段名" prop="field_name">
						<el-input v-model="fieldMapping.field_name" autocomplete="off" placeholder="字段名"></el-input>
					</el-form-item>
					<el-form-item label="字段类型" prop="field_type">
						<el-select v-model="fieldMapping.field_type" placeholder="请选择字段类型" v-if="propertyList.field_type" filterable>
							<el-option-group
				                v-for="(group, index) in propertyList.field_type"
				                :key="index"
				                :label="group.label"
				            >
                            	<el-option v-for="item in group.options" :key="item" :label="item" :value="item"></el-option>
                            </el-option-group>
						</el-select>
					</el-form-item>
					<el-form-item label="描述" prop="field_description">
						<el-input type="textarea" :rows="4" v-model="fieldMapping.field_description" autocomplete="off"
							placeholder="版本号"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="actionCancel">取 消</el-button>
					<el-button type="primary" @click="saveFieldMapping()">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 表单-结束 -->
		</div>
		<!-- 数据-开始 -->
		<el-table :data="fieldList" stripe v-loading="loading">
			<el-table-column prop="field_name" label="字段名" width="180"></el-table-column>
			<el-table-column prop="field_type" label="类型"></el-table-column>
			<el-table-column prop="field_description" label="描述"></el-table-column>
			<el-table-column prop="time_formatting" label="创建时间"></el-table-column>
			<el-table-column prop label="操作">
				<template slot-scope="scope" v-show="!controlShow()">
					<el-button type="primary" @click="updateAction(scope.row) ">编辑</el-button>
					<el-divider direction="vertical"></el-divider>
					<el-button slot="reference" type="danger" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 数据-结束 -->
		<!-- 项目列表-结束 -->
		<div class="page-wrapper" v-if="itemCount > pageSize">
			<el-pagination background layout="total,prev, pager, next" :total="parseInt(itemCount)"
				:page-size="pageSize" :current-page="currPage" @current-change="jumpPage($event)"></el-pagination>
		</div>
	</div>
</template>

<script>
	import controlShow from "../../mixins/controlShow";
	import getCommonProperty from "../../mixins/getCommonProperty";
	import {
		lists,
		create,
		update,
		deleteFieldMapping
	} from '@/api/field-mapping';

	const CODE_OK = 200;

	export default {
		name: "fieldMapping",
		props: {
			projectId: [Number, String],
		},
		mixins: [controlShow, getCommonProperty],
		created() {
			this.loading = true;
			this.getProperty();
            this.getFieldList();
		},
		data() {
			return {
				pageSize: 10,
				currPage: 1,
				itemCount: 0,
				propertyList: [],
				loadding: false,
				showAddWindow: false,
				fieldList: [],
				fieldMapping: {
					project_id: this.projectId,
					field_type: 'string',
				},
				rules: {
					field_name: [{
							required: true,
							message: "请输入字段名",
							trigger: "blur"
						},
						{
							min: 1,
							max: 50,
							message: "长度在 1 到 50 个字符",
							trigger: "blur",
						},
					],
					field_type: [{
						required: true,
						message: "请选择字段数据类型",
						trigger: "blur"
					}],
				},
			};
		},
		methods: {
			del(row) {
				this.$confirm("此操作将删除`" + row.field_name + "`该字段映射吗?", "删除提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteFieldMapping({id:row.id})
							.then(
								(res) => {
									if (res.http_status === CODE_OK) {
										this.$message.success(res.msg);
										this.getFieldList();
									}
								},
								() => {
									this.$message.error("请求失败!");
								}
							);
					})
					.catch(() => {});
			},
			actionCancel() {
				this.fieldMapping = {};
				this.showAddWindow = false;
			},
			updateAction(data) {
				this.fieldMapping = data;
				this.showAddWindow = true;
			},
			//保存字段
			async saveFieldMapping() {
				this.$refs.form.validate((valid) => {
					if (!valid) {
						return;
					}
					let result;
					console.log(this.fieldMapping);
					if(this.fieldMapping.id){
						result = update(this.fieldMapping);
					}else{
						result = create(this.fieldMapping);
					}
					result
						.then((res) => {
							if (res.http_status === CODE_OK) {
								this.$message.success(res.msg);
								this.showAddWindow = false;
								this.getFieldList();
								this.$refs.form.resetFields();
							}
						});
				});
			},
			//获取字段列表
			async getFieldList(curr, pageSize) {
				this.loading = true;
				const {data, http_status, msg} = await lists({
						page: curr,
						project_id: this.$route.params.projectId,
					});
                this.itemCount = Number(data.total);
                this.pageSize = Number(data.per_page);
				this.fieldList = data.data;
				this.loading = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
</style>
