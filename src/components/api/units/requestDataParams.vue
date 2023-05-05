<template>
	<div class="request-box">
		<div class="request">
			<div class="item-head">
				<button @click="show=0" :class="{'tab-change-btn-bg' : show==0}"
					class="req-btn req-btn-first">请求头部</button>
				<button @click="show=1" :class="{'tab-change-btn-bg' : show==1}" class="req-btn">请求参数</button>
			</div>
			<table v-show="show==0">
				<tr>
					<th>参数名</th>
					<th>参数值</th>
					<th>必填</th>
					<th>参数类型</th>
					<th>描述说明</th>
					<th>操作</th>
				</tr>
				<tr v-for="(item,index) in apiParamHeaderItem" :key="item.id">
					<td>
						<input type="text" placeholder="参数名" v-model="item.name"
							v-on:input="apiParamHeaderInput(index, $event)" class="content" />
					</td>
					<td>
						<input class="content" type="text" placeholder="参数值" v-model="item.value" />
					</td>
					<td>
						<input type="checkbox" name id v-model="item.required" />
					</td>
					<td>
						<el-select v-model="item.type" placeholder="请设置字段类型">
							<el-option-group
								v-if="propertyList && propertyList.field_type"
				                v-for="(group, index) in propertyList.field_type"
				                :key="index"
				                :label="group.label"
				            >
                            	<el-option v-for="item in group.options" :key="item" :label="item" :value="item"></el-option>
                            </el-option-group>
						</el-select>
					</td>
					<td>
						<input class="content" type="text" placeholder v-model="item.description" />
					</td>
					<td>
						<el-button size="small" v-if="item.value.length >= 1" icon="el-icon-delete"
							@click="apiParamHeaderDelete(index)" plain></el-button>
					</td>
				</tr>
			</table>

			<!-- 请求参数开始 -->
			<table v-show="show==1">
				<tr>
					<th>参数名</th>
					<th>参数值</th>
					<th>必填</th>
					<th>参数类型</th>
					<th>描述说明</th>
					<th>操作</th>
				</tr>
				<tr v-for="(item,index) in apiParamItem" :key="item.id">
					<td>
						<input class="content" type="text" placeholder="参数名" v-on:input="apiParamInput(index,$event)"
							v-model="item.name" />
					</td>
					<td>
						<input class="content" type="text" placeholder="参数示例" v-model="item.value" />
					</td>
					<td>
						<input type="checkbox" name id v-model="item.required" />
					</td>
					<td>
						<el-select v-model="item.type" placeholder="请设置字段类型">
							<el-option-group
								v-if="propertyList && propertyList.field_type"
				                v-for="(group, index) in propertyList.field_type"
				                :key="index"
				                :label="group.label"
				            >
                            	<el-option v-for="item in group.options" :key="item" :label="item" :value="item"></el-option>
                            </el-option-group>
						</el-select>
					</td>
					<td>
						<input class="content" type="text" placeholder v-model="item.description" />
					</td>
					<td>
						<div v-show="item.name.length >= 1">
							<el-button icon="el-icon-delete" @click="apiParamdelete(index)" size="mini"></el-button>
						</div>
					</td>
				</tr>
			</table>
			<!-- 请求参数结束 -->
		</div>
	</div>
</template>

<script>
	export default {
		name: "requestDataParams",
		props: {
			propertyList: [Object, Array],
			header: {
				type: [Array, Object],
				default: function() {
					return [{
						name: "",
						content: "",
						handle: true,
						is_add: false,
					}, ];
				},
			},
			params: {
				type: [Array, Object],
				default: function() {
					return [{
						name: "",
						description: "",
						required: false,
						type: "string",
						value: "",
						handle: true,
						is_add: false,
					}, ];
				},
			},
		},
		computed: {},

		created() {},
		data: function() {
			return {
				show: 1,
				apiParamHeaderItem: [{
					name: "",
					value: "",
					description: "",
					required: true,
					type: "string",
					handle: true,
					is_add: false,
				}, ],
				apiParamItem: [{
					name: "",
					description: "",
					required: true,
					type: "string",
					value: "",
					handle: true,
					is_add: false,
				}, ],
			};
		},
		watch: {
			header: function(val) {
				if (val.length) {
					this.apiParamHeaderItem = JSON.parse(JSON.stringify(val));
					this.apiParamHeaderItem.push({
						name: "",
						value: "",
						description: "",
						required: true,
						type: "string",
						handle: true,
						is_add: false,
					});
				}
			},
			params: function(val) {
				if (val.length) {
					this.apiParamItem = JSON.parse(JSON.stringify(val));
					this.apiParamItem.push({
						name: "",
						description: "",
						required: true,
						type: "string",
						value: "",
						handle: true,
						is_add: false,
					});
				}
			},
			apiParamHeaderItem: function(val) {
				this.$emit("update:header", val.slice(0, val.length - 1));
			},
			apiParamItem: function(val) {
				this.$emit("update:param", val.slice(0, val.length - 1));
			},
		},
		methods: {
			//检测apiParam输入
			apiParamInput(index, event) {
				let txt = event.target.value;
				if (event) {
					if (txt.length >= 1 && this.apiParamItem[index].is_add === false) {
						this.apiParamItem.push({
							name: "",
							description: "",
							required: true,
							type: "string",
							value: "",
							handle: true,
							is_add: false,
						});
						this.apiParamItem[index].is_add = true;
					}
				}
			},
			//检测apiParam header输入
			apiParamHeaderInput(index, event) {
				if (event) {
					let txt = event.target.value;

					if (txt.length >= 1 && this.apiParamHeaderItem[index].is_add === false) {
						this.apiParamHeaderItem.push({
							name: "",
							value: "",
							description: "",
							required: true,
							type: "string",
							handle: true,
							is_add: false,
						});
						this.apiParamHeaderItem[index].is_add = true;
					}
				}
			},
			//apiParam删除
			apiParamdelete(key) {
				this.apiParamItem.splice(key, 1);
			},
			//apiParamheader删除
			apiParamHeaderDelete(key) {
				this.apiParamHeaderItem.splice(key, 1);
			},
		},
	};
</script>

<style scope>
	.request {
		margin-top: 10px;
		font-size: 14px;
	}

	.request ul {
		overflow: hidden;
	}

	.request ul li {
		float: left;
		list-style: none;
	}

	.request table {
		width: 100%;
		background-color: #fff;
	}

	.request header {
		background-color: #fff;
		border-top: 1px solid #ddd;
		border-left: 1px solid #ddd;
		border-right: 1px solid #ddd;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.request header button {
		margin-left: 5px;
	}

	.request table,
	.request td,
	.request th {
		border: 1px solid #ddd;
		border-collapse: collapse;
	}

	.request th {
		background-color: #fafafa;
	}

	.request table tr,
	.request header {
		height: 40px;
	}

	.request input.content {
		border: none;
		height: 40px;
		width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		/* outline: none; */
	}

	.request td {
		text-align: center;
	}

	.request input[type="checkbox"] {
		width: 80%;
	}

	button.req-btn {
		background-color: #efefef;
		border: 1px solid #dddddd;
		width: 90px;
		height: 30px;
		font-size: 12px;
		margin: 0;
		padding: 0;
		outline: none;
		border-bottom: none;
	}

	button.req-btn-first {
		border-right: none;
	}

	/* tab切换按钮颜色 */
	div.item-head .tab-change-btn-bg {
		background-color: #fff;
	}

	.request-box table tr:hover td,
	.request-box table tr:hover input {
		background-color: rgba(164, 219, 132, 0.103);
	}
</style>
