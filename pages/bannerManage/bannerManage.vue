<template>
	<view class="index">
		<unicloud-db v-slot:default="{data, loading, error, options,pagination }" 
		:page-current="page"
		:page-size="pageSize"
		collection="banner" ref="udb" manual
			orderby="sort asc" getcount :where="ops">
			<view class="header">
				<el-button type="primary" @click="addBanner('add')">新增</el-button>
				<el-button type="danger" @click="deleteBanner(data)">全部删除</el-button>
				<el-input placeholder="请输入id" @input="searchData" v-model="id" clearable></el-input>
			</view>
			<view v-if="error">{{error.message}}</view>
			<el-table border :data="data" width="100%" v-loading="loading" element-loading-text="拼命加载中..." >
				<el-table-column label="id" prop="_id" header-align="center" align="center"></el-table-column>
				<el-table-column label="更新时间" header-align="center" align="center">
					<template v-slot:default='{row}'>
						<uni-dateformat :date="row.createTime" :threshold="[0,3600000]"></uni-dateformat>
					</template>
				</el-table-column>
				<el-table-column label="名称" header-align="center" prop="picName" align="center">

				</el-table-column>
				<el-table-column label="图片" prop="pic" header-align="center" align="center">
					<template v-slot:default="{row}">
						<el-image :src="row.pic" class="pic" lazy :preview-src-list="[row.pic]">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="" header-align="center" align="center">
					<template v-slot:default="{row}">
						<el-button type="danger" @click="deleteBanner(row)">删除</el-button>
						<el-button type="primary" @click="addBanner('edit',row._id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="page" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="pagination.count">
			</el-pagination>
		</unicloud-db>
		<Dialog ref="dialog" v-if="dialogVisible" @search="search" />
	</view>
</template>

<script>
	import Dialog from './components/dialog.vue'
	export default {
		components: {
			Dialog
		},
		data: () => ({
			id: '',
			ops: '',
			dialogVisible: false,
			page:1,
			pageSize:20
		}),
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			handleSizeChange(val) {
				this.pageSize = val;
				this.$refs.udb.loadData({clear:true})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.$refs.udb.loadData({clear:true})
			},
			//输入框搜索
			searchData() {
				this.ops = `_id=='${this.id}'`
			},
			//新增banner
			addBanner(type, id) {
				this.dialogVisible = true;
				this.$nextTick(() => {
					this.$refs.dialog.init(id)
				})
			},
			search() {
				this.$refs.udb.loadData({
					clear: true
				})
			},
			//删除banner
			deleteBanner(item) {
				let ids = !Array.isArray(item) ? item._id : item.map(item => item._id);
				this.$refs.udb.remove(ids, {
					success: res => {
						this.$refs.udb.loadData({
							clear: true
						})
					}
				})
			},
		},
		watch: {
			id(val) {
				if (!val) this.ops = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		padding-top: 20px;

		.pic {
			width: 100px;
			height: 100px;
		}

		.header {
			margin-bottom: 20px;
			margin-left: 20px;
			display: flex;
			align-items: center;
		}

		.el-input {
			width: 250px;
			margin-left: 20px;
		}
		.el-pagination {
		    text-align: end;
			margin-top: 20px;
		}
	}
</style>
