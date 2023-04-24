<template>
	<div class="doc-wrapper">
		<div class="btn">
			<el-button plain @click="$router.go(-1)">
				<i class="el-icon-arrow-left"></i> 返 回
			</el-button>

			<el-button type="success" plain @click="updateDoc()" :loading="btnLoading">修 改</el-button>
		</div>
		<div class="doc-detail" v-if="doc">
			<div class="info">
				<h3>{{doc.doc_name}}</h3>
				<span>作者:{{doc.user_info ? doc.user_info.nick_name : '未知'}}</span>
				<span>{{doc.time_formatting}}</span>
				<span>阅读次数:{{doc.view_count}}</span>
				<span>点赞次数:{{doc.like_count}}</span>
			</div>
			<mavon-editor v-model="doc.content_markdown" ref="md" :subfield="false" :editable="false" :toolbarsFlag="false"
				:defaultOpen="'preview'" />
		</div>
	</div>
</template>
<script>
	const CODE_OK = 200;
    import { detail } from "@/api/doc"

	export default {
		name: "docDetail",
		props: {
			docId: [Number, String],
		},
		data() {
			return {
				btnLoading: true,
				doc: Object,
			};
		},
		methods: {
			updateDoc() {
				this.$router.push({
					name: "docEdit"
				});
			},
			async getDocDetail() {
				const {data, http_status, msg} = await detail(this.docId);
                if (http_status === CODE_OK) {
                    this.doc = data;
                    this.btnLoading = !this.btnLoading;
                }else{
                    this.$message.error(msg);
                }
			},
		},
		created() {
			this.getDocDetail();
		},
	};
</script>
<style lang="scss" scoped>
	.doc-wrapper {
		margin: 10px 0 0 0;

		.doc-detail {
			margin: 10px auto;
			background-color: #fff;
			height: 100%;
			min-height: 620px;

			.info {
				margin: 20px 0;

				h3 {
					display: inline-block;
					margin: 0 10px;
				}

				span {
					margin-right: 12px;
					font-size: 12px;
					color: gray;
				}
			}
		}

		.v-note-wrapper {
			min-height: 800px;
		}

		.btn {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
