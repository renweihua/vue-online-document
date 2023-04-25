<template>
	<div class="doc-create">
		<div class="btn">
			<div class="left">
				<el-button plain @click="$router.go(-1)">返 回</el-button>
			</div>
			<div class="right">
				<el-button type="success" plain @click="createDoc()">保 存</el-button>
				<el-button type="success" plain @click="createDoc(true)">继续添加</el-button>
			</div>
		</div>
		<div class="doc-box">
			<DocInfo :groupList="this.groupList" v-on:update-info="updateInfo($event)" />
			<mavon-editor v-model="content" />
		</div>
	</div>
</template>
<script>
	import DocInfo from "./units/docInfo";
	import {
		create
	} from "@/api/doc";
	import {
		lists as groups
	} from "@/api/group";
	const CODE_OK = 200;

	export default {
		components: {
			DocInfo,
		},
		name: "docCreate",
		data() {
			return {
				title: "",
				content: "",
				description: "",
				groupId: 0,
				groupList: [],
			};
		},
		methods: {
			updateInfo(val) {
				this.title = val.title;
				this.groupId = val.groupId || 0;
			},
			initDocCreate() {
				this.groupId = 0;
				this.title = this.content = "";
			},
			//获取分组列表
			async getGroup(curr = 1, projectId) {
				const {
					data,
					http_status,
					msg
				} = await groups({
					page: curr,
					project_id: projectId ? projectId : 0,
					group_type: 1, // 文档分组
				});
				this.groupList = data;
			},
			//创建文档
			createDoc(isAgain) {
				if (this.title.length < 1) {
					this.$message.error('文档标题不可为空！');
					return;
				}
				this.$confirm("要保存吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					create({
							project_id: this.$route.params.projectId,
							doc_name: this.title,
							content_markdown: this.content,
							group_id: this.groupId,
						})
						.then((res) => {
							if (res.http_status === CODE_OK) {
								this.$message.success(res.msg);

								if (isAgain === true) {
									this.initDocCreate();
								} else {
									this.$router.go(-1);
								}
							} else {
								this.$message.error(res.msg);
							}
						});
				});
			},
		},
		created() {
			this.getGroup(1, this.$route.params.projectId);
		},
	};
</script>
<style lang="scss" scoped>
	.doc-create {
		.doc-box {
			margin: 20px auto;
			min-height: 1200px;
		}

		.v-note-wrapper {
			margin: 10px;
			height: 1000px;
		}

		.btn {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin-top: 10px;

			.right {
				padding-right: 20px;
			}
		}
	}
</style>
