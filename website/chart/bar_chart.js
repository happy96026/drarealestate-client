$(document).ready(function() {

	// declare constants
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width =  450,
		height = 300;

	// declare variables
	var count = 0,
		divisions = 6,
		min_price = 0,
		max_price = 1000000,
		data = [],
		array,
		colour = d3.scale.category20(),
		increment = Math.round(max_price-min_price)/(divisions - 1),
		xbar,
		ybar,
		text,
		bar;

	// set up x-axis
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width - 50], .1);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// set up y-axis
	var y = d3.scale.linear()
		.range([height - 50, 0]);
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	// create svg surface
	var svg = d3.select(".bar_chart").append("svg")
		.attr("width", width)
		.attr("height", height)

	// fetch real-esate data from data.json file
	d3.json("data.json", function(json_data) {
		data = [];

		// count number of houses for each division
		for (i = 0; i < divisions; i++) {
			count = 0;
			array = [{"Frequency":count}];
			data = data.concat(array);
		}

		// scale of x-axis depends on the price range
		x.domain(data.map(function(d,i) {
			if (i != divisions - 1) {
				return (increment*(i)/1000 + "k" +"-"+ increment*(i+1)/1000 + "k");
			}
			else {
				return ">1m"
			}
		}));

		// scale of y-axis depends on the number of houses in each price range
		y.domain([0, d3.max(data, function(d) { return d.Frequency; })]);

		// append x-axis to surface
		xbar = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(50," + parseInt(height - 20) + ")")
			.call(xAxis);

		// append y-axis to surface
		ybar = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(45, 30)")
			.call(yAxis);

		// append y-axis label to surface
		text = svg.append("text")
			.attr("class", "axis")
			.attr("transform", "translate(65, 10)")
			.attr("y", 6)
			.attr("dy", "0.7em")
			.style("text-anchor", "end")
			.text("Frequency");

		// appends rect to surface
		bar = svg.selectAll(".bar")
			.data(data).enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", function(d,i) {
				if (i != divisions - 1) {
					return x(increment*(i)/1000 + "k" +"-"+ increment*(i+1)/1000 + "k") + 50;
				}
				else {
					return x(">1m") + 50;
				}
			})
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.Frequency) + 30 ; })
			.attr("height", function(d) { return height - 50 - y(d.Frequency); })
			.style("fill", colour(4))
			.style("stroke", "#000")
	})

	// This functions runs when a new neighbourhood is clicked
	$('#Neighbourhood').change(function() {
		var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

		// fetches real-estate data from data.json file and calculates the number of houses
		// for each price range in the specified neighbourhood
		d3.json("data.json", function(json_data) {
			data = [];
			for (i = 0; i < divisions; i++) {
				count = 0;
				json_data.forEach(function(d) {
					if ((i < divisions - 1) && (Neighbourhood == d.Neighbourhood)) {
						if ((d.Price < (increment*(i+1)+parseInt(min_price)))&&(d.Price>(increment*(i)+parseInt(min_price)))){
							count += 1;
						}
					}
					else if (Neighbourhood == d.Neighbourhood) {
						if (d.Price > 1000000) {
							count += 1;
						}
					}
					else if (Neighbourhood == d.Neighbourhood) {
						if (d.Price > 1000000) {
							count += 1;
						}
					}
				})
				array = [{"Frequency":count}];
				data = data.concat(array);
  			}

			// creates a new scale for y-axis
			y.domain([0, d3.max(data, function(d) { return d.Frequency; })]);

			// remove old y-axis
			ybar.remove()

			// append the new y-axis
			ybar = svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(45, 30)")
				.call(yAxis);

			// transition from old values to new values for rect
			bar.data(data)
				.transition()
				.duration(1000)
				.attr("y", function(d) { return y(d.Frequency) + 30 ; })
				.attr("height", function(d) { return height - 50 - y(d.Frequency); })
		});
	});
})
