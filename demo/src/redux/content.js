/*实例化一个 redux 就是一个 store
store 由 subscribe 、dispatch、getState 三部分组成
subscribe 订阅数据的变化，当数据变化后会执行该回调函数
dispatch 需要改变数据，就调用一次 dispatch

* */
import { Component } from 'react';
import { store } from './store';
class Content extends Component{
	//写在构造器中
	constructor(...args){//构造器
		super(...args);//调用父级的构造器
		//使用 es6 class 去写组件时，对 状态的数据赋值默认值
		this.state = {// 需要有在 构造器里面对 state 重新赋值
			number : 0
		}
		
		const that = this;
		//订阅数据的变化
		store.subscribe(()=>{
			//输出后数据的变化
			that.setState({
				number : store.getState()
			});
			
		});	
	}
	clickDispatch(){
		store.dispatch({ //需要改变数据，就调用一次 dispatch
			type: 'add'
		});
	}
	render(){
		return(
			<div>
				<span>{ this.state.number}</span>
				<button onClick={ this.clickDispatch.bind(this) }>点击</button>
			
			</div>
		)
	}
}
export { Content };
