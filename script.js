d3.csv("data/disney.csv", function(data) {

  // Filter TV Shows with valid ratings
  var filtered_data = data.filter(function(d) {
    return d.type === "TV Show" && d.rating && d.rating.trim().toUpperCase().startsWith("TV");
  });

  // Get max year in the dataset
  var maxYear = d3.max(filtered_data, function(d){ return +d.release_year; });

  // Create 5-year ranges
  var yearRanges = [];
  for (var start = 1970; start <= maxYear; start += 5) {
    var end = Math.min(start + 4, maxYear);
    yearRanges.push({start: start, end: end});
  }

  // Ratings to display
  var ratings = ["TV-Y", "TV-Y7", "TV-Y7-FV", "TV-G", "TV-PG", "TV-14"];

  // Aggregate counts for each 5-year range
  var allYearsData = yearRanges.map(function(range) {
    var rangeData = filtered_data.filter(function(d) {
      var year = +d.release_year;
      return year >= range.start && year <= range.end;
    });

    var ratingCounts = ratings.map(function(rating) {
      var count = rangeData.filter(function(d) {
        return d.rating && d.rating.trim().toUpperCase() === rating;
      }).length;
      return {rating: rating, counts: count};
    });

    return {range: range.start + "-" + range.end, counts: ratingCounts};
  });

  // Dimensions
  var margin = {top: 40, right: 20, bottom: 50, left: 50};
  var width = 700 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Initial data for first range
  var initialData = allYearsData[0].counts;

  // Scales
  var xScale = d3.scale.ordinal()
      .domain(initialData.map(function(d){ return d.rating; }))
      .rangeRoundBands([0, width], 0.1);

  var yScale = d3.scale.linear()
      .domain([0, d3.max(initialData, function(d){ return d.counts; })])
      .range([height, 0]);

  // SVG container
  var svg = d3.select("#main")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Axes
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Draw bars function
  function drawBarChart(data) {
    // Update yScale domain
    yScale.domain([0, d3.max(data, function(d){ return d.counts; })]);
    svg.select(".y.axis").call(yAxis);

    // Bind data
    var bars = svg.selectAll(".bar").data(data);

    // Update existing bars
    bars.attr("x", function(d){ return xScale(d.rating); })
        .attr("y", function(d){ return yScale(d.counts); })
        .attr("height", function(d){ return height - yScale(d.counts); })
        .attr("width", xScale.rangeBand());

    // Enter new bars
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "#69b3a2")
        .attr("x", function(d){ return xScale(d.rating); })
        .attr("y", function(d){ return yScale(d.counts); })
        .attr("height", function(d){ return height - yScale(d.counts); })
        .attr("width", xScale.rangeBand());

    // Remove old bars
    bars.exit().remove();
  }

  // Draw initial chart
  drawBarChart(initialData);

});
