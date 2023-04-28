<template>
	<div class="info">
		<ul>
			<li>
				<span class="span-label">分组:</span>
				<el-cascader v-model="content.group_id"
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
                    filterable>
				</el-cascader>
			</li>
			<li>
				<span class="span-label">标题:</span>
				<el-input v-model="content.doc_name" placeholder="请输入标题" style="width:50%"></el-input>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			groupList: [Array, Object],
			doc: Object,
			isUpdate: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				content: {
					groupId: null,
					groupIdSecond: null,
					doc_name: "",
				},
				childGroups: [],
			};
		},
		created() {},
		methods: {
			createChildGroupList() {
				for (const item of this.groupList) {
					if (item["id"] == this.content.groupId) {
						this.childGroups = item["childs"];
					}
				}
			},
			updateChilds() {
				if (this.isUpdate && this.content.groupId) {
					let val = this.groupList;
					for (const key in val) {
						if (Object.hasOwnProperty.call(val, key)) {
							const element = val[key];
							if (element.id == this.content.groupId) {
								this.childGroups = element.childs;
								break;
							}
						}
					}
				}
			},
		},
		watch: {
			content: {
				handler: function(val) {
					this.$emit("update-info", val);
				},
				deep: true,
			},
			doc: function(val) {
				this.content.groupId = val.group_id;
				this.content.groupIdSecond = val.group_id_second;
				this.content.doc_name = val.doc_name;
				this.updateChilds();
			},
			groupList: function() {
				this.updateChilds();
			},
		},
	};
</script>
<style lang="scss" scoped>
	.info {
		ul {
			margin: 0;
			padding: 0;

			li {
				padding: 5px 0;
				list-style: none;
			}
		}

		li .span-label {
			display: inline-block;
			min-width: 50px;
			text-align: right;
			padding-right: 20px;
			font-size: 12px;
			font-weight: 600;

			&:nth-child(3) {
				margin-left: 10px;
			}
		}
	}
</style>