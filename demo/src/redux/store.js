import { createStore } from 'redux';
//控制数据的变化
function counter(state = 0 , action= {}){
	
	switch(action.type){
		case 'add' :
			return state+1;
		default :
		return state;
	}
}
//创建一个store
let store = createStore(counter);
export { store };
