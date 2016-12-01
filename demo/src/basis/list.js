//定义一个组建
import { createClass,Children } from "react";
let set = new Set();
//添加元素   set是add  map 用set
set.add("java");
set.add("c++");
set.add("react");
//map 遍历  返回
//for each 没有返回
const List = createClass({
	render : function(){
	//现将其变为一个数组
	//解构赋值
	console.log(this.list)
	let [...list] = set;
		return (
			<ul>
				{
				//都有一个固定的id   手动添加一个key值
					list.map((item,i)=>{
						return <li key = {`li-${i}`}>
						{ item}
						</li>
					})
				}
			</ul>
		)
	}
})


// Children也是用来做循环的  Children(对象,回调函数)

const List2 = createClass({
	render : function(){
	//现将其变为一个数组
//	let [...list] = set;
		return (
			<ul>
				{
				//都有一个固定的id   手动添加一个key值
					Children.map(set,(item,i)=>{
						return <li key = {`li-${i}`}>
						{ item}
						</li>
					})
				}
			</ul>
		)
	}
})


export { List,List2 };


