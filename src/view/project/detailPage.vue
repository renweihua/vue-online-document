<template>
	<div class="detailPage">
		<div class="right-l">
			<div class="info-box">
				<div class="title">
					<span>{{project.project_name}}</span>
				</div>
				<div class="desc">
					<span>{{project.project_description}}</span>
				</div>
				<ul>
					<li>
						<p>项目类型</p>
						<p>{{project.project_type_text}}</p>
					</li>
					<li>
						<p>项目版本</p>
						<p>{{project.project_version}}</p>
					</li>
					<li>
						<p>创建时间</p>
						<p>{{project.time_formatting}}</p>
					</li>
					<li @click="jump()" class="api-detail">
						<p>api接口</p>
						<p>
							<el-link type="danger">点击查看详情</el-link>
						</p>
					</li>
				</ul>
			</div>

			<div class="doc-list-table">
				<el-divider content-position="left">公 告</el-divider>
				<el-table :data="docList" stripe style="width: 100%" v-loading="loading" border
					@row-click="tableRowClick">
					<el-table-column prop="doc_name" label="文档名称" width="180"></el-table-column>
					<el-table-column prop="user_info.nick_name" label="创建者" width="180"></el-table-column>
					<el-table-column prop="time_formatting" label="创建时间"></el-table-column>
				</el-table>
			</div>

			<!-- 右侧内容结束 -->
		</div>
		<div class="right-r">
			<message></message>
		</div>
	</div>
</template>

<script>
	import Message from "@/components/project/operationLog";
	import getProjectDetail from "@/mixins/getProjectDetail";
	import {
		lists as docs
	} from "@/api/doc";

	export default {
		name: "detailPage",
		props: {
			projectId: String,
		},
		mixins: [getProjectDetail],
		created() {
			// this.project = this.$store.state.project;
			this.getDocList();
		},
		mounted(){
			this.getProjectById(this.$route.params.projectId);
			this.project = this.$store.state.project;
		},
		data() {
			return {
				loading: false,
				keyword: "",
				project: {},
				docList: [],
				indesideRoute: [{
						title: "项目概况",
						route: "detail",
						child: "detailPage"
					},
					{
						title: "API接口",
						route: "detail",
						child: "apiPage"
					},
				],
			};
		},
		methods: {
			tableRowClick(row) {
				this.$router.push({
					name: "docDetail",
					params: {
						docId: row.id
					}
				});
			},
			jump() {
				this.$router.push({
					name: "apiList",
					params: {
						projectId: this.projectId,
						groupId: 0
					},
				});
			},
			//获取文档
			async getDocList(cp = 1) {
				const {data, http_status, msg} = await docs({
						project_id: this.$route.params.projectId,
						page: cp,
						isTop: 1,
					});
				this.docList = data.data;
				this.count = Number.parseInt(data.total);
				this.loading = false;
			},
		},
		components: {
			message: Message,
		},
	};
</script>

<style lang="scss" scoped>
	.detailPage {
		display: flex;
	}

	.right-l {
		width: 50%;
		height: 100%;
		padding: 0 10px 0 0;
		box-sizing: border-box;
		border-radius: 3px;
		overflow: hidden;
		background-color: #fff;

		.doc-list-table {
			margin: 50px 0;
		}
	}

	.right-l .title {
		height: 100px;
		border: 1px solid #e5e5e5;
		line-height: 100px;
		box-sizing: border-box;
		padding-left: 20px;
		font-weight: 700;
		font-size: 2em;
		color: #4caf50;
	}

	.desc {
		border-bottom: 1px solid #e5e5e5;
		border-left: 1px solid #e5e5e5;
		border-right: 1px solid #e5e5e5;
		font-size: 18px;
		color: #7e7d7d;
	}

	.desc span {
		display: block;
		padding: 8px 6px;
		font-size: 12px;
	}

	.right-l ul {
		width: 100%;
		display: flex;
		margin: 0;
		padding: 0;
	}

	.right-l ul.two {
		margin: 20px 0;
		border-top: 1px solid #e5e5e5;
	}

	.right-l ul li {
		flex: 1;
		height: 80px;
		border-right: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
		list-style: none;
	}

	.right-l ul li:first-child {
		border-left: 1px solid #e5e5e5;
	}

	.right-l ul li p:first-child {
		font-size: 18px;
		margin: 10px 15px;
	}

	.right-l ul li p:last-child {
		font-size: 12px;
		color: gray;
		margin: 10px 15px;
	}

	.right-r {
		box-sizing: border-box;
		width: 50%;
		height: 100%;
		border-left: solid 1px #e6e6e6;
		border-bottom: solid 1px #e6e6e6;
		border-top: solid 1px #e6e6e6;
		box-sizing: border-box;
		padding: 10px;
		overflow-y: scroll;
	}

	.right-l ul li.api-detail p:last-child {
		color: red;
	}
</style>
