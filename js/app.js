(function (Vue) {
	const items = [
		{
			id:1,
			content:'vue.js',
			computed:false
		},
		{
			id:2,
			content:'JAVA',
			computed:false
		},
		{
			id:3,
			content:'php',
			computed:true
		}
	]
	const STORAGE_KEY = 'items'
	const itemStorage = {
		fetch:function(){
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		},
		save:function(items){
			localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
	}
	// 自定义全局指令
	Vue.directive('app-focus',{
		inserted(el,binding){
			el.focus()
		}
	})
	const vm = new Vue({
		el:'#app',
		data(){
			return {
				items:itemStorage.fetch(),
				currentItem:null,
				filterStatus:'all'
			}
		},
		directives:{
			'todo-focus':{
				update(el,binding){
					if(binding.value){
						el.focus()
					}
				}
			}	
		},
		watch: {
			items:{
				deep:true,
				handler:function(newVal,oldVal){
					itemStorage.save(newVal)
				}
			}
		},
		computed: {
			filterItems(){
			switch (this.filterStatus) {
				case 'active':
					return this.items.filter(item => !item.computed)
					break;
				case 'completed':
					return this.items.filter(item => item.computed)
					break;
				default:
					return this.items
					break;
			}
			},
			// 计算属性的双向绑定
			all:{
				get(){
					return this.unComputed === 0
				},
				set(newVal){ // es6的简写，箭头函数 等价于 function(item){}
					this.items.forEach((item) => {
						item.computed = newVal
					})
				}
			},
			unComputed(){ //es6的写法 省略了:function
				return this.items.filter((item) => {
					// filter里面返回为true则这一项不会被过滤掉
					return !item.computed
				}).length
			}
		},
		methods:{
			cancelEdit(){
				this.currentItem = null
			},
			finshEdit(item, index, event){
				//获取当前输入数据
				const content = event.target.value.trim()
				if(!content){
					//如果内容为空移除当前项
					this.removeItem(index)
					return
				}
				//不为空更新当前项
				item.content = content
				//退出编辑状态
				this.currentItem = null
			},
			toEdit(item){
				this.currentItem = item
			},
			//移除所有已完成的任务项
			removeComputed(){
				const unItems = this.items.filter(item => {
					return !item.computed
				})
				// 箭头函数如果只有一个参数，小括号可以省略，如果箭头函数的函数体内只有一个等式，则return也可以省略，且大括号也能省略
				//const unItems = this.items.filter(item => !item.computed)
				this.items = unItems
			},
			removeItem(index){
				//第一个参数：下标，第二个下标：移除几个
				this.items.splice(index,1)
			},
			//es6的写法 省略了:function
			add(event){
				//获取文本框的内容
				const content = event.target.value.trim()
				//判断内容是否为空
				if(!content.length){
					return
				}
				//不为空添加到数组中
				const id = this.items.length + 1
				this.items.push({
					id,
					content, //es6语法 key和value一样可以简写
					computed:false
				})
				// 清空文本框的内容
				event.target.value = ''
			}
		}
	})

	window.onhashchange = function(){
		const hash = window.location.hash.substr(2) || 'all'
		vm.filterStatus = hash
	}
	//第一次访问时让状态值生效
	window.onhashchange()
})(Vue);
