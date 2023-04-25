<template>
	<div class="message" v-loading="loading">
		<el-timeline>
			<el-timeline-item v-for="(item, index) in operationLog" :key="index" :timestamp="item.time_formatting">
				{{item.user_info.nick_name}}, {{item.content}}
            </el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
	const CODE_OK = 200;
	import {
		operationLogs
	} from "@/api/operation-log";

	export default {
		name: "operationLog",
		created() {
			this.getOperationLog();
		},
		props: {},
		data() {
			return {
				loading: true,
				operationLog: [],
				ps: 15,
				page: 1,
			};
		},
		methods: {
			//获取操作日志
			async getOperationLog() {
				const {data, http_status, msg} = await operationLogs({
					project_id: this.$route.params.projectId,
					page: this.page,
				});
                this.operationLog = data.data;
                this.loading = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.message {
		height: 700px;
	}
</style>
