d3.csv("data/disney.csv", function(data)
       {
    var filtered_data = data.filter(function(d) { 
        return d.type === "TV Show" && d.rating.startsWith("TV");
    }); // end of filtered_data
    

var maxYear = d3.max(filtered_data, function(d){ return +d.release_year; });


var yearRanges = [];
for (var start = 1970; start <= maxYear; start += 5){
    var end = Math.min(start+4, maxYear);
    yearRanges.push({start: start, end: end});
} // end of for loop

var ratings = ["TV-Y", "TV-Y7", "TV-Y7-FV", "TV-G", "TV-PG", "TV-14"];

var allYearsData = yearRanges.map(function(range){

    var rangeData = filtered_data.filter(function(d){
        var year = +d.release_year;
        return year >= range.start && year <= range.end;
    }); // end of yearData

    var ratingCounts = ratings.map(function(rating)
        {
        var count = rangeData.filter(function(d){
            return d.rating === rating;
            }).length;
            
        return {rating: rating, counts: count};
            
        }); // end of rating counts
    
    return {range: range.start + "-" + range.end, counts: ratingCounts};
        
    }); // end of allYearsData

       var initialData = allYearsData[0].counts;
       var margin = {top: 40, right: 20, bottom: 50, left: 50}
       var width = 700 - margin.right - margin.left;
       var height = 400 - margin.top - margin.bottom;

       var xScale = d3.scale.ordinal()
                     .domain(initialData.map(d => d.rating))
                     .rangeRoundBands([0, width], 0.1);

       var yScale = d3.scale.linear()
                     .domain([0, d3.max(initialData, function(d) {return d.counts})])
                     .range([height, 0])
              
drawBarChart();

}); // end of dc.csv

























