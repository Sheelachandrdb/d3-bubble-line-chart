let populationData = [];
let populationDataByYear = {};
let populationCountByYear = [];
let selectedYear = "";

// Util Methods
function getByKey(data, key) {
	return data.map(d => d[key]);
}

function getMin(data, key) {
	return Math.min(...getByKey(data, key));
}

function getMax(data, key) {
	return Math.max(...getByKey(data, key));
}

function parseCsvToJson(csv) {
	if (csv) {
		csv = csv.replace(/\r| |(|)/g, "");
		const csvLines = csv.split('\n');
		const keys = csvLines.splice(0, 1);

		const json = csvLines.map(line => {
			line = line.replace(/"[^"]+"/g, function(v) { 
				return v.replace(/,/g, "");
			});
			line = line.replace(/"/g, "");

			line = line.split(',');

			return {
				country: line[0],
				year: parseInt(line[1]),
				population: parseFloat(line[2]),
				population_density: parseFloat(line[3]),
				population_growth_rate: parseFloat(line[4]),
			}
		});

		return json;
	}
}

function groupDataByYear(items) {
	items.map(item => {
		if (!populationDataByYear[item.year]) {
			populationDataByYear[item.year] = []
		}
		populationDataByYear[item.year].push(item);
	});

	let options = '';
	Object.keys(populationDataByYear).map(year => {
		options = options + `<option value=${year}>${year}</option>`;
		populationCountByYear.push({
			year: +year,
			total: populationDataByYear[year].reduce((total, next) => {
				total = total + next.population;
				return total;
			}, 0)
		})
	});

	document.getElementById('select-year-filter').innerHTML = options;
	selectedYear = Object.keys(populationDataByYear)[0];
	initBubbleChart(populationDataByYear[selectedYear]);
	initLineChart(populationCountByYear);
	calculateTotalPopulation(populationCountByYear);
}

function calculateTotalPopulation(data) {
	const yearData = data.find(d => d.year === +selectedYear);
	document.getElementById('count').innerHTML = (yearData.total / 1000000).toFixed(1);
}

function initPopulationCsv() {
	fetch('./data/population.csv', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/text',
		},
	})
	.then((response) => response.text())
	.then((data) => {
		populationData = parseCsvToJson(data);
		groupDataByYear(populationData);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function onChangeYear(e) {
	selectedYear = e.target.value;
	initBubbleChart(populationDataByYear[selectedYear]);
	calculateTotalPopulation(populationCountByYear);
}

initPopulationCsv();

let resizeTimer;
addEventListener("resize", (event) => {
	clearTimeout(resizeTimer);
	if (selectedYear) {
		resizeTimer = setTimeout(()=> {
			initBubbleChart(populationDataByYear[selectedYear]);
			initLineChart(populationCountByYear);
		}, 500);
	}
});