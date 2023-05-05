<template>
	<div class="api-detail markdown-body" v-loading="loading">
		<div class="btn-group">
			<el-button @click="returnApiPage">↩ 返 回</el-button>
			<div>
				<el-button @click="copyApi">复制接口</el-button>
				<el-button @click="updateApi()" type="primary">编辑</el-button>
			</div>
		</div>
		<!-- api信息 -->
		<div>
			<h4><span style="color:red;font-weight: bold;">|</span> 基本信息</h4>
			<el-descriptions :column="1" >
				<el-descriptions-item v-if="apiData.group_id" label="分组 ">{{ apiData.group.group_name }}</el-descriptions-item>
				<el-descriptions-item label="API名称 ">{{ apiData.api_name }}</el-descriptions-item>
				<el-descriptions-item label="请求协议 ">{{ apiData.http_protocol }}</el-descriptions-item>
				<el-descriptions-item label="URL ">
					<el-tag size="small">{{ apiData.http_method }}</el-tag>
					{{ apiData.api_url }}
				</el-descriptions-item>
			</el-descriptions>
		</div>
		<!-- api信息-结束 -->
		<div class="content-item" v-if="apiData.api_description">
			<h4><span style="color:red;font-weight: bold;">|</span> API描述</h4>
			<p style="font-size:14px;" v-if="apiData.api_description">{{ apiData.api_description }}</p>
		</div>
		<!-- 请求头信息 -->
		<div class="content-item" v-if="apiData.http_header && apiData.http_header[0]">
			<h4><span style="color:red;font-weight: bold;">|</span> Header 请求参数</h4>
			<el-table
			    :data="apiData.http_header"
			    border
			    style="width: 100%">
			    <el-table-column prop="name" header-align="center"label="参数名">
			    </el-table-column>
			    <el-table-column prop="value" header-align="center" label="参数值">
			    </el-table-column>
			    <el-table-column prop="required" align="center" label="是否必填">
			      	<template slot-scope="scope">
			      		{{ scope.row.required ? '是' : '否'}}
			      	</template>
			    </el-table-column>
			    <el-table-column prop="type" label="参数类型" align="center">
			    </el-table-column>
			    <el-table-column prop="description" label="描述说明" align="center">
			    </el-table-column>
			</el-table>
		</div>
		<!-- 请求头信息-结束 -->
		<!-- 参数信息-start -->
		<div class="content-item" v-if="apiData.http_params && apiData.http_params[0]" style="position: relative;">
			<!-- 对话框 -->
			<el-dialog title="复制到剪贴板" :visible.sync="dialogFormVisible" width="30%">
				<el-form>
					<el-form-item label="分隔符">
						<el-select v-model="delimiter" @change="generateStrParams()">
							<el-option label="冒号(:)" value=":"></el-option>
							<el-option label="逗号(,)" value=","></el-option>
							<el-option label="空格( )" value=" "></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input type="textarea" v-model="copyStr" :rows="8"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="copyToClipboard()">复制</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<h4><span style="color:red;font-weight: bold;">|</span> 请求参数</h4>
			<div @click="copyAsPostman()" style="margin:5px 0;position: absolute;top: -8px;left: 100px;cursor: pointer;">
				<el-tag size="medium">生成调试参数</el-tag>
			</div>
			<el-table
			    :data="apiData.http_params"
			    border
			    style="width: 100%">
			    <el-table-column prop="name" header-align="center"label="参数名">
			    </el-table-column>
			    <el-table-column prop="value" header-align="center" label="参数值">
			    </el-table-column>
			    <el-table-column prop="required" align="center" label="是否必填">
			      	<template slot-scope="scope">
			      		{{ scope.row.required ? '是' : '否'}}
			      	</template>
			    </el-table-column>
			    <el-table-column prop="type" label="参数类型" align="center">
			    </el-table-column>
			    <el-table-column prop="description" label="描述说明" align="center">
			    </el-table-column>
			</el-table>
		</div>
		<!-- 参数信息-end -->

		<!-- 响应 -->
		<div class="content-item" v-show="apiData.response_params && apiData.response_params[0]">
			<h4><span style="color:red;font-weight: bold;">|</span> 响应信息</h4>
			<el-table
			    :data="apiData.response_params"
			    border
			    style="width: 100%">
			    <el-table-column prop="name" header-align="center"label="参数名">
			    </el-table-column>
			    <el-table-column prop="value" header-align="center" label="参数值">
			    </el-table-column>
			    <el-table-column prop="required" align="center" label="是否必填">
			      	<template slot-scope="scope">
			      		{{ scope.row.required ? '是' : '否'}}
			      	</template>
			    </el-table-column>
			    <el-table-column prop="type" label="参数类型" align="center">
			    </el-table-column>
			    <el-table-column prop="description" label="描述说明" align="center">
			    </el-table-column>
			</el-table>
		</div>
		<!-- 响应-结束 -->

		<div class="content-item">
			<div v-if="apiData.response_sample && apiData.response_sample.success && apiData.response_sample.failed">
				<h4><span style="color:red;font-weight: bold;">|</span> 响应示例</h4>

				<div v-if="apiData.response_sample.success && Object.keys(apiData.response_sample.success).length > 0">
					<h5 v-show="apiData.response_sample.success">成功</h5>
					<pre v-show="apiData.response_sample.success" v-html="syntaxHighlight(apiData.response_sample.success)"></pre>
					<!--
					<json-viewer :value="apiData.response_sample.success" copyable theme="my-awesome-json-theme"></json-viewer>
					-->
				</div>

				<div v-if="apiData.response_sample.failed && Object.keys(apiData.response_sample.failed).length > 0">
					<h5 v-show="apiData.response_sample.failed">失败</h5>
					<pre v-show="apiData.response_sample.failed" v-html="syntaxHighlight(apiData.response_sample.failed)"></pre>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const CODE_OK = 200;
	import { detail } from "@/api/api"

	function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

	export default {
		name: "apiDetail",
		props: {
			apiId: [Number, String],
		},
		created() {
			this.getApiDetail();
		},
		data() {
			return {
				delimiter: ":",
				dialogFormVisible: false,
				copyStr: "",
				loading: true,
				apiData: {},
			};
		},
		methods: {
			syntaxHighlight,
			copyToClipboard() {
				if (this.$clipboard(this.copyStr) === true) {
					this.$message.success("复制成功，使用ctrl + v粘贴");
					this.dialogFormVisible = !this.dialogFormVisible;
				}
			},
			//复制为postman参数
			copyAsPostman() {
				this.generateStrParams();
				this.dialogFormVisible = true;
			},
			//生成参数字符串
			generateStrParams() {
				this.copyStr = "";
				for (let value of this.apiData.http_params) {
					this.copyStr +=
						value.name +
						this.delimiter +
						(value.value ? value.value : "unknown") +
						"\r\n";
				}
			},
			updateApi() {
				this.$router.push({
					name: "apiEdit",
					params: {
						apiId: this.apiId
					}
				});
			},
			returnApiPage() {
				this.$router.go(-1);
			},
			//获取api详情
			async getApiDetail() {
				const {data, http_status, msg} = await detail(this.apiId);
                if (http_status === CODE_OK) {
                    this.apiData = data;
                    this.btnLoading = !this.btnLoading;
                }else{
                    this.$message.error(msg);
                }
                this.loading = false;
			},
			copyApi() {
				this.$router
					.push({
						name: "apiEdit",
						query: {
							copy: true
						},
					})
					.catch(() => {});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.api-detail {
		padding-left: 10px;

		.btn-group {
			display: flex;
			justify-content: space-between;
		}

		.api-detail-info {
			padding: 10px;
			position: relative;
			background-color: #fff;
			margin: 10px 0;
			border-radius: 2px;

			em i {
				font-style: normal;
				background-color: #4caf4fc7;
				color: white;
				padding: 5px 6px;
				margin-left: 5px;
				border-radius: 4px;
				display: inline-block;
				text-align: center;
			}

			i {
				font-style: normal;
				font-weight: bold;
				min-width: 100px;
				display: inline-block;
				text-align: center;
			}

			em {
				font-style: normal;
				font-size: 15px;
				font-weight: 700;
				margin-right: 5px;
				min-width: 100px;
				display: inline-block;
			}

			span {
				font-style: normal;
				font-size: 15px;
				font-weight: 700;
				display: inline-block;
				text-align: center;
				width: 5%;
			}

			.api-detail-comment {
				width: 100%;
				height: 150px;
				border-radius: 4px;
				box-sizing: border-box;
				padding: 8px;
				font-size: 14px;
			}
		}

		.content-item {
			margin: 10px 0;
			box-sizing: border-box;
			border-radius: 6px;

			table {
				border-collapse: collapse;
				font-size: 14px;
		    	// display: block;
			    width: 100%;
			    overflow: auto;

				th,
				td {
					border: 1px solid black;
					padding: 5px 15px;
					max-width: 500px;
					word-break: break-all;
				}

				th {
					font-size: 16px;
					font-weight: 600;
					background-color: #fff;
					border-top: 1px solid #c6cbd1;
				}
			}

			pre {
				border-radius: 10px;
				/*
				background-color: rgba(128, 128, 128, 0.473);
				*/
			}
		}
	}

	/deep/ pre {
        outline: 1px solid #ccc;
        padding: 5px;
        margin: 5px;
    }

    /deep/ .string {
        color: green;
    }

    /deep/ .number {
        color: darkorange;
    }

    /deep/ .boolean {
        color: blue;
    }

    /deep/ .null {
        color: magenta;
    }

    /deep/ .key {
        color: red;
    }
</style>
