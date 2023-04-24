<template>
	<div class="doc-edit" v-loading="loading">
		<div class="btn">
			<el-button plain @click="$router.go(-1)">返 回</el-button>
			<el-button type="success" plain @click="updateDoc()">保 存</el-button>
		</div>
		<div class="doc-wrapper">
			<DocInfo :doc="doc" :isUpdate="true" :groupList="this.groupList" v-on:update-info="updateInfo($event)" />
			<div class="doc-content">
				<mavon-editor v-model="doc.content_markdown" ref="md" />
			</div>
		</div>
	</div>
</template>
<script>
	import DocInfo from "./units/docInfo";
	const CODE_OK = 200;
	import {
		lists as groups
	} from "@/api/group";
    import { detail, update } from "@/api/doc"

	export default {
		components: {
			DocInfo,
		},
		name: "docEdit",
		props: {
			docId: [Number, String],
		},
		data() {
			return {
				doc: {},
				groupList: [],
				isCreate: true,
				loading: true,
			};
		},
		methods: {
			updateInfo(val) {
				this.doc.doc_name = val.doc_name;
				this.doc.group_id = val.groupId;
			},
			//获取分组列表
			async getGroup(pageSize = 10, curr = 1, projectId) {
				const {
					data,
					http_status,
					msg
				} = await groups({
					cp: curr,
					ps: pageSize,
					project_id: projectId ? projectId : 0,
					group_type: 1, // 文档分组
				});
				this.groupList = data;
			},
			//更新文档
			updateDoc() {
				if (this.doc.doc_name.length < 1) {
					this.$message.error('文档标题不可为空！');
                    return;
				}

				this.$confirm("确定保存文档`" + this.doc.doc_name + "`吗？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						update(this.doc)
							.then((res) => {
                                if (res.http_status === CODE_OK) {
                                    this.$message.success(res.msg);

                                    this.$router.go(-1);
                                }
							});
					})
					.catch(() => {});
			},
			//获取文档详情
			async getDocDetail() {
				const {data, http_status, msg} = await detail(this.docId);
                if (http_status === CODE_OK) {
                    this.doc = data;
                }
                this.loading = false;
			},
		},
		created() {
			if (!this.docId) {
				return;
			}

			this.getGroup(100, 1, this.$route.params.projectId);
			this.getDocDetail();
		},
		watch: {
			doc: function(val) {
				if (val.id) {
					this.loading = false;
				}
			},
		},
	};
</script>
<style lang="scss" scoped>
	.doc-edit {
		margin: 10px 0 0 0;

		.doc-wrapper {
			margin: 20px auto;
			min-height: 800px;
		}

		.doc-content .v-note-wrapper {
			margin: 10px;
			height: 1000px;
		}

		.btn {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
