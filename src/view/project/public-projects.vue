<template>
	<div class="project-list">
		<!-- 项目列表-开始 -->
		<el-row :gutter="12">
			<el-col :span="10" v-for="(item, key) in projectList" :key="key">
				<div class="grid-content bg-purple">
					<el-card class="box-card" shadow="hover">
						<div slot="header" class="clearfix">
							<span>{{ item.project_name }}</span>
							<el-button style="float: right; padding: 3px 0" type="text">{{ item.project_version }}</el-button>
						</div>
						<div class="text item" v-html="item.project_description"></div>
						<div class="bottom clearfix">
							<time class="time">{{ item.time_formatting }}</time>
							<el-button type="text" class="button">查看</el-button>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>

		<div class="page-wrapper" v-if="itemCount > pageSize">
			<el-pagination background layout="total,prev, pager, next" :total="parseInt(itemCount)"
				:page-size="pageSize" :current-page="currPage" @current-change="jumpPage($event)"></el-pagination>
		</div>
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
		name: "public-projects",
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
			jumpPage(page) {
				this.currPage = page;
				this.getProjectList(page, this.pageSize);
			},
			detail(row) {
				this.$router.push("/detail/" + row.project_id);
			},
		},
		created() {
			this.getProjectList(this.currPage, this.pageSize);
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


.el-col{
	    margin-bottom: 10px;
}




.text {
font-size: 14px;
}

.item {
margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both
}

.box-card {
width: 480px;
}
.time {
font-size: 13px;
color: #999;
}
.bottom {
margin-top: 13px;
line-height: 12px;
}

.button {
padding: 0;
float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
