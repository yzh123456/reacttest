/*let numer = 10;
const PI = 3.14;*/
import React from "react";
import { render} from "react-dom";
import { List,List2 } from "./list";
//后缀名可省
import { Props } from "./props";
//默认返回可不用解构赋值
import Event from "./event";
import { State } from "./state"

//接收一个  
//用es6语法
//import { arr } from "./arr.js";
//接收多个 将导入模块下所有的值赋给Util
import * as Util from "./arr.js";
function test(){
	return "hello word";
}
//{}里面的是用js写的
//或者提前声明一个style
var style = {
	"color": "red",
	"fontSize":"24px"
}
render(
	<div style = {style}>
	
		{
			test()
		}
		<List/>
		<hr/>
		<List2  text = "hjskh"/>
		<Props text = "123456" text1 = "796879"/>
		<Event/>
		<State/>
	</div>,
	document.getElementById("example")
)
