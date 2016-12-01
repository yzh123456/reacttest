import { Component } from "react";

class BookingList extends Component{
	//点击切换
	
	
	render(){
		let pStyle = {
		"color":"#666"
		}
		let liStyle = {
		"display":"none"
		}
		
		return(
			<div>
				<section id="bookinglist">
					<article className="fp_sort">
						<ul>
							<li className="selected" onClick="ShowParkMonthList();">近月内
							</li>
								<li onClick="ShowParkAllList();">全部
								</li>
						</ul>
					</article>
					<article className="fp_list">
						<nav>
							<li id="tp_park_list" style= {  liStyle }>
								<p id="parkName"></p>
								<div className="tp_park_details">
									<p className="vehicle_no" id="vehicle_no"></p>
									<p id="bookTime" className="bookTime"></p>
									<p style= { pStyle }>请在<label id="overdueTime"></label>前入场</p>
									<p id="parkAddress" className="parkAddress"></p>
								</div>
								<div className="isOverTime"></div>
								<div className="clear"></div>
							</li>
							<ul className="parkList" id="booked_park_list">
							</ul>
					</nav>
		</article>
		<article className="fp_menu hide" id="parklist_bottom_nav">
			<nav>
				<ul>
					<li className="tip_li_yd tip_li_oc tip_overtime_yd" onClick="DelayPayBookPark()">延时预订</li>
					<a href="map.html?from=JTC">
					<li className="tip_li_yd tip_li_oc tip_goto_yd">回到地图</li>
					</a>	
					<li className="tip_li_yd tip_li_oc tip_focuson_yd" onClick="BookListDetail(this)">详情</li>
					<li className="tip_li_yd tip_li_oc tip_parklock_yd" onClick="ParkingLock()">车位锁</li>

				</ul>
			</nav>
		</article>
	</section>
</div>
		)
	}
}
export { BookingList };
