//将组建加载到页面
import React from "react";
import { render } from "react-dom";
import { App } from "./router";


window.onload = function(){
	render(
		<App/>,
		document.querySelector("#app")
	)
	
}
