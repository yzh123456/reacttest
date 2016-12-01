import { render } from 'react-dom';
import { Content } from './content';
function onload(){
	render(
		<Content/>,
		document.getElementById("app")
	);
}
window.onload = function(){
	onload();
}
