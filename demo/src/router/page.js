import { Component } from 'react';
//引入 react-router 模块，获取 link 组件
import { Link } from 'react-router';

class Home extends Component{
	render(){
		const query = this.props.location.query;
		return(
			<div>
				Home,
				<Link to = "/about">to about</Link>
				{ query.text}
			</div>
		)
	}
}

class About extends Component{
	render(){
		return(
			<div>
				yzh,
				<Link to = "/">go Home</Link>
				
			</div>
		)
	}
}

class Index extends Component{
	
	render(){
		let pathdata = {
			pathname : "/index",
			query : {
				text : "hello react-router"
			}
		}
		return(
			<h1>
				<Link to={ pathdata }>see /index</Link>
			</h1>
		)
	}
}

class Test extends Component{
	render(){
		const location = this.props.location;
		
		console.log(location);
		
		return (
			<div>pathname : { location.pathname }</div>
		);
	}
}


export { Home, About , Index , Test};
