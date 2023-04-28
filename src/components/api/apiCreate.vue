<template>
	<div class="create-api">
		<div class="box1">
			<el-button @click="returnApiPage">↩ 接口列表</el-button>
			<el-button @click="createApi()">保存</el-button>
		</div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="基本信息" name="first">
				<apiInfo :groupList="groupList" :propertyList="propertyList" :groupId="groupId"
					v-on:update:apiInfo="apiInfo = $event" ref="apiInfo" />
			</el-tab-pane>
			<el-tab-pane label="接口备注" name="second">
				<detailDescription :description="api_description" v-on:update="api_description = $event" />
			</el-tab-pane>
		</el-tabs>

		<requestParams :propertyList="propertyList" v-on:update:header="apiData.http_header = $event"
			v-on:update:param="apiData.http_params = $event" />
		<returnParams :propertyList="propertyList" v-on:update="apiData.response_params = $event" />
	</div>
</template>

<script>
    import { detail, create } from "@/api/api";
    import { lists as groups } from "@/api/group";
	import returnParams from "./units/returnDataParams.vue";
	import requestParams from "./units/requestDataParams.vue";
	import apiInfo from "./units/apiInfo.vue";
	import detailDescription from "./units/detailDescription.vue";
	import getCommonProperty from "../../mixins/getCommonProperty";

	const CODE_OK = 200;
	export default {
		name: "apiCreate",
		props: {},
		mixins: [getCommonProperty],
		created() {
			this.getGroup();
			this.getProperty();
		},
		data() {
			return {
				groupId: this.$route.query.groupId ? this.$route.query.groupId : 0,
				activeName: "first",
				//分组列表
				groupList: [],
				//api属性列表
				propertyList: [],
				//说明和备注
				api_description: "",
				apiInfo: {},
				apiData: {
					http_header: [], //请求头
					http_params: [], //请求参数
					response_params: [], //返回参数
					response_sample: {
						success: [], //返回数据成功
						failed: [], //返回数据失败
					},
				},
				finalData: {},
				errors: "信息填写错误",
			};
		},
		methods: {
			errorHanle(val) {
				this.errors = val;
			},
			//返回api页面
			returnApiPage() {
				this.$router.go(-1);
			},
			//创建api
			createApi() {
				this.$refs.apiInfo.$refs.form.validate((validate) => {
					if (validate) {
						//loading
						let loadingInstance = this.$loading({
							fullscreen: true
						});
						let data = Object.assign(this.finalData, this.apiInfo);
						data = Object.assign(data, this.apiData);
						console.log(data);
						console.log(JSON.stringify(data));
                        // 设置项目Id
                        data.project_id = this.$route.params.projectId;

						create(data)
							.then(
								(res) => {
									if (res.http_status === CODE_OK) {
                                        this.$message.success(res.msg);
										//跳转携带分组参数
										this.$router.push({
											name: "apiList",
											params: {
												groupId: this.$route.query.groupId
											},
										});
									}
									this.$nextTick(() => {
										loadingInstance.close();
									});
								},
								() => {
									this.$nextTick(() => {
										loadingInstance.close();
									});
								}
							);
					} else {
						return false;
					}
				});
			},
            //获取分组数据
            async getGroup() {
                const {data, http_status, msg} = await groups({
                    project_id: this.$route.params.projectId,
                    group_type: 0, // API分组
                });
                this.groupList = data;
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
	/* 第一行按钮 */
	.box1 {
		display: flex;
		justify-content: space-between;
	}
</style>
