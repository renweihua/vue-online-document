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
		<div class="api-detail-info">
			<em>
				分组:
				<i>{{apiData.group_name}}</i>
			</em>
			<el-divider direction="vertical"></el-divider>
			<em>
				请求协议:
				<i>{{apiData.http_protocol ? apiData.http_protocol : 'unknown'}}</i>
			</em>
			<el-divider direction="vertical"></el-divider>
			<em>
				请求方式:
				<i>{{apiData.http_method ? apiData.http_method : 'unknown'}}</i>
			</em>
			<el-divider direction="vertical"></el-divider>
			<i>{{apiData.api_url ? apiData.api_url : 'unknown'}}</i>
			<el-divider direction="vertical"></el-divider>

			<i>{{apiData.api_name ? apiData.api_name : 'unknown'}}</i>
		</div>
		<!-- api信息-结束 -->
		<p style="font-size:14px;" v-if="apiData.api_description">{{ apiData.api_description }}</p>
		<!-- 请求头信息 -->
		<div class="content-item" v-if="apiData.http_header && apiData.http_header[0]">
			<table>
				<tr>
					<td colspan="2" style="text-align:center;">请求头</td>
				</tr>
				<tr>
					<th>头</th>
					<th>值</th>
				</tr>
				<tbody>
					<tr v-for="(item,index) in apiData.http_header" :key="index">
						<td>{{item.name}}</td>
						<td>{{item.content}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 请求头信息-结束 -->
		<!-- 参数信息-start -->
		<div class="content-item" v-if="apiData.http_params && apiData.http_params[0]">
			<div @click="copyAsPostman()" style="margin:5px 0;">
				<el-button size="mini">生成调试参数</el-button>
			</div>
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

			<table>
				<tr>
					<td colspan="5" style="text-align:center;">请求参数</td>
				</tr>
				<tr>
					<th>参数</th>
					<th>说明</th>
					<th>必填</th>
					<th>类型</th>
					<th>示例</th>
				</tr>
				<tbody>
					<tr v-for="(item,index) in apiData.http_params" :key="index">
						<td>{{item.name}}</td>
						<td>{{item.desc}}</td>
						<td>{{item.required}}</td>
						<td>{{item.type}}</td>
						<td>{{item.example}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 参数信息-end -->

		<!-- 响应 -->
		<div class="content-item" v-show="apiData.response_params && apiData.response_params[0]">
			<table>
				<tr>
					<td colspan="5" style="text-align:center;">响应信息</td>
				</tr>
				<tr>
					<th>字段</th>
					<th>类名</th>
					<th>说明</th>
					<th>必含</th>
					<th>类型</th>
				</tr>
				<tbody v-if=" apiData.response_params && apiData.response_params[0]">
					<tr v-for="(item,index) in apiData.response_params" :key="index">
						<td>{{item.fieldName}}</td>
						<td>{{item.objectName}}</td>
						<td>{{item.description}}</td>
						<td>{{item.required}}</td>
						<td>{{item.type}}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="5">无</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 响应-结束 -->

		<div class="content-item">
			<div v-if="apiData.response_sample">
				<h5>响应数据示例</h5>

				<h5 v-show=" apiData.response_sample.success">成功</h5>
				<pre v-show="apiData.response_sample.success" v-html="syntaxHighlight(apiData.response_sample.success)"></pre>
				<json-viewer :value="apiData.response_sample.success" copyable theme="my-awesome-json-theme"></json-viewer>


				<div v-if="apiData.response_sample.failed">
					<h5 v-show="apiData.response_sample.failed">失败</h5>
					<pre v-show="apiData.response_sample.failed" v-html="syntaxHighlight(apiData.response_sample.failed)"></pre>
					<json-viewer :value="apiData.response_sample.failed" copyable theme="my-awesome-json-theme"></json-viewer>
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
						(value.example ? value.example : "unknown") +
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
				font-size: 12px;
				font-weight: 700;
				margin-right: 5px;
				min-width: 100px;
				display: inline-block;
			}

			span {
				font-style: normal;
				font-size: 12px;
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
			padding: 10px 8px;
			box-sizing: border-box;
			border-radius: 6px;

			table {
				border-collapse: collapse;
				font-size: 14px;
		    	display: block;
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
