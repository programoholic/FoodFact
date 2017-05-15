
var margin = {
    top: 30,
    right: 40,
    bottom: 30,
    left: 50
};
var width = 700 - margin.left - margin.right;
var height = 508 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 1, 0.2);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient('bottom');

var yAxis = d3.svg.axis().scale(y).orient('left');

var valueline = d3.svg.line()
    .x(function(d) {
        
        return x(d.region);
    })
    .y(function(d) {
        return y(d.fat);
    });

var valueline2 = d3.svg.line()
    .x(function(d) {
        return x(d.region);
    })
    .y(function(d) {
        return y(d.protein);
    });

var valueline3 = d3.svg.line().x(function(d) {
    return x(d.region);
}).y(function(d) {
    return y(d.carbohydrate);
});

var svg = d3.select('#multiline')  // to add svg in div 
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// reading data from json file
    d3.json('output/fatCarboProtnData.json', function(error, data) {
    data.forEach(function(d) {
       d.region = d.region;
        console.log(d.region);
        d.fat = +d.fat;
        console.log(d.fat);

        d.protein = +d.protein;
        console.log(d.protein);  
        d.carbohydrate=+d.carbohydrate;
        console.log(d.carbohydrate); 
    });

    x.domain(data.map(function(d) {  // to map region on x axis
        return d.region;
    }));
    // Scale the range of the data
    y.domain([0, d3.max(data, function(d) {
        return Math.max(d.fat, d.protein, d.carbohydrate); // to map data on y axis 
    })]);

    // Add the valueline path.
    svg.append('path')
        .attr('class', 'line')
        .style('stroke', 'red')
        .style('stroke-width',2)
        .attr('d', valueline(data));
    // Add the valueline2 path.
    svg.append('path')
        .attr('class', 'line')
        .style('stroke', 'green')
        .style('stroke-width',2)
        .attr('d',valueline2(data));

    // Add the valueline2 path.
    svg.append('path')
        .attr('class', 'line')
        .style('stroke', 'blue')
        .style('stroke-width',2)
        .attr('d', valueline3(data));

    // Add the X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // Add the Y Axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    svg.append('text')
        .attr('transform', 'translate(' + (width + 3) + ',' + y(data[0].fat) + ')')
        .attr('dy', '.65em')
        .attr('text-anchor', 'start')
        .style('fill', 'red')
        .text('fat');

    svg.append('text')
        .attr('transform', 'translate(' + (width + 3) + ',' + y(data[0].protein) + ')')
        .attr('dy', '1.65em')
        .attr('text-anchor', 'start')
        .style('fill', 'green')
        .text('protein');

    svg.append('text')
        .attr('transform', 'translate(' + (width + 3) + ',' + y(data[0].carbohydrate) + ')')
        .attr('dy', '.55em')
        .attr('text-anchor', 'start')
        .style('fill', 'blue')
        .text('carbo');
});