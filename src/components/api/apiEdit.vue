<template>
	<div class="create-api" v-loading="loading">
		<div class="box1">
			<el-button @click="returnApiPage">↩ 返 回</el-button>
			<el-button style="float:right;" @click="saveApi()">保 存</el-button>
		</div>

		<el-tabs v-model="activeName">
			<el-tab-pane label="基本信息" name="first">
				<!-- api信息 -->
				<apiInfo :groupList="groupList" :propertyList="propertyList" :apiData="apiData" :isUpdate="true"
					ref="apiInfo" />
			</el-tab-pane>
			<el-tab-pane label="接口备注" name="second">
				<!-- 详细说明 -->
				<detailDescription :description="apiData.api_description" v-on:update="apiData.api_description=$event" />
			</el-tab-pane>
		</el-tabs>

		<!-- 请求参数 -->
		<requestParams :propertyList="propertyList" v-on:update:header="apiData.http_header=$event"
			v-on:update:param="apiData.http_params=$event" :header="http_header"
			:params="http_params" />

		<!-- 响应参数 -->
		<returnParams :propertyList="propertyList" v-on:update="apiData.response_params=$event"
			:returnData="response_params" />
	</div>
</template>

<script>
    import { properties, detail, update } from "@/api/api";
    import { lists as groups } from "@/api/group";
	import returnParams from "./units/returnDataParams.vue";
	import requestParams from "./units/requestDataParams.vue";
	import apiInfo from "./units/apiInfo.vue";
	import detailDescription from "./units/detailDescription.vue";
	const CODE_OK = 200;
	export default {
		name: "apiEdit",
		props: {
			apiId: [Number, String],
		},
		created() {
			this.getApiDetail();
			this.getGroup();
			this.getProperty();
			this.isCopy = this.$route.query.copy == true;
		},
		data() {
			return {
				activeName: "first",
				loading: true,
				groupList: [],
				propertyList: [],
				apiData: {},
				http_header: [],
				http_params: [],
				response_params: [],
				isCopy: false,
			};
		},
		methods: {
			//获取api详情
			async getApiDetail() {
				const {
                    data,
                    http_status,
                    msg
                } = await detail(this.apiId);

                if (http_status === CODE_OK) {
                    this.apiData = data;
                    this.http_params = this.apiData.http_params;
                    this.http_header = this.apiData.http_header;
                    this.response_params = this.apiData.response_params;
                } else {
                    this.$message.error(msg);
                }

                this.loading = false;
			},
			//返回api列表页面
			returnApiPage() {
				this.$router.go(-1);
			},
			//更新api
			saveApi() {
				let url = this.isCopy ? "/api/create" : "/api/update";
				this.$refs.apiInfo.$refs.form.validate((validate) => {
					if (validate) {
						let detail = JSON.stringify(this.apiData);
						detail = JSON.parse(detail);

						if (detail.group_id_second) {
							detail.group_id = detail.group_id_second;
						}

						update(detail)
							.then((res) => {
                                console.log(res);
								if (res.http_status === CODE_OK) {
									this.$message.success(res.msg);
									this.$router.push({
										name: "apiDetail",
										params: {
											apiId: this.apiId
										},
									});
								}
							});
					}
				});
			},
			//获取分组数据
			async getGroup() {
				const {data, http_status, msg} = await groups({
					project_id: this.$route.params.projectId,
					group_type: 0, // 文档分组
				});
                this.groupList = data;
			},
			//获取通用属性
			async getProperty() {
				const {data, http_status, msg} = await properties();
                this.propertyList = data;
			},
		},
		components: {
			returnParams,
			requestParams,
			apiInfo,
			detailDescription,
		},
	};
</script>

<style lang="scss" scoped>
	.create-api {
		margin-bottom: 20px;
	}

	.box1 {
		display: flex;
		justify-content: space-between;
	}
</style>
