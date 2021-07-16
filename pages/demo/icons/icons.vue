<template>
	<view class="">
		<unicloud-db v-slot:default="{data, loading, error, options}" 
		collection="order,book" 
		:where="ops" 
		field="book_id{title,author},quantity" 
		ref="udb"
		manual>
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				
			</view>
		</unicloud-db>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ops:''
			}
		},
		onReady() {
			this.ops = 'book_id.title == "三国演义"'
			this.$refs.udb.loadData()
			// console.log(,'aaa')
		}
	}
</script>

<style scoped>

</style>