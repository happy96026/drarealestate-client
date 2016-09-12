$(document).ready(function() {

	// declare constants, variables
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width =  500,
		height = 300,
		radius = (Math.min(width, height))/2,
		dict = {},
		data = [],
		name = [],
		arcs,
		legend,
		text;

	// declare colour scale
	var colour = d3.scale.category20()

	// define arc for the pie chart
	var arc = d3.svg.arc()
		.innerRadius(0)
		.outerRadius(radius - 5);

	// define layout for pie chart
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.frequency;})

	// create svg surface
	var svg = d3.select(".pie_chart").append("svg")
		.attr("width", width + 50)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/3 + "," + (height/2 + 5) + ")")

	d3.json("data.json", function(json_data) {
		// calculate number of houses in each housing type
		json_data.forEach(function(d) {
			dict = {}
			if ((name.indexOf(d["MARKET BUILDING CLASS"]) == -1) && (d["PROPERTY TYPE"] == "RESIDENTIAL" )) {
				dict["name"] = d["MARKET BUILDING CLASS"];
				dict["frequency"] = 0;
				name.push(d["MARKET BUILDING CLASS"]);
				data.push(dict);

			}
			if (d["PROPERTY TYPE"] == "RESIDENTIAL") {
				data[name.indexOf(d["MARKET BUILDING CLASS"])]["frequency"] += 1;
			}
		})

		// ignore housing type with little frquency
		for (i = 0; i < data.length; i++) {
			if (data[i]["frequency"] < 100) {
				delete data[i];
				delete name[i];
			}
		}

		// remove empty elements
		data = $.grep(data,function(n){ return n == 0 || n });
		name = $.grep(name,function(n){ return n == 0 || n });

		// append pie chart onto surface
		arcs = svg.selectAll(".arc")
			.data(pie(data))
			.enter()
			.append("path")
			.attr("class", "arc")
			.style("fill", function(d, i) {return colour(i);})
			.attr("d", arc);

		// append legend onto surface
		legend = svg.selectAll(".legend")
			.data(data)
			.enter()
			.append("rect")
			.attr("width", 8)
			.attr("height", 8)
			.attr("x", 180)
			.attr("y", function(d, i) {return -150 + 9*i})
			.style("fill", function(d, i) {return  colour(i);});

		// append text onto legend
		text = svg.selectAll(".text")
			.data(data)
			.enter()
			.append("text")
			.attr("x", 189)
			.attr("y", function(d, i) {return -144 + 9*i})
			.style("font-family", "sans-serif")
			.style("font-size", "8px")
			.text(function(d, i) {return d.name});

	});

	// This function runs when new neighbourhood is clicked
	$('#Neighbourhood').change(function() {

		var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

		// calculate number of houses in each housing type of the specifed neighbourhood
		d3.json("data.json", function(json_data) {
			data = [],
			name = [];

			json_data.forEach(function(d) {
				dict = {};
				if ((name.indexOf(d["MARKET BUILDING CLASS"]) == -1) && (d["PROPERTY TYPE"] == "RESIDENTIAL") && (Neighbourhood == d.Neighbourhood)) {
					dict["name"] = d["MARKET BUILDING CLASS"];
					dict["frequency"] = 0;
					name.push(d["MARKET BUILDING CLASS"]);
					data.push(dict);
				}
				if ((d["PROPERTY TYPE"] == "RESIDENTIAL")&&(d.Neighbourhood == Neighbourhood)) {
					data[name.indexOf(d["MARKET BUILDING CLASS"])]["frequency"] += 1;
				}
			})

			if (data.length == 0) {
				dict = {};
				dict["name"] = "NULL"
				dict["frequency"] = 1;
				data.push(dict)
			}

			// remove old pie chart, legend
			arcs.remove()
			legend.remove()
			text.remove()

			// append new pie chart, legend
			arcs = svg.selectAll(".arc")
				.data(pie(data))
				.enter()
				.append("path")
				.attr("class", "arc")
				.style("fill", function(d, i) {return colour(i);})
				.attr("d", arc);

			legend = svg.selectAll(".legend")
				.data(data)
				.enter()
				.append("rect")
				.attr("width", 8)
				.attr("height", 8)
				.attr("x", 180)
				.attr("y", function(d, i) {return -150 + 9*i})
				.style("fill", function(d, i) {return  colour(i);});

			text = svg.selectAll(".text")
				.data(data)
				.enter()
				.append("text")
				.attr("x", 189)
				.attr("y", function(d, i) {return -144 + 9*i})
				.style("font-family", "sans-serif")
				.style("font-size", "8px")
				.text(function(d, i) {return d.name});

		});
	});

});
