<template>
	<el-dialog :title="title" :visible.sync="dialogVisible" width="50%" >
		<unicloud-db v-slot:default="{data, loading, error, options }" collection="banner" ref="udb" manual :where="ops" getone @load="handleData">
			<view>
				<el-form :model="dataForm" ref="dataForm" :rules="rules"  label-width="100px">
					<el-form-item label="时间" prop="createTime">
						<el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="上传图片" prop="pic">
						<uni-file-picker v-model="dataForm.pic" fileMediatype="image" mode="grid" 
						:del-icon="!data"
						@select="select" :limit="1"
							 />
					</el-form-item>
					<el-form-item label="图片名称" prop="picName">
						<el-input placeholder="图片名称" v-model="dataForm.picName"></el-input>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="dataForm.sort"></el-input-number>
					</el-form-item>
				</el-form>
			</view>
		</unicloud-db>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="submit">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
		data: () => ({
			dialogVisible: false,
			title:'新增',
			ops:'',
			id:'',
			dataForm: {
				createTime: '',
				pic: [],
				picName:'',
				sort:0
			},
			rules:{
				createTime:[ { required: true, message: '请输入创建时间', trigger: 'change' }],
				pic:[{ required: true, message: '请输入图片', trigger: 'change' }],
				picName:[{ required: true, message: '请输入图片名称', trigger: 'change' }],
				sort:[{ required: true, message: '请输入排序', trigger: 'change' }],
			}
		}),
		methods: {
			//处理数据回显
			handleData(data){
				this.dataForm = data;
				this.dataForm.pic = [{pic:this.dataForm.pic,url:this.dataForm.pic}]
			},
			//初始化
			init(id) {
				this.dialogVisible = true;
				this.id = id ? id:'';
				id && (this.ops = `_id=='${id}'`)
				this.$nextTick(() => {
					this.$refs.dataForm.resetFields();
					if(id){
						this.title='编辑';
						this.$refs.udb.loadData({clear:true})
					}else{
						this.title='新增'
					}
				})
			},
			//图片上传
			select(e) {
				this.dataForm.picName = e.tempFiles[0].name.split('.')[0]
			},
			//提交保存
			submit(){
				let data = {...this.dataForm};
				data.pic = data.pic.map(picItem => picItem.url).join('');
				this.$refs.dataForm.validate((valid) =>{
					!this.id && this.addOperate(data);
					this.id && this.editOperate(data)
				})
			},
			//新增操作
			addOperate(data){
				this.$refs.udb.add(data,{
					success:res => {
						this.dialogVisible = false;
						this.$emit('search')
					}
				})
			},
			//编辑操作
			editOperate(data){
				let params = { ...data };
				params.createTime = new Date(params.createTime);
				delete params._id;
				this.$refs.udb.update(data._id,params,{
					success:res => {
						this.dialogVisible = false;
						this.$emit('search')
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.el-input{
		width: 250px;
	}
</style>
