$(document).ready(function() {

	// declare constants and variables
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width =  500,
		height = 300,
		translate = {right: 0, left: 0, up: 0, down: 10},
		xbar,
		ybar,
		scatter,
		text1,
		text2;

	// set up x-axis
	var x = d3.scale.linear()
		.range([0, width - 100]);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// set up y-axis
	var y = d3.scale.linear()
		.range([height - margin.bottom, 0]);
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(function (d) {
			if (d > 1000000) {
				return (d/1000000) + "m";
			}
			else if (d < 1000) {
				return d;
			}
			else {
				d = (d/1000) + "k";
				return d;
			}
		});

	// create a svg surface
	var svg = d3.select(".scatterplot").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g");


	d3.json("data.json", function(json_data) {

		// delete json_data element if property type is not residential
		for (i = 0; i < json_data.length; i++) {
			if (json_data[i]["PROPERTY TYPE"] != "RESIDENTIAL") {
				delete json_data[i]
			}
		}

		// remove empty elements
		json_data = $.grep(json_data,function(n){ return n == 0 || n });

		// create scale for axes
		x.domain([0, 800]);
		y.domain([0, d3.max(json_data, function(d) {return d.Price})]);

		// append axes and label texts to surface
		xbar = svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(50," + (height - margin.bottom + translate.down) + ")")
			.call(xAxis)

		text1 = svg.append("text")
			.attr("class", "axis")
			.attr("x", width - 50)
			.attr("y", height - 25)
			.style("text-anchor", "end")
			.text("Size")

		ybar = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(50," + translate.down + ")")
			.call(yAxis)

		text2 = svg.append("text")
			.attr("class", "y axis")
			.attr("transform", "rotate(-90)")
			.attr("x", -10)
			.attr("y", 55)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Price")

		// append scatterplot to surface
		scatter = svg.selectAll(".dot")
			.data(json_data)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 2.5)
			.attr("cx", function(d) {return x(d["NET AREA"]) + 50})
			.attr("cy", function(d) {return y(d.Price) + translate.down})
			.style("fill", "#ff7f0e");

	});

	// This function runs when new neighbourhood is clicked
	$('#Neighbourhood').change(function() {

		var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

		d3.json("data.json", function(json_data) {

			// obtain data for new neighbourhood
			for (i = 0; i < json_data.length; i++) {
				if ((json_data[i]["PROPERTY TYPE"] != "RESIDENTIAL")||(json_data[i]["Neighbourhood"] != Neighbourhood)) {
					delete json_data[i]
				}
			}

			json_data = $.grep(json_data,function(n){ return n == 0 || n });

			// create scale for axes
			x.domain([0, d3.max(json_data, function(d) {return d["NET AREA"]}) + 50]);
			y.domain([0, d3.max(json_data, function(d) {return d.Price}) + 100000]);

			// remove old axes and scatterplot
			xbar.remove();
			ybar.remove();
			scatter.remove();

			// append new axes and scatterplot
			xbar = svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(50," + (height - margin.bottom + translate.down) + ")")
				.call(xAxis)

			ybar = svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(50," + translate.down + ")")
				.call(yAxis)

			scatter = svg.selectAll(".dot")
				.data(json_data)
				.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 2.5)
				.attr("cx", function(d) {return x(d["NET AREA"]) + 50})
				.attr("cy", function(d) {return y(d.Price) + translate.down})
				.style("fill", "#ff7f0e");

		});
	});

})
