//state  双向绑定   如果希望数据变化后就自动改变 view，在 react 需要使用 state 状态对象
//只有通过 sate 去修改了数据的状态，才会触发 view 的变化。

/*porps 定义的数据定义后不可能会在发生改变，state 里面定义的数据定义后可以通过 setState 去修改数据的状态
state 设计要遵循最小改变原则，让大多数组件不设置状态，给父组件设置状态，通过组件之间的引用关系去修改子组件的值，所有的子组件有 active 时主动去调用父组件的方法，修改父组件的状态数据，在响应到子组件中，达到更新视图的效果*/
import { createClass } from "react";

const State = createClass({
	getInitialState: function() {
		//定义默认数据
		return {
			name: "react.js"
		};
	},
	render:function(){
		const that = this;
		setInterval(()=>{
			//一秒后对 name 重新赋值，使用 setState 去修改数据的状态
			that.setState({
				name : Math.random()
			});
		},1000);
		return(
			<div>
			{
				this.state.name 
			}
			</div>
		)
	}
});
export { State }
 