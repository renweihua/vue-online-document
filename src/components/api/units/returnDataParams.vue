<template>
	<div class="return-params">
		<div class="data-params">
			<header>
				<span>返回参数</span>
			</header>
			<header>
				<el-button @click="dialogFormVisible = true" size="mini" style="margin-left:5px">导入json</el-button>
				<el-dialog title="填入响应json" :visible.sync="dialogFormVisible" :show-close="false">
					<el-input type="textarea" v-model="jsonData" :rows="15"></el-input>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="handleJsonData()">确 定</el-button>
					</div>
				</el-dialog>
			</header>
			<table>
				<tr>
					<th>参数名</th>
					<th>参数值</th>
					<th>必含</th>
					<th>类型</th>
					<th>描述说明</th>
					<th>操作</th>
				</tr>
				<tr v-for="(item,index) in returnDataItem" :key="item.id">
					<td>
						<input type="text" placeholder="参数名" v-model="item.name"
							v-on:input="dataInput(index,$event)" />
					</td>
					<td>
						<input type="text" placeholder="参数值" v-model="item.value" />
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
						<input type="text" v-model="item.description" />
					</td>
					<td>
						<div>
							<el-button size="mini" icon="el-icon-delete" @click="dataDelete(index)"></el-button>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "returnDataParams",
		props: {
			propertyList: [Object, Array],
			returnData: Array,
			responseSample: Object,
		},
		data: function() {
			return {
				dialogFormVisible: false,
				returnDataItem: [{
					name: "",
					value: "",
					type: "string",
					description: "",
					required: false,
					handle: true,
					is_add: false,
				}, ],
				jsonData: "",
			};
		},
		methods: {
			//处理导入Json数据
			handleJsonData() {
				this.dialogFormVisible = false;
				let data = [];
				let json = null;
				try {
					json = JSON.parse(this.jsonData);
				} catch (e) {
					this.$message.error("解析json数据失败");
					this.jsonData = "";
					return;
				}

				this.parseJson(json, data);
				this.generatorItem(data);
				// 设置成功json
				this.responseSample.success = json;
			},
			//生成返回数据条目
			generatorItem(items) {
				if (!items) {
					return;
				}

				this.returnDataItem = [];
				for (let item of items) {
					this.returnDataItem.push({
						name: item,
						value: "",
						description: "",
						required: true,
						type: "string",
						handle: true,
						is_add: false,
					});
				}

				this.returnDataItem.push({
					name: "",
					value: "",
					description: "",
					required: true,
					type: "string",
					handle: true,
					is_add: false,
				});
			},
			//json解析方法
			parseJson(jsonObj, data = [], sparator = "") {
				//数组的处理
				if (Array.isArray(jsonObj)) {
					this.parseJson(jsonObj[0], data);
				}

				//处理对象
				if (Object.prototype.toString.call(jsonObj) === "[object Object]") {
					for (let v in jsonObj) {
						data.push(sparator + v);
						let element = jsonObj[v];
						//v是键， element是值
						if (Object.prototype.toString.call(element) === "[object Object]") {
							this.parseJson(element, data, sparator + ">");
						}

						if (Array.isArray(element)) {
							this.parseJson(element[0], data, sparator + ">");
						}
					}
				}
			},
			//检查输入
			dataInput(index, event) {
				if (event) {
					let txt = event.target.value;
					if (txt.length >= 1 && this.returnDataItem[index].is_add === false) {
						this.returnDataItem.push({
							name: "",
							value: "",
							description: "",
							required: false,
							type: "string",
							handle: true,
							is_add: false,
						});
						this.returnDataItem[index].is_add = true;
					}
				}
			},
			//删除
			dataDelete(key) {
				this.returnDataItem.splice(key, 1);
			},
		},
		watch: {
			returnDataItem: function(val) {
				this.$emit("update", val.slice(0, val.length - 1));
			},
			returnData: function(val) {
				if (val.length) {
					this.returnDataItem = val;
				}
			},
			responseSample: function(val) {
				if (val) {
					this.responseSample = val;
					if(val.success) this.jsonData = JSON.stringify(val.success);
				}
			},
			setResponseSample: function(val) {
				this.$emit("update:setResponseSample", val);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.data-params {
		font-size: 14px;
		margin-top: 10px;
	}

	.data-params header span {
		margin-left: 5px;
		font-weight: 700;
	}

	.data-params table {
		width: 100%;
		background-color: #fff;
	}

	.data-params header {
		background-color: #fff;
		border-top: 1px solid #ddd;
		border-left: 1px solid #ddd;
		border-right: 1px solid #ddd;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.data-params table,
	.data-params td,
	.data-params th {
		border: 1px solid #ddd;
		border-collapse: collapse;
	}

	.data-params th {
		background-color: #fafafa;
	}

	.data-params table tr,
	.data-params header {
		height: 40px;
	}

	.data-params input[type="text"] {
		border: none;
		height: 40px;
		width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		outline: none;
	}

	.data-params td {
		text-align: center;
	}

	.data-params header:nth-child(1) span {
		margin-left: 12px;
	}

	.data-params header:nth-child(2) span {
		border: 1px solid #bcdffb;
		padding: 5px 7px;
		border-radius: 3px;
		background-color: #e3f7ff;
		color: #3692ed;
		font-weight: 500;
	}

	.item-head {
		position: relative;
		height: 31px;
	}

	.item-head ul {
		position: absolute;
		bottom: -1px;
	}

	.return-params table tr:hover td,
	.return-params table tr:hover input {
		background-color: rgba(164, 219, 132, 0.103);
	}
</style>
