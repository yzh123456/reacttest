import { Component,cloneElement } from "react";
import { Link } from "react-router";
class Layout extends Component{
	render(){
		//console.log(this.props)
		//判断子元素是否存在，存在即克隆该组件
		//不存在创建一个默认的标签或则展示默认的组件
		const view = cloneElement(this.props.children);
		return(
			
			<div>
				Layout,
				{ view }
				
			</div>
		)
	}
}
export { Layout };

