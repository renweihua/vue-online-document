<template>
	<div class="group">
		<!-- 分组操作-start -->
		<ul v-show="groups" class="operator">
			<li>
				<a href="javascript:;" @click="clientBtn(null,null)">
					<i class="el-icon-s-order"></i>
					<slot>全 部</slot>
				</a>
			</li>
			<li @click="dialogFormVisible = true;form.group_id = 0;groupDiaText = '新增分组';" v-show="controlShow()">
				<a href="javascript:;">
					<i class="el-icon-delete"></i> 新增分组
				</a>
			</li>
			<li class="last-item" v-if="false">
				<a href="javascript:;" @click="clientBtn(-1,null)">
					<i class="el-icon-delete"></i> 回 收 站
				</a>
			</li>
		</ul>
		<!-- 分组操作-end -->

		<!-- 分组列表-start -->

		<!-- Tree -->
		<el-input placeholder="输入关键字进行过滤" v-model="filterText">
		</el-input>
		<!--
		highlight-current 是否高亮当前选中节点，默认值是 false。

		default-expand-all 是否默认展开所有节点

		draggable 是否开启拖拽节点功能

		expand-on-click-node 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。

		default-expanded-keys 默认展开的节点的 key 的数组
		-->
		<el-tree :filter-node-method="filterNode" ref="tree" :props="defaultProps" class="filter-tree" :data="groups"
  		:default-expanded-keys="defaultExpandByGroups"
			node-key="group_id"
			:expand-on-click-node=false
			:default-expand-all=false
			highlight-current
			draggable
			@node-drag-start="handleDragStart"
			@node-drag-enter="handleDragEnter"
			@node-drag-leave="handleDragLeave"
			@node-drag-over="handleDragOver"
			@node-drag-end="handleDragEnd"
			@node-drop="handleDrop"
			:allow-drop="allowDrop"
			:allow-drag="allowDrag"
			icon-class="el-icon-folder-opened">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ node.label }}</span>
				<el-dropdown trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						<span class="el-icon-s-unfold"></span>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-if="data.default_expand == 0" icon="el-icon-open" :command="{action:'default_expand',item:data, node:node}">默认打开子节点</el-dropdown-item>
						<el-dropdown-item v-else icon="el-icon-turn-off" :command="{action:'default_expand',item:data, node:node}">默认关闭子节点</el-dropdown-item>

						<el-dropdown-item icon="el-icon-top" :command="{action:'sort',item:data}">上移</el-dropdown-item>
						<el-dropdown-item icon="el-icon-bottom" :command="{action:'sort',item:data}">下移</el-dropdown-item>

						<el-dropdown-item icon="el-icon-edit-outline" :command="{action:'edit',item:data, node:node}">编辑</el-dropdown-item>
						<el-dropdown-item icon="el-icon-delete-solid" :command="{action:'delete',item:data, node:node}">删除</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</span>
		</el-tree>
		<!-- 分组列表-end -->

		<!-- 新增/编辑 分组-start -->
		<el-dialog :title="groupDiaText" :visible.sync="dialogFormVisible" width="40%">
			<el-form :model="form" ref="form">
				<el-form-item label="上级" :label-width="formLabelWidth">
					<el-cascader
					    v-model="form.parent_id"
					    placeholder="默认为一级分组"
					    :options="selectGroups"
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

				<el-form-item label="组名" :label-width="formLabelWidth">
					<el-input v-model="form.group_name" autocomplete="off" style="width:70%"></el-input>
				</el-form-item>

				<el-form-item label="子节点是否默认展示" :label-width="formLabelWidth">
					<el-select v-model="form.default_expand">
					    <el-option
					      v-for="item in [{'label': '否', 'value': 0}, {'label': '是', 'value': 1}]"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="form && form.group_id > 0 ? updateGroup() : createGroup()">确 定</el-button>
					<el-button @click="dialogFormVisible = false">取 消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 新增/编辑 分组-end -->
	</div>
