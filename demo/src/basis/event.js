import { Component } from "react";
//默认返回
//props单项绑定   

export default class Event extends Component{
	clicktest(e){
		//获取不到this对象
		//通过定义的ref找到真实的dom
		console.log(this.refs.div1)
	}
	render(){
		return(
			//在虚拟的dom上运行   要获取真实的dom 应该加一个ref标识它
			<div ref = "div1">
			//this对象会丢失   绑定一个bind
			//babel转换的时候 es6的class一个bug-
			//this.clicktest.bind(this)  bind强制转换
				<h1 onClick = { this.clicktest.bind(this)}>
				点击
				</h1>
			</div>
		)
	}
}
