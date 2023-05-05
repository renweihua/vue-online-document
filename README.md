# vue-online-document
在线文档的前端模板


# 模板基本上复用`https://gitee.com/leihenshang/api-doc-php`
> 轻量化的api接口文档工具

## install package
yarn  or yarn install

## run
yarn serve or npm run serve

## build
yarn build

## package image
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
yarn config set registry https://registry.npm.taobao.org -g

### look config
yarn config get registry


### 功能列表
- Auth
	- [X] 登录
	- [X] 登录会员信息 /api/auth/me
- 分组管理
    - [X] 列表
    - [X] 创建
    - [X] 编辑
	- [X] 批量更新分组排序与归属父级 /api/group/batch-save
- 项目管理 
	- [X] 列表
	- [X] 详情
	- [X] 创建
	- [X] 编辑
	- [X] 删除 /api/project/delete
- API管理 
	- [X] 列表
	- [X] 详情
	- [X] 创建
	- [X] 编辑
	- [X] 复制
	- 删除
- 文档管理 
	- [X] 列表
	- [X] 详情
	- [X] 创建
	- [X] 编辑
	- 删除
- [X] 字段映射 
	- [X] 列表
	- [ ] ~~详情~~
	- [X] 创建
	- [X] 编辑
	- [X] 删除
- [X] 项目成员
    - [X] 列表
    - [ ] ~~详情~~
    - [X] 创建
    - [X] 编辑
    - [X] 删除
    - [X] 权限设置
- 操作日志
	- [X] 列表 /api/operation-logs
