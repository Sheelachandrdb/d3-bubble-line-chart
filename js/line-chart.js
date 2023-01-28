function initLineChart(data) {
	d3.select("#line-chart").html('');

	const container = d3.select('#line-chart-container').node();
	const margin = {top: 20, right: 30, bottom: 30, left: 80},
			width = container.getBoundingClientRect().width - margin.left - margin.right,
			height = container.getBoundingClientRect().height - margin.top - margin.bottom;

	const svg = d3.select("#line-chart")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

	// add the x Axis
	const x = d3.scaleLinear()
						.domain([1950, 2021])
						.range([0, width])
	svg.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x));

	// add the y Axis
	var y = d3.scaleLinear()
						.domain([getMin(data, 'total'), getMax(data, 'total')])
						.range([height, 0])
	svg.append("g")
			.call(d3.axisLeft(y));

	// Plot the area
	svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 2.5)
		.attr("d", d3.line()
			.x(function(d) { return x(d.year) })
			.y(function(d) { return y(d.total) })
		)
}