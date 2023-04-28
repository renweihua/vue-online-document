<template>
	<div class="api-info-box">
		<div class="info">
			<el-form :model="apiInfo" :rules="rules" ref="form">
				<el-form-item>
					<el-col :span="5">
						<el-form-item prop="group_id" label="分组" label-width="80px">
							<el-cascader
							    v-model="apiInfo.group_id"
							    placeholder="默认为一级分组"
							    :options="groupList"
							    :props="{
									children: '_child',
									label: 'group_name',
									expandTrigger: 'hover',
									// 选择任意一级选项
									checkStrictly: 'true',
									// 指定选项的值为选项对象的某个属性值
									value: 'group_id',
									// 指定选项标签为选项对象的某个属性值
									label: 'group_name',
								}"
							    clearable
							    filterable
							    @change="selectGroupHandleChange">
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="请求协议" prop="http_protocol" label-width="80px">
							<el-select v-model="apiInfo.http_protocol" placeholder="选择请求协议">
								<el-option v-if="propertyList && propertyList.http_protocol" v-for="item in propertyList.http_protocol" :key="item" :label="item" :value="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="5">
						<el-form-item label="请求方式" prop="http_method" label-width="80px">
							<el-select v-model="apiInfo.http_method" placeholder="选择请求方式">
								<el-option-group
									v-if="propertyList && propertyList.http_method"
					                v-for="(group, index) in propertyList.http_method"
					                :key="index"
					                :label="group.label"
					            >
	                            	<el-option v-for="item in group.options" :key="item" :label="item" :value="item"></el-option>
	                            </el-option-group>
							</el-select>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="api_url" prop="api_url" label-width="80px">
					<el-input v-model="apiInfo.api_url"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="api_name" label-width="80px">
					<el-input v-model="apiInfo.api_name"></el-input>
				</el-form-item>
				<el-form-item label="对象名" prop="object_name" label-width="80px">
					<el-input v-model="apiInfo.object_name" placeholder="非必填"></el-input>
				</el-form-item>
				<el-form-item label="方法名" prop="function_name" label-width="80px">
					<el-input v-model="apiInfo.function_name" placeholder="非必填"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: "apiInfo",
		props: {
			groupList: Array,
			propertyList: [Array, Object],
			apiData: Object,
			groupId: [String, Number],
			isUpdate: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
		},
		data() {
			return {
				rules: {
					http_protocol: [{
						required: true,
						message: "请选择协议类型",
						trigger: "blur"
					}, ],
					http_method: [{
						required: true,
						message: "请选择分组",
						trigger: "blur"
					}, ],
					http_return_type: [{
						required: true,
						message: "请选择分组",
						trigger: "blur"
					}, ],
					url: [{
						required: true,
						message: "请输入url",
						trigger: "blur"
					}],
					api_name: [{
						required: true,
						message: "请输入api名称",
						trigger: "blur"
					}, ],
				},
				apiInfo: {
					group_id: 0, //分组
					project_id: 0, //项目Id
					protocol_type: "", //协议
					http_protocol: "", //http请求方法
					http_return_type: "", //返回值类型
					url: "", //http请求URL
					api_name: "", //接口名称
					object_name: "", //对象名
					function_name: "", //程序内部方法名
					develop_language: "", //接口开发语言
					id: 0,
					realGroupId: null,
				},
				childGroup: [],
			};
		},
		watch: {
			apiData: function() {
				this.apiInfo = this.apiData;
			},
			apiInfo: {
				handler: function(newdata) {
					this.$emit("update:apiInfo", newdata);
				},
				deep: true,
			},
			propertyList: function(val) {
				if (this.apiInfo.id <= 0) {
					for (let item in val) {
						switch (item) {
							case "http_method":
								this.apiInfo.http_method = val[item][0];
								break;
							case "http_protocol":
								this.apiInfo.http_protocol = val[item][0];
								break;
							case "http_return":
								this.apiInfo.http_return_type = val[item][0];
								break;
						}
					}
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	dl dd div {
		display: inline-block;
		width: 95%;
	}

	.info {
		border: 1px solid #dddddd;
		padding: 20px 10px 0 0;
		position: relative;
		background-color: #fff;
		box-sizing: border-box;
	}

	.info em {
		font-style: normal;
		font-size: 12px;
		font-weight: 700;
		margin: 0 5px;
		display: inline-block;
		color: red;
	}

	.info p {
		display: inline-block;
	}

	.info span {
		font-style: normal;
		font-size: 12px;
		font-weight: 700;
		display: inline-block;
		text-align: left;
		width: 4%;
	}

	.info dl dd {
		margin: 10px 0;
	}

	.info input,
	select {
		padding: 0;
		outline: none;
		border: 1px solid #ddd;
		height: 28px;
		border-radius: 3px;
	}

	.info input {
		width: 80%;
		box-sizing: border-box;
		padding-left: 10px;
	}

	.info dl dd {
		font-size: 0;
		text-align: left;
	}

	.info dl dd select {
		font-size: 12px;
		margin: 0 5px;
	}

	.info dl dd i {
		font-size: 12px;
		font-style: normal;
		margin-right: 4px;
		font-weight: 600;
	}

	.info dl dd:first-child select {
		margin-left: 0;
	}
</style>
