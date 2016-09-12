$(document).ready(function() {
	$.ajax({
		url: "https://data.edmonton.ca/api/geospatial/jfvj-x253?method=export&format=GeoJSON"
	}).done(function(data) {
		var color = d3.scale.category20();

		var width = 700,
			height = 500;

		var canvas = d3.select(".option").append("svg")
				.attr("width", width)
				.attr("height", height)

		var group = canvas.selectAll("g")
			.data(data.features)
			.enter()
			.append("g")
			.attr("transform", "translate(200, 10)")

		var projection = d3.geo.mercator().scale(1).translate([0,0]);
		var path = d3.geo.path().projection(projection);

		var b = path.bounds(data),
		    s = (0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][0]) / height)) * 100, 
		    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
			.scale(s)
			.translate(t);

		var areas = group.append("path")
			.attr("d", path)
			.attr("class", "area")
			.attr("fill", function(d, i) {return "steelblue" })

	})
})