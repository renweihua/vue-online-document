<template>
	<div class="doc-list">
		<div class="doc-list-table">
			<el-table :data="docList" stripe style="width: 100%" v-loading="loading" border>
				<el-table-column prop="doc_name" label="名称" width="180"></el-table-column>
				<el-table-column prop="user_info.nick_name" label="创建者" width="180"></el-table-column>
				<el-table-column prop="time_formatting" label="创建时间"></el-table-column>
				<el-table-column prop="is_top" label="置顶" width="130">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.is_top"
							:active-value="1"
							:inactive-value="0"
							:disabled="!controlShow()" @change="setIsTop(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="jumpPage('docDetail',scope.row.doc_id)">详情</el-button>
						<el-button @click="jumpPage('docEdit',scope.row.doc_id)" :disabled="!controlShow()">编辑</el-button>
						<el-button type="danger" @click="deleteDoc(scope.row.doc_id)" :disabled="!controlShow()">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="page" v-show="!$route.query.search">
			<el-pagination background layout="total,prev, pager, next" :total="count" :page-size="per_page" :current-page="cp"
				@current-change="changePage($event)"></el-pagination>
		</div>
	</div>
</template>

<script>
	import controlShow from "../../mixins/controlShow";
	import {
		lists,
		setTop
	} from "@/api/doc"

	const CODE_OK = 200;
	export default {
		name: "docList",
		props: {
			id: String,
			groupId: {
				type: [Number, String],
				default: 0,
			},
			projectId: {
				type: [Number, String],
				default: 0,
			},
		},
		created() {
			this.getDocList(this.cp, this.groupId, this.$route.params.projectId);
		},
		data() {
			return {
				loading: true,
				docList: [],
				cp: 1,
				per_page: 10,
				count: 0,
			};
		},
		methods: {
			//翻页
			changePage(event) {
				this.loading = true;
				this.getDocList(event, this.groupId, this.$route.params.projectId);
				this.cp = event;
			},
			//删除文档
			deleteDoc(id) {
				this.$confirm("该文档将被删除, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.$http
						.post("/doc/delete", {
							id: id,
							projectId: this.$route.params.projectId,
						})
						.then((response) => {
							response = response.data;
							if (response.code === CODE_OK) {
								this.$message.success("成功!");
								//如果当前页只有1条数据则请求上一页
								if (this.docList.length === 1 && this.cp > 1) {
									this.cp--;
								}

								this.getDocList(
									this.cp,
									this.groupId,
									this.$route.params.projectId
								);
							} else {
								this.$message.error("操作失败!");
							}
						});
				});
			},
			//获取文档
			async getDocList(curr, groupId, projectId, search = "") {
				if (!projectId) {
					this.$message.error("异常错误");
					return;
				}

				if (!groupId) {
					groupId = 0;
				}

				const {
					data,
					http_status,
					msg
				} = await lists({
					group_id: groupId,
					project_id: projectId,
					page: curr,
					isDeleted: groupId < 0 ? 1 : 0,
					search,
				});
				this.docList = data.data;
				this.count = Number.parseInt(data.total);
				this.per_page = Number.parseInt(data.per_page);

				// 关闭加载进度条
				this.loading = false;
			},
			jumpPage(name, docId) {
				this.$router.push({
					name,
					params: {
						docId: docId
					}
				});
			},
			async setIsTop(item) {
				const {
					data,
					http_status,
					msg
				} = await setTop({
						is_top: item.is_top == 0 ? 0 : 1,
						doc_id: item.doc_id,
					});

				if (http_status !== this.HTTP_SUCCESS) {
					item.is_top = !item.is_top;
				}else{
					this.$message.success(msg);
				}
			},
		},
		watch: {
			$route: function(to) {
				if (to.query.search) {
					this.cp = 1;
					this.getDocList(this.cp, 0, to.params.projectId, to.query.search);
					this.loading = true;
				} else {
					this.cp = 1;
					this.getDocList(this.cp, to.query.groupId, to.params.projectId);
					this.loading = true;
				}
			},
		},
		mixins: [controlShow],
	};
</script>

<style lang="scss" scoped>
	.doc-list-table {
		min-height: 600px;
	}

	.page {
		background-color: #fff;
		border: 1px;
		text-align: right;
		margin: 20px 0;
	}
</style>
