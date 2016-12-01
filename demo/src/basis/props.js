import { createClass,Children,Component } from "react";

//es6定义组件

class Props extends Component{
	render(){
		//返回的时候必须要有一个标签包起来
		/*return (
			<h1>1122343</h1>
		)*/
		//this.props是一个封装函数   
		//获取组件上传递的所有属性
		/*return(
			<h1>
			{
				this.props.text +this.props.text1
			}
			
			</h1>
		)*/ 
		//使用children
		const props = this.props;
		//Object.keys(this.props)
		console.log(Object.keys(this.props))
		console.log(this.props)
		//拿到对象下所有的键值  以数组的形式返回
		//this.props.children  获取的不是属性的值  是所有的子元素的
		return(
			<h1>
			{
				//循环props下所有的键值
				Children.map(Object.keys(props),(key)=>{
					console.log(key)
					return props[key]
					
				})
			}
			
			</h1>
		)
	}
}
export { Props }
