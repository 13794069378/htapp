/**
 *经纬度距离计算
 *date:2014-09-16
 * 陈国祥
 * alert(getFlatternDistance(23.018125,113.106185,23.018073,113.1061));
 */
var EARTH_RADIUS = 6378137.0;
//单位M
var PI = Math.PI;
function getRad(d) {
	/*console.log("d:"+d);
	console.log("res:" + (d * PI / 180.0));*/
	return d * PI / 180.0;
}

/**
 * approx distance between two points on earth ellipsoid
 * @param {Object} lat1 纬度坐标
 * @param {Object} lng1 经度
 * @param {Object} lat2
 * @param {Object} lng2
 */
var EARTH_RADIUS = 6378137.0;
function getFlatternDistance(lat1, lng1, lat2, lng2) {
    //console.log(lat1+","+lng1+","+lat2+","+lng2);
	var f = getRad((parseFloat(lat1) + parseFloat(lat2)) / 2);
	/*console.log("f:"+f);
	console.log("lat1:"+parseFloat(lat1));
	console.log("lat2:"+parseFloat(lat2));
	console.log("g2:"+(parseFloat(lat1) - parseFloat(lat2)));*/
	var g = getRad((parseFloat(lat1) - parseFloat(lat2)) / 2);
	//console.log("g:"+g);
	var l = getRad((parseFloat(lng1) - parseFloat(lng2)) / 2);
	//console.log("l:"+l);

	var sg = Math.sin(g);
	//console.log("sg:"+sg);
	var sl = Math.sin(l);
	//console.log("sl:"+sl);
	var sf = Math.sin(f);
	//console.log("sf:"+sf);

	var s, c, w, r, d, h1, h2;
	var a = EARTH_RADIUS;
	//console.log("a:"+a);
	var fl = 1 / 298.257;
	//console.log("fl:"+fl);

	sg = sg * sg;
	//console.log("sg:"+sg);
	sl = sl * sl;
	//console.log("sl:"+sl);
	sf = sf * sf;
	//console.log("sf:"+sf);
	
	s = sg * (1 - sl) + (1 - sf) * sl;
	//console.log("s:"+s);
	c = (1 - sg) * (1 - sl) + sf * sl;
	//console.log("c:"+c);

	w = Math.atan(Math.sqrt(s / c));
	//console.log("w:"+w);
	r = Math.sqrt(s * c) / w;
	//console.log("r:"+r);
	d = 2 * w * a;
	//console.log("d:"+d);
	h1 = (3 * r - 1) / 2 / c;
	//console.log("h1:"+h1);
	h2 = (3 * r + 1) / 2 / s;
	//console.log("h2:"+h2);
	 
	return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}