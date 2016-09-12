$(document).ready(function() {

	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width =  450,
		height = 320;

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = d3.select(".scatterplot").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g");

	d3.json("data.json", function(json_data) {
		x.domain([0, d3.max(function(d) {return d["NET AREA"]})]);
		y.domain([0, d3.max(function(d) {return d.Price})]);

		svg.append("g")
			.attr("class",  "x axis")
			.call(xAxis)

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)


	});

})