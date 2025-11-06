// Minimal D3 test chart
const testData = [
  {rating: "TV-Y", count: 5},
  {rating: "TV-Y7", count: 8},
  {rating: "TV-G", count: 3},
  {rating: "TV-PG", count: 6}
];

// Set chart dimensions
const width = 400;
const height = 200;
const margin = {top: 20, right: 20, bottom: 30, left: 40};

// Create SVG container
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// X scale
const x = d3.scaleBand()
  .domain(testData.map(d => d.rating))
  .range([margin.left, width - margin.right])
  .padding(0.2);

// Y scale
const y = d3.scaleLinear()
  .domain([0, d3.max(testData, d => d.count)])
  .nice()
  .range([height - margin.bottom, margin.top]);

// Draw bars
svg.selectAll("rect")
  .data(testData)
  .enter()
  .append("rect")
  .attr("x", d => x(d.rating))
  .attr("y", d => y(d.count))
  .attr("width", x.bandwidth())
  .attr("height", d => y(0) - y(d.count))
  .attr("fill", "orange");

// X axis
svg.append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(x));

// Y axis
svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));
