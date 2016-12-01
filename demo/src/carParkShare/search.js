import { Component } from "react";
import {dataService} from "./dataService";
	
class Search extends Component{
	//表单获取焦点事件
		inputOnFocus(){
		    this.setState({ focus: true });
		}
		//表单失去焦点
		inputOnBlur(){
			this.setState({ focus: false });
		}
	//搜索框的点击事件
	clicktest(){
		console.log(this.refs.nameinput.value)
		console.log(this.refs)
	
		this.refs.searchbutton.hidden = false;
		this.refs.searchbutton.className = "periphery";
		this.refs.history.hidden = true;
		
		let value = this.refs.nameinput.value
		
	}
	
	//关键字点击搜索
	click(){
		this.refs.nameinput.value = this.refs.lis.innerText
		console.log(this.refs.lis.innerText);
		
		//this.refs.searchbutton
	}
	
	//获取数据
	constructor(){
		super();
		//默认值
	}
	//声明周期，当 dom 元素插入到页面后出发
	componentDidMount(){
	
		let dataServiceList = 
		dataService.loadCarPlaceShareRecord({key:this.refs.nameinput.value});
		
		console.log(dataServiceList)
		
		if(dataServiceList.resultCode == 0){
		//可循环遍历运行
			this.refs.name.innerText = dataServiceList.dataItems[0].attributes.SHARE_NAME;
			this.refs.count.innerText = dataServiceList.dataItems[0].attributes.SHARE_QUANTITY;
			

			this.refs.start.innerText = dataServiceList.dataItems[0].attributes.START_DATE;

			this.refs.end.innerText = dataServiceList.dataItems[0].attributes.END_DATE;
			
			this.refs.time.innerText = dataServiceList.dataItems[0].attributes.END_TIME;
			
			this.refs.far.innerText = dataServiceList.dataItems[0].attributes.DISTANCE;
			
			this.refs.price.innerText = dataServiceList.dataItems[0].attributes.CURRENT_PRICE;
			
			this.refs.yuan.innerText = dataServiceList.dataItems[0].attributes.COST_PRICE;


	
		}
	
	}
	

	render(){
		let divstyle = {
			"padding":"5px 10px",
			"borderBottom": "1px solid #c6c6c6"
		}
		let spanstyle = {
		 	"color": "#A9A9A9",
		 	"fontSize":"13px"
		 }
		let secstyle = {
			"textAlign" :"center"
		}
		let sp1style = {
			"color":"#18B4ED",
			"fontWeight": "700"
		}
		let sp2style = {
			"float": "right",
			"fontSize":"13px",
			"color": "#222222",
			"minWidth":"50px"
		}
		let sp3style = {
			"color":"#666666"
		}
		let sp4style = {
			"textDecoration": "line-through"
		}
		console.log(this.state)
		
		return(
			
			<div>
				
					<input className="input_search_share" placeholder= "找分享，找优惠"  ref = "nameinput" onBlur={this.inputOnBlur.bind(this)}  onFocus={ this.inputOnFocus.bind(this)} />
				
				
				<div className="search_bg" onClick = { this.clicktest.bind(this)}></div>
		
				
		<div className = {this.state? "input_search_share search_record":"input_search_share search_record hide" }>
			<nav id="searchrecords" ref = "history">
				<h4>
					搜索历史
					<span id="clearrecords">清除</span>
				</h4>
				<ul id="historyCode">
					<li onClick = {this.click.bind(this)} ref = "lis">
						1
					</li>
					
				</ul>
			</nav>
		</div>
	
		<div className={ this.state? "hide":"periphery periphery_title"} style = { divstyle }>
		    <span style = { spanstyle}>越分享，越便捷</span>
		    <span className="grab_parking_spaces">抢到的车位</span>
			<span className="periphery_share">周边分享</span>

			</div>
		<section className = { this.state? "hide":"share_content_list"}>
						<div className="periphery" style = { secstyle }>暂无内容</div>
		</section>
		
		
		<div className="periphery hide" ref = "searchbutton">
				<div>
					<span style = {sp1style} ref = "name">
					es6testnnn
					</span>
					<span style= {sp2style}>剩余&nbsp;
						<span className="overplus_share_count" ref = "count">50654
						</span>
									
					&nbsp;个
					</span>
				</div>
				<div className="periphery periphery_title">
					<div className="park_name" >捷生活子系统名称
					</div>
					<div className="park_addr">广东省深圳市福田区龙尾路10号
					</div>
					<div className="park_far" ref = "far">926533492.7m</div>
					<div className="park_time">
						<span ref = "start">201456-114-254
						</span>&nbsp;至&nbsp; 
						<span ref= "end">342016-352-410
						</span>&nbsp;
						<span style = { sp3style} ref = "time">14:00-14:00
						</span> &nbsp;
						<span>全周可停
						</span>
					</div>
					<div className="grab">
						<div className="grab_price">分享价 
							<span id="grab_price" ref = "price"> 46110 </span> 元/月
						</div>
						<div className="original_price">
							<span style={ sp4style }>原价:
							<span id="original_price" ref = "yuan"> 255460 </span> 元&nbsp;
							</span>&nbsp;省
							<span id="saveMoney"> 140 </span>元
						</div>
						<div className="bg_grab" data-shareid="73e0dd88b3244fd2baf0a0f5a4257c7b">
						</div>
					</div>
				</div>
			</div>
		
		</div>
		
		
		)
	}
}

export { Search  };