</template>

<script>
	import controlShow from "../../mixins/controlShow";
	import {
		lists,
		create,
		update,
		batchSave,
		deleteGroup,
		setDefaultExpand
	} from "@/api/group";

	const CODE_OK = 200;
	export default {
		name: "group",
		props: {
			showIsEdit: {
				type: Boolean,
				default: false,
			},
			formLabelWidth: {
				type: String,
				default: "80",
			},
			// 0.API分组
			type: {
				type: Number,
				default: 0,
			},
		},
		created() {
			if (this.groups.length < 1) {
				this.getGroup(this.$route.params.projectId);
			}
		},
		data() {
			return {
				node: {},
				// 分组弹出层的文本
				groupDiaText: '新增分组',
				// 分组列表
				groups: [],
				// 下拉选择的分组列表：编辑分组时，需要设置自己为`禁用不可选项`
				selectGroups: [],
				// 默认展示子节点的分组Id
				defaultExpandByGroups: [],
				// 表单数据
				form: {
					group_id: 0,
					group_type: this.type,
					project_id: this.$route.params.projectId,
					parent_id: 0,
					group_name: "",
					default_expand:0,
				},

				curr: 1,
				pageSize: 100,
				dialogFormVisible: false,


				// 树形控件
				filterText: '',
				defaultProps: {
					children: '_child',
					label: 'group_name'
				},
			};
		},
		methods: {
			// 选择父级分组
			selectGroupHandleChange(item){
				this.form.parent_id = item[item.length - 1] || 0;
			},
			//获取分组列表
			async getGroup(projectId) {
				const {
					data,
					http_status,
					msg
				} = await lists({
					group_type: this.type,
					project_id: projectId ? projectId : 0,
				});
				this.selectGroups = this.groups = data;
				// 设置默认展示子节点的分组Id
				this.setDefaultExpand();
			},
			// 设置默认展示子节点的分组Id
			setDefaultExpand(){
				this.defaultExpandByGroups = this.getDefaultExpandIds(this.groups);
			},
			// 获取默认展示子节点的分组Ids
			getDefaultExpandIds(groups){
				let ids = [];
				groups.map((item)=>{
					if(item.default_expand == 1){
						ids.push(item.group_id);
					}
					if(item._child !== undefined){
						ids = ids.concat(this.getDefaultExpandIds(item._child));
					}
				});
				return ids;
			},
			//删除分组
			delete(item) {
				if (!item) {
					this.$message.error("无效的分组！");
					return;
				}

				this.$confirm(
				'确定要删除分组`' + item.group_name + '`?<br>\r\n\n <strong><span style="color: #f56c6c;">删除之后将无法恢复，请谨慎操作！</span></strong>'
				, "提示", {
						dangerouslyUseHTMLString: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteGroup({
								group_id: item.group_id
							})
							.then((res) => {
								if (res.http_status === this.HTTP_SUCCESS) {
									this.$message.success(res.msg);
								}
								this.getGroup(
									this.$route.params.projectId
								);
							});
					})
					.catch(() => {
						this.showCreateGroup = false;
					});
			},
			//点击分组
			clientBtn(group, index, isChild = false) {
				this.$emit("change-group", group ? group.group_id : 0);
			},
			//更新数据
			async updateGroup() {
				let old_parent_id = this.form.parent_id;
				if (this.form.group_name.length < 1) {
					this.$message.error("分组名称不能为空");
					return;
				}
				const {
					data,
					http_status,
					msg
				} = await update(this.form);

				if (http_status === this.HTTP_SUCCESS) {
					this.$message.success(msg);

					this.form.group_name = "";
					this.form.parent_id = 0;
					this.form.default_expand = 0;

					// 关闭弹出层
					this.dialogFormVisible = false;

					// 更改分组层级，则重新加载
					// this.node.parent.data.group_id == 当前节点的父级Id
					if(old_parent_id != this.node.parent.data.group_id){
						// 重新加载分组
						this.getGroup(
							this.$route.params.projectId
						);
					}else{
						// 更新对应tree节点的数据，无需重新加载
						this.node.data.group_name = data.group_name;
						this.node.data.default_expand = data.default_expand;
					}
				}
			},
			async createGroup() {
				if (this.form.group_name.length < 1) {
					this.$message.error("分组名称不能为空");
					return;
				}

				const {
					data,
					http_status,
					msg
				} = await create(this.form);

				if (http_status === CODE_OK) {
					this.form.group_name = '';
					this.form.parent_id = 0;
					this.form.default_expand = 0;
					this.$message.success(msg);
				}

				this.getGroup(
					this.$route.params.projectId
				);

				this.dialogFormVisible = false;
			},
			// `分组`的点击事件
			async handleCommand(command) {
				console.log(command);
				console.log(command.node);
				if (command.action === "delete") {
					this.delete(command.item);
				} else if (command.action === "edit") {
					this.showUpdateDiglog(command.node);
				} else if (command.action === "sort") { // 排序

				} else if (command.action === "default_expand") { // 子节点是否展示
					command.item.default_expand = command.item.default_expand == 0 ? 1 : 0;
					// 现有tree的子节点是否打开的标识
					command.node.expanded = command.item.default_expand ? true : false;

					const {
						data,
						http_status,
						msg
					} = await setDefaultExpand({
						group_id: command.item.group_id,
						default_expand: command.item.default_expand,
					});

					if (http_status === this.HTTP_SUCCESS) {
						this.$message.success(msg);
					}
				}
			},
			showUpdateDiglog(node) {
				this.groupDiaText = '编辑分组';
				this.form = node.data;
				this.dialogFormVisible = true;
				// 设置下拉框的分组数据
				this.selectGroups = this.setGroupDisabledBySelf(this.groups);
				this.node = node;
			},
			// 获取默认展示子节点的分组Ids
			setGroupDisabledBySelf(groups){
				if(!this.form || !this.form.group_id){
					return groups;
				}
				groups.map((item)=>{
					if(item.group_id == this.form.group_id){
						item.disabled = true;
					}
					if(item._child !== undefined){
						item._child = this.setGroupDisabledBySelf(item._child);
					}
				});
				return groups;
			},
			/**
			 * Tree控件相关的函数
			 */
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			// 	节点开始拖拽时触发的事件
			handleDragStart(node, ev) {
				// console.log('drag start', node);
			},
			// 拖拽进入其他节点时触发的事件
			handleDragEnter(draggingNode, dropNode, ev) {
				// console.log('tree drag enter: ', dropNode.label);
			},
			// 拖拽离开某个节点时触发的事件
			handleDragLeave(draggingNode, dropNode, ev) {
				// console.log('tree drag leave: ', dropNode.label);
			},
			// 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
			handleDragOver(draggingNode, dropNode, ev) {
				// console.log('tree drag over: ', dropNode.label);
			},
			// 拖拽结束时（可能未成功）触发的事件
			handleDragEnd(draggingNode, dropNode, dropType, ev) {
				// console.log('tree drag end: ', dropNode && dropNode.label, dropType);
			},
			// 拖拽成功完成时触发的事件
			async handleDrop(draggingNode, dropNode, dropType, ev) {
				// console.log('tree drop: ', dropNode.label, dropType);
				console.log(dropType);
				// 如果拖到到前后则属于同级
				let parent_id = dropNode.data.parent_id || 0;
					// 当前分组Id
				let group_id = dropNode.data.group_id;

				// 设置排序值
				if(dropType == 'before'){
					// draggingNode 及之后的其它同级分组都需要 + 1
					draggingNode.data.sort += 1;
					// 当前分组Id
					group_id = draggingNode.data.group_id;
				}else if(dropType == 'after'){
					// dropNode 及之后的其它同级分组都需要 + 1
					dropNode.data.sort += 1;
				}else if(dropType == 'inner'){
					// 如果拖到到内部，则父级Id为指定的分组Id
					parent_id = dropNode.data.group_id;
					// 当前分组Id，且相关的同级排序要按照重排一次！
					group_id = draggingNode.data.group_id;
				}
				// 设置当前分组的父级Id
				draggingNode.data.parent_id = parent_id;
				// 进行排序逻辑
				this.groups = this.setGroupConfigs(this.groups, group_id, dropType);
				// 分组数据是同步更新的
				// 提取一下分组与对应的排序及父级Id
				let groups = this.getGroupTreeConfis(this.groups);
				// 批量更新
				const {
					data,
					http_status,
					msg
				} = await batchSave({groups});

				if (http_status === this.HTTP_SUCCESS) {
					this.$message.success(msg);
				}
			},
			// 设置分组的排序与父级归属
			setGroupConfigs(groups, group_id, dropType){
				let parent_id = -1;
				let sort;
				groups.map((item)=>{
					if(item.group_id == group_id){
						parent_id = item.parent_id;
						sort = item.sort;
					}
					// 同级分组，则设置sort
					else if(item.parent_id == parent_id && item.group_id != group_id){
						++sort;
						item.sort = sort;
					}
					if(item._child !== undefined){
						item._child = this.setGroupConfigs(item._child, group_id, dropType);
					}
				});
				return groups;
			},
			getGroupTreeConfis(groups){
				let configs = [];
				groups.map((item)=>{
					configs.push({
						group_id: item.group_id,
						group_name: item.group_name,
						parent_id: item.parent_id,
						sort: item.sort,
					});
					if(item._child !== undefined){
						configs = configs.concat(this.getGroupTreeConfis(item._child));
					}
				});
				return configs;
			},
			// 拖拽时判定目标节点能否被放置
			allowDrop(draggingNode, dropNode, type) {
				return true;
			},
			// 判断节点是否可拖拽
	      	allowDrag(draggingNode) {
	      		return true;
	      	}
		},
		watch: {
			$route: function(to) {
				if (to.params.groupId == 0) {
					this.getGroup(this.$route.params.projectId);
				}
			},
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		components: {},
		mixins: [controlShow],
	};
</script>

<style lang="scss" scoped>
	.group {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: #fff;
		overflow-y: auto;

		ul.operator {
			margin: 0;
			padding: 0;
			list-style: none;

			li {
				width: 100%;
				overflow: hidden;
				display: flex;
				margin: 8px 0;
				height: 32px;
				line-height: 32px;

				&:last-child {
					border-bottom: 1px solid rgb(228, 219, 219);
					padding-bottom: 6px;
				}

				i {
					margin-right: 5px;
				}

				a {
					display: inline-block;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 14px;
					height: 28px;
					color: rgb(75, 74, 74);
					margin-left: 8px;
					padding-left: 10px;
					height: 100%;
					text-decoration: none;
				}

				&:hover {
					background-color: rgb(125, 195, 241);

					a {
						color: white;
					}
				}
			}
		}

		.list {
			a {
				text-decoration: none;
				font-size: 14px;
			}

			.list-item {
				.list-item-one {
					height: 40px;
					display: flex;
					justify-content: space-between;
					padding: 0 20px 0 10px;
					align-items: center;

					position: relative;

					.sort {
						position: absolute;
						right: 50px;

						a {
							color: #857979;
						}
					}

					i {
						box-sizing: border-box;
						margin-right: 5px;
						font-weight: bold;
					}
				}

				ul {
					list-style: none;
					margin: 0;
					padding: 0;

					li {
						position: relative;
						height: 40px;
						line-height: 40px;

						a {
							position: absolute;
							display: inline-block;
							left: 45px;
						}

						.el-dropdown {
							position: absolute;
							right: 20px;
						}
					}
				}
			}
		}
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #409EFF;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
	.demonstration {
		display: block;
		color: #8492a6;
		font-size: 14px;
		margin-bottom: 20px;
	}
</style>