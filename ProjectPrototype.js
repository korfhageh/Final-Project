var svg = d3.select("svg");

var margin = {top:20, right:20, bottom:100, left:100};

var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var g = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Converting Score string data to a number
var parseTime = d3.timeParse("%d-%b-%y");
var dataset = d3.csv("Data.csv");
dataset.then(function(data) {
   
   data.forEach(function(d){
     d.Asian = +d.Asian;
     d.White = +d.White;
     d.Hispanic = +d.Hispanic;
     d.AfricanAmerican = +d.AfricanAmerican;
     d.NativeAmerican = +d.NativeAmerican;
     d.Year = parseTime(d.Year);
   });

});


dataset.then(function(data){
  
 
  // Gets the names of each series
  var seriesNames = d3.keys(data[0]).filter(function(d){return d!=='Year';}).sort();
  
  var series = seriesNames.map(function(series){
    return data.map(function(d){
      return {x:d.Year, y: d[series]};
    })
  });



  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(d3.extent(data, function(d) {return d.Year;}));
  y.domain([0, d3.max(data, function(d) { return Math.max( d.Asian, d.White,d.AfricanAmerican,d.Hispanic,d.NativeAmerican);  })]);  

// Draw y axis
  g.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x));

  // Draw x axis
  g.append("g")
    .call(d3.axisLeft(y));

var colorScheme = ["orange","blue","red","green","purple"];


// Asian
  var Asian = d3.line()
                 .x(function(d) {return x(d.Year);})
                 .y(function(d) {return y(d.Asian);});

  g.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "blue")
    .style("stroke-width", 3)
    .style("fill", "none")
    .attr("d", Asian);


// White
  var White = d3.line() 
                 .x(function(d) {return x(d.Year);})
                 .y(function(d) {return y(d.White);});

  g.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "purple")
    .style("stroke-width", 3)
    .style("fill", "none")
    .attr("d", White);


// Hispanic
    
  var Hispanic = d3.line() 
                 .x(function(d) {return x(d.Year);})
                 .y(function(d) {return y(d.Hispanic);});

  g.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .style("stroke-width", 3)
    .style("fill", "none")
    .attr("d", Hispanic);
    
// African Amercican
    
  var AfricanAmerican = d3.line() 
                 .x(function(d) {return x(d.Year);})
                 .y(function(d) {return y(d.AfricanAmerican);});

  g.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "orange")
    .style("stroke-width", 3)
    .style("fill", "none")
    .attr("d", AfricanAmerican);

// Native American
    
  var NativeAmerican = d3.line() 
                 .x(function(d) {return x(d.Year);})
                 .y(function(d) {return y(d.NativeAmerican);});

  g.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "green")
    .style("stroke-width", 3)
    .style("fill", "none")
    .attr("d", NativeAmerican);



var div = d3.select("#tooltip");

  g.selectAll("series")
  .data(series)
  .enter().append("g")
  .attr("class", "series")
  .style("fill", function(d,i) { return colorScheme[i]; })
  .selectAll(".point")
  .data(function(d){return d;})  
  .enter().append('circle')
  .attr("class", "point")
  .attr("r", 5)
  .attr("cx", function(d) {return x(d.x)})
  .attr("cy", function(d) {return y(d.y)})
  .attr("stroke", "white")
  .on("mouseover", function(d){        
      div.transition().duration(100).style("opacity", 0.8);
      div.style("left", (d3.event.pageX) + "px")
      .style("padding", "10px")
      .style("top", (d3.event.pageY - 50) + "px");

      div.html("Date: " + d.x.getFullYear() + "<br/>Value: " +  d.y);

   })
   .on("mouseout", function(d){
     div.transition().duration(100).style("opacity", 0);
   })

g.selectAll("labeldots")
 .data(seriesNames)
 .enter()
 .append("circle")
 .attr("cx", 45)
 .attr("cy", function(d,i){ return 10 + 25*i;})
 .attr("r",5)
 .style("fill", function(d,i){ return colorScheme[i];})
 
g.selectAll("key")
 .data(seriesNames)
 .enter()
 .append("text")
 .attr("x", 55)
 .attr("y", function(d,i){ return 10 + 25*i;})
 .style("fill", function(d,i){ return colorScheme[i];})
 .text(function(d){return d;})
 .attr("text-anchor", "left")
 .style("alignment-baseline", "middle")


});
  
