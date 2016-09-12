// Based off http://bl.ocks.org/mbostock/3883245
$(document).ready(function() {

	// declare constants and variables
	var margin = {top: 0, right: 0, bottom: 0, left: 45},
		translate = {left: 45, down: 10},
		data = [],
		dict = {},
		name = [],
		width = 450,
		height = 300,
		xbar,
		ybar,
		text1,
		text2,
		path;

	// set up x-axis
	var x = d3.scale.linear()
		.range([0, width - 50]);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.format("d"));

	// set up y-axis
	var y = d3.scale.linear()
		.range([height - 30, 0]);
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) {return x(d.year) + 45;})
		.y(function(d) {return y(d.frequency) + 10;});

	// create svg surface
	var svg = d3.select(".line_chart").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")

	d3.json("data.json", function(json_data) {

		// calculates the number of houses built each year
		json_data.forEach(function(d) {
			dict = {}
			if (name.indexOf(d["EFFECTIVE BUILD YEAR"]) == -1) {
				dict["year"] = d["EFFECTIVE BUILD YEAR"];
				dict["frequency"] = 0;
				name.push(d["EFFECTIVE BUILD YEAR"]);
				data.push(dict);
			}
			data[name.indexOf(d["EFFECTIVE BUILD YEAR"])]["frequency"] +=1;
		});

		// sort data according to year in ascending order
		data.sort(function(a, b) {
			return parseFloat(a.year) - parseFloat(b.year);
		});

		// converts dataset to a cumulative dataset
		for (i = 0; i < (data.length - 1); i++) {
			data[i + 1]["frequency"] += data[i]["frequency"]
		}

		// creates a scale for the axes
		x.domain([d3.min(data, function(d) {return d.year}), d3.max(data, function(d) {return d.year})]);
		y.domain([0, d3.max(data, function(d) {return d.frequency})]);

		// append x-axis to surface
		xbar = svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(45," + (height - 30 + 10) + ")")
			.call(xAxis)

		// append x-axis label to surface
		text1 = svg.append("text")
			.attr("x", width - 5)
			.attr("y", height - 25)
			.attr("class", "axis")
			.style("text-anchor", "end")
			.text("Year")

		// append y-axis to surface
		ybar = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(45, 10)")
			.call(yAxis)

		// append y-axis label to surface
		text2 = svg.append("text")
			.attr("class", "y axis")
			.attr("transform", "rotate(-90)")
			.attr("x", -10)
			.attr("y", 50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Frequency");

		// append line graph to surface
		path = svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

	});

	// This function runs when a new neighbourhood is clicked
	$('#Neighbourhood').change(function() {

		var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

		d3.json("data.json", function(json_data) {
			name = [],
			data = [];

			// calculates the number of houses built each year
			json_data.forEach(function(d) {
				dict = {}
				if ((name.indexOf(d["EFFECTIVE BUILD YEAR"]) == -1)&&(d.Neighbourhood == Neighbourhood)) {
					dict["year"] = d["EFFECTIVE BUILD YEAR"];
					dict["frequency"] = 0;
					name.push(d["EFFECTIVE BUILD YEAR"]);
					data.push(dict);
				}
				if (d.Neighbourhood == Neighbourhood){
					data[name.indexOf(d["EFFECTIVE BUILD YEAR"])]["frequency"] +=1;
				}
			});

			// sort data according to year in ascending order
			data.sort(function(a, b) {
				return parseFloat(a.year) - parseFloat(b.year);
			});

			// converts dataset to a cumulative dataset
			for (i = 0; i < (data.length - 1); i++) {
				data[i + 1]["frequency"] += data[i]["frequency"]
			}

			// creates a new scale for x-axis and y-axis
			x.domain([d3.min(data, function(d) {return d.year}), d3.max(data, function(d) {return d.year})]);
			y.domain([0, d3.max(data, function(d) {return d.frequency})]);

			// remove old x-axis, y-axis and line graph
			xbar.remove();
			ybar.remove();
			path.remove();

			// append the new axes, line graph
			xbar = svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(45," + (height - 30 + 10) + ")")
				.call(xAxis);

			ybar = svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(45, 10)")
				.call(yAxis);

			path = svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", line);

		});
	});
});
