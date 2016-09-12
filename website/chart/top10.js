$(document).ready(function() {
	// declare variables and constants
	var expensive = [],
		largest = [],
		slice = 0;

	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width = 450,
		height = 300;

	var text1,
		text2;

	// svg for largest houses
	var svg1 = d3.select(".largest_houses").append("svg")
		.attr("width", width)
		.attr("height", height)

	// svg for expensive houses
	var svg2 = d3.select(".expensive_houses").append("svg")
		.attr("width", width)
		.attr("height", height)


	d3.json("data.json", function(json_data) {

		// Get Top 10 Expensive Houses
		json_data.sort(function(a, b) {
	    	return parseFloat(b.Price) - parseFloat(a.Price);
		});

		for (i = 0; i < json_data.length; i++) {
			if (expensive.length == 10) {
				break;
			}
			if (json_data[i]["PROPERTY TYPE"] == "RESIDENTIAL") {
				slice = json_data[i]["FULL ADDRESS"].search("EDMONTON");
				expensive.push(json_data[i]["FULL ADDRESS"].slice(0, slice - 1));
			}
		}

		// Get Top 10 Largest Houses
		json_data.sort(function(a, b) {
	    	return parseFloat(b["NET AREA"]) - parseFloat(a["NET AREA"]);
		});

		for (i = 0; i < json_data.length; i++) {
			if (largest.length == 10) {
				break;
			}
			if (json_data[i]["PROPERTY TYPE"] == "RESIDENTIAL") {
				slice = json_data[i]["FULL ADDRESS"].search("EDMONTON");
				largest.push(json_data[i]["FULL ADDRESS"].slice(0, slice - 1));
			}
		}

		// append the addresses
		text1 = svg1.selectAll("text")
			.data(largest).enter()
			.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", function(d, i) { return 25*i + 20 })
			.text(function(d, i) { return (i + 1) + ". " + d; });

		text2 = svg2.selectAll("text")
			.data(expensive).enter()
			.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", function(d, i) { return 25*i + 20 })
			.text(function(d, i) { return (i + 1) + ". " + d; });

	})

	// This function runs when new neighbourhood is clicked
	$('#Neighbourhood').change(function() {
		d3.json("data.json", function(json_data) {

			var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

			expensive = [],
			largest = [];

			// Get Top 10 Expensive Houses
			json_data.sort(function(a, b) {
		    	return parseFloat(b.Price) - parseFloat(a.Price);
			});

			for (i = 0; i < json_data.length; i++) {
				if (expensive.length == 10) {
					break;
				}
				if ((json_data[i]["PROPERTY TYPE"] == "RESIDENTIAL")&&(json_data[i]["Neighbourhood"] == Neighbourhood)) {
					slice = json_data[i]["FULL ADDRESS"].search("EDMONTON");
					expensive.push(json_data[i]["FULL ADDRESS"].slice(0, slice - 1));
				}
			}

			// Get Top 10 Largest Houses
			json_data.sort(function(a, b) {
		    	return parseFloat(b["NET AREA"]) - parseFloat(a["NET AREA"]);
			});

			for (i = 0; i < json_data.length; i++) {
				if (largest.length == 10) {
					break;
				}
				if ((json_data[i]["PROPERTY TYPE"] == "RESIDENTIAL")&&(json_data[i]["Neighbourhood"] == Neighbourhood)) {
					slice = json_data[i]["FULL ADDRESS"].search("EDMONTON");
					largest.push(json_data[i]["FULL ADDRESS"].slice(0, slice - 1));
				}

			}

			// If there is less than 10 largest/expensive houses, print None
			if (largest.length < 10) {
				while (largest.length < 10) {
					largest.push("None")
				}
			}

			if (expensive.length < 10) {
				while (expensive.length < 10) {
					expensive.push("None")
				}
			}

			// transition old addresses to new addresses
			text1.data(largest)
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text(function(d, i) { return (i + 1) + ". " + d; });

			text2.data(expensive)
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text(function(d, i) { return (i + 1) + ". " + d; });

		});
	});
})
