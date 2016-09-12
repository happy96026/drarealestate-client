$(document).ready(function() {

	// declare constants and variables
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width =  450,
		height = 300;

	var houses = 0,
		mean_price = 0,
		mean_size = 0,
		index_price = 0;

	// create svg surface
	var svg = d3.select(".overview").append("svg")
		.attr("width", width)
		.attr("height", height)


	d3.json("data.json", function(json_data) {

		// calculates mean price, mean size, number of houses
		// and price per square metre
		json_data.forEach(function(d) {
			if (d["PROPERTY TYPE"] == "RESIDENTIAL") {
				mean_price += d.Price;
				mean_size += d["NET AREA"];
				houses += 1;
				index_price += d.Price/d["NET AREA"];
			}
		})

		mean_price = (mean_price/houses).toFixed(2);
		mean_size = (mean_size/houses).toFixed(2);
		index_price = (index_price/houses).toFixed(2);

		// append text to surface
		svg.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", 20)
			.attr("class", "houses")
			.text("Number of Residential Houses: " + houses);

		svg.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", 45)
			.attr("class", "mean_price")
			.text("Mean Price: " + mean_price);

		svg.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", 70)
			.attr("class", "mean_size")
			.text("Mean Size: " + mean_size);

		svg.append("text")
			.attr("fill", "#34495e")
			.attr("x", 5)
			.attr("y", 95)
			.attr("class", "index_price")
			.text("Mean Price per Square Metre: " + index_price);
	})

	// This function runs when new neighbourhood is clicked
	$('#Neighbourhood').change(function() {
		d3.json("data.json", function(json_data) {

			var Neighbourhood = document.getElementById("Neighbourhood").value.toUpperCase();

			houses = 0,
			mean_price = 0,
			mean_size = 0,
			index_price = 0;

			// calculates the new mean price, mean size, number of houses
			// and price per square metre of the specified neighbourhood
			json_data.forEach(function(d) {
				if ((d["PROPERTY TYPE"] == "RESIDENTIAL")&&(d.Neighbourhood == Neighbourhood)) {
					mean_price += d.Price;
					mean_size += d["NET AREA"];
					houses += 1;
					index_price += d.Price/d["NET AREA"];
				}
			});

			mean_price = (mean_price/houses).toFixed(2);
			mean_size = (mean_size/houses).toFixed(2);
			index_price = (index_price/houses).toFixed(2);

			// change old text to new text
			svg.select(".houses")
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text("Number of Residential Houses: " + houses);

			svg.select(".mean_price")
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text("Mean Price: " + mean_price);

			svg.select(".mean_size")
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text("Mean Size: " + mean_size);

			svg.select(".index_price")
				.transition()
				.duration(500)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text("Mean Price per Square Metre: " + index_price);

		});
	});

})
