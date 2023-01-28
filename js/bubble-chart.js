function initBubbleChart(data) {
	d3.select("#bubble-chart").html('');
	const container = d3.select('#bubble-chart-container').node();
	const margin = {top: 24, right: 24, bottom: 24, left: 24},
			width = container.getBoundingClientRect().width - margin.left - margin.right,
			height = container.getBoundingClientRect().height - margin.top - margin.bottom;

	const svg = d3.select("#bubble-chart")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

	// Add X axis - population_density
	const x = d3.scaleLinear()
		.domain([0, 100])
		.range([ 0, width ]);
	svg.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x));

	// Add Y axis - population_growth_rate
	const y = d3.scaleLinear()
		.domain([0, 5])
		.range([ height, 0]);
	svg.append("g")
		.call(d3.axisLeft(y));

	// Add a scale for bubble - Population
	const z = d3.scaleLinear()
		.domain([getMin(data, 'population'), getMax(data, 'population')])
		.range([ 10, 100]);

	// Add a scale for bubble color
	const myColor = d3.scaleOrdinal()
		.domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
		.range(d3.schemeSet2);

	// -1- Create a tooltip div that is hidden by default:
	const tooltip = d3.select("#bubble-chart")
		.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "black")
			.style("border-radius", "5px")
			.style("padding", "10px")
			.style("color", "white")
			.style("position", "absolute")

	// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
	const showTooltip = function(event, d) {
		tooltip
			.transition()
			.duration(200)
		tooltip
			.style("opacity", 1)
			.html(`
				<div>Year: ${d.year}</div>
				<div>Country: ${d.country}</div>
				<div>Population: ${d.population}</div>`
			)
			.style("left", event.x + "px")
			.style("top", (event.y/2) + "px")
	}
	const moveTooltip = function(event, d) {
		tooltip
			.style("left", event.x + "px")
			.style("top", (event.y/2) + "px")
	}
	const hideTooltip = function(event, d) {
		tooltip
			.transition()
			.duration(200)
			.style("opacity", 0)
	}

	// Render Dots
	svg.append('g')
		.selectAll("dot")
		.data(data)
		.join("circle")
			.attr("class", "bubbles")
			.attr("cx", d => x(d.population_density))
			.attr("cy", d => y(d.population_growth_rate))
			.attr("r", d => z(d.population))
			.style("fill", d => myColor(d.country))
		.on("mouseover", showTooltip )
		.on("mousemove", moveTooltip )
		.on("mouseleave", hideTooltip )
}