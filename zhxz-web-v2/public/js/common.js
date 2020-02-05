Array.prototype.indexOf = function (val, property) {
	for (var i = 0; i < this.length; i++) {
		if (!property && this[i] == val) {
			return i;
		} else if (property && this[i][property] == val) {
			return i;
		}
	}
	return -1;
};
Array.prototype.remove = function (val, property) {
	if(!(this instanceof Array)){
		return;
	}
	var index = this.indexOf(val, property);
	if (index > -1) {
		this.splice(index, 1);
	}
};
Array.prototype.unique = function (arr2) {
	if(!(this instanceof Array)){
		return;
	}
	for (var i = 0; i < this.length; i++) {
		for (var j = 0; j < arr2.length; j++) {
			if (this[i] === arr2[j]) {
				this.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
			}
		}
	}
	//alert(arr1.length)
	for (var i = 0; i < arr2.length; i++) {
		this.push(arr2[i]);
	}
	return arr1;
};

Array.prototype.array2Obj = function(key, value){
	var obj = {};
	if(this instanceof Array){
		for(var i = 0; i < this.length; i++){
			obj[this[i][key]] = value ? this[i][value] : this[i];
		}
	}
	return obj;
}

String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


if (typeof String.prototype.startsWith != 'function') {  
	String.prototype.startsWith = function (prefix){  
		return this.slice(0, prefix.length) === prefix;  
	};  
}

String.prototype.endWith = function(str){
	if(str == null || str == "" || this.length == 0 || str.length > this.length){	
		return false;
	}
	if(this.substring(this.length - str.length) == str){
		return true;
	} else {
		return false;
	}
	return true;
}

String.prototype.replaceAll  = function(s1, s2){     
    return this.replace(new RegExp(s1, "gm"), s2);     
} 

alert = function(msg){
	layui.use(['layer'], function(){
		var layer = layui.layer; //获得laydate模块
		layer.msg(msg);
	});
}
confirm = function(msg, func, needConfirm){
	if(needConfirm != false){
		layui.use(['layer'], function(){
			var layer = layui.layer; //获得laydate模块
			layer.confirm(msg, {icon: 3, title:'提示',skin:'agree-skin'}, function(index){
				layer.close(index);
				func();
			});
		});
	} else {
		func();
	}
}

msg = function(msg, icon){
	layui.use(['layer'], function(){
		var layer = layui.layer; //获得laydate模块
		layer.msg(msg, {icon: (icon || 5)});
	});
}

loading = function(type) {
    layui.use(['layer'], function(){
		var layer = layui.layer; //获得laydate模块
		layer.load(type ? type : 1);
	});
}

closeLoading = function() {
    layui.use(['layer'], function(){
		var layer = layui.layer; //获得laydate模块
		layer.closeAll("loading");
	});
}

function shuffle(arr) {
    var length = arr.length, randomIndex, temp;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr;
}

function addNum(number1, number2) {
	var n1, n2, m;
	try {
		n1 = number1.toString().split(".")[1].length;
	} catch(e) {
		n1 = 0;
	}

	try {
		n2 = number2.toString().split(".")[1].length;
	} catch(e) {
		n2 = 0;
	}

	m = Math.pow(100, Math.max(n1, n2));
	return (number1 * m + number2 * m) / m;
}

function randomNumBoth(min, max){
	var range = max - min;
	var rand = Math.random();
	var num = min + Math.round(rand * range); //四舍五入
	return num;
}

const _w = () => {
	return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
}

const _h = () => {
	return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
}

const dictsConcatAfterOrder = (arr1 = [], arr2 = [], orderProperty = 'order') => {
	let arr = [].concat(arr2);
	arr1.forEach(item => {
		let index = arr.indexOf(item.value, 'value');
		if (index != -1) {
			arr.splice(index, 1);
		}
	});

	arr = arr1.concat(arr);
	
	if (orderProperty) {
		arr.sort((a, b) => {
			return a[orderProperty] - b[orderProperty];
		})
	} else {
		arr.sort((a, b) => {
			return a - b;
		})
	}
	return arr;
}