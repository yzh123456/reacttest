"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _arr = require("./arr.js");

var Util = _interopRequireWildcard(_arr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactDom.render)(_react2.default.createElement(
	"div",
	null,
	Util.arr
), document.getElementById("example"));
//接收一个  
//用es6语法
//import { arr } from "./arr.js";
//接收多个 将导入模块下所有的值赋给Util
/*let numer = 10;
const PI = 3.14;*/