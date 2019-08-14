
var color = d3.scale.category10();

var margin = {top: 100, right: 100, bottom: 100, left: 150},
    width = 800,
    height = 600 - margin.top - margin.bottom;

var countrylists = {
                    1 :  "China-Shanghai (Asia)",
                    2 :  "Singapore (Asia)",
                    3 :  "Hong Kong (Asia)",
                    4 :  "Taiwan (Asia)",
                    5 :  "South Korea (Asia)",
                    6 :  "Macao (Asia)",
                    7 :  "Liechtenstein (Europe)",
                    8 :  "Japan (Asia)",
                    9 :  "Estonia (Europe)",
                    10 :  "Poland (Europe)",
                    11 :  "Switzerland (Europe)",
                    12 :  "Czech Republic (Europe)",
                    13 :  "Belgium (Europe)",
                    14 :  "Netherlands (Europe)",
                    15 :  "Germany (Europe)",
                    16 :  "Vietnam (Asia)",
                    17 :  "Canada (America)",
                    18 :  "Finland (Europe)",
                    19 :  "Austria (Europe)",
                    20 :  "New Zealand (Oceania)",
                    21 :  "Ireland (Europe)",
                    22 :  "France (Europe)",
                    23 :  "Latvia (Europe)",
                    24 :  "Spain (Europe)",
                    25 :  "Iceland (Europe)",
                    26 :  "Australia (Oceania)",
                    27 :  "Italy (Europe)",
                    28 :  "Luxembourg (Europe)",
                    29 :  "United Kingdom (Europe)",
                    30 :  "Norway (Europe)",
                    31 :  "Denmark (Europe)",
                    32 :  "Hungary (Europe)",
                    33 :  "United States (America)",
                    34 :  "Slovak Republic (Europe)",
                    35 :  "Slovenia (Europe)",
                    36 :  "Portugal (Europe)",
                    37 :  "Russian Federation (Europe)",
                    38 :  "Sweden (Europe)",
                    39 :  "Lithuania (Europe)",
                    40 :  "Croatia (Europe)",
                    41 :  "Israel (Middle East & Africa)",
                    42 :  "Greece (Europe)",
                    43 :  "Turkey (Europe)",
                    44 :  "Serbia (Europe)",
                    45 :  "Romania (Europe)",
                    46 :  "Chile (America)",
                    47 :  "Bulgaria (Europe)",
                    48 :  "Thailand (Asia)",
                    49 :  "United Arab Emirates (Middle East & Africa)",
                    50 :  "Kazakhstan (Asia)",
                    51 :  "Malaysia (Asia)",
                    52 :  "Mexico (America)",
                    53 :  "Uruguay (America)",
                    54 :  "Costa Rica (America)",
                    55 :  "Montenegro (Europe)",
                    56 :  "Argentina (America)",
                    57 :  "Albania (Europe)",
                    58 :  "Tunisia (Middle East & Africa)",
                    59 :  "Colombia (America)",
                    60 :  "Jordan (Middle East & Africa)",
                    61 :  "Brazil (America)",
                    62 :  "Qatar (Middle East & Africa)",
                    63 :  "Indonesia (Asia)",
                    64 :  "Peru (America)"};

var dimensions = [
  {
    name: "Rank",
    scale: d3.scale.linear().range([0, height]),
    type: "number"
  },
  {
    name: "Math Score",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Reading Score",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Science Score",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Sets Clear Goals",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Thinking and Reasoning",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Reflect Problems",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Homework Back in Time",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Helps Students with Learning",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Opportunity to Express Opinions",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Teachers Are Interested",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },

  /*
  {
    name: "GDP per capita",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  }
  */
];

var tooltip = d3.select("#tooltip").classed("hidden", true);

var x = d3.scale.ordinal()
    .domain(dimensions.map(function(d) { return d.name; }))
    .rangePoints([0, width]);

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dimension = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

d3.csv("data/pisa.csv", function(data) {
  dimensions.forEach(function(dimension) {
    dimension.scale.domain(dimension.type === "number"
        ? d3.extent(data, function(d) { return +d[dimension.name]; })
        : data.map(function(d) { return d[dimension.name]; }).sort());
  });

  svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      //.style("stroke", function(d) { return color(d.Country); })
      .style("stroke", function(d) { return color(d["Rank"]); })
      .attr("d", draw);

  dimension.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
      .append("text")
      .attr("class", "title")
      .attr("text-anchor", "begin")
      .attr("y", -9)
      .attr("transform", "translate(0,0) rotate(-30 -10 50)")
      .text(function(d) { return d.name; });

  var ordinal_labels = svg.selectAll(".axis text")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  var projection = svg.selectAll(".background path,.foreground path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  function mouseover(d) {
    svg.classed("active", true);

  //Get the mouse x/y, then augment for the tooltip
  var coordinates = [0, 0];
  coordinates = d3.mouse(this);
  var xPosition = coordinates[0] + 170;
  var yPosition = coordinates[1] + 80;

  if((xPosition > 150) && (xPosition < 1260) && (yPosition < 700) && (yPosition > 80))
  {
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px")
      .select("#country")
      .text(countrylists[d.Rank]);
    d3.select("#tooltip #ms")
      .text("Math Score       : " + d["Math Score"]);
    d3.select("#tooltip #ss")
      .text("Science Score : " + d["Science Score"]);
    d3.select("#tooltip #rs")
      .text("Reading Score : " + d["Reading Score"]);
    d3.select("#tooltip #rk")
      .text("Rank          : " + d.Rank);

    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
  }

    // this could be more elegant
    if (typeof d === "string") {
      projection.classed("inactive", function(p) { return p.name !== d; });
      projection.filter(function(p) { return p.name === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d; });
      ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
    } else {
      projection.classed("inactive", function(p) { return p !== d; });
      projection.filter(function(p) { return p === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
      ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
    }

  }

  function mouseout(d) {

    d3.select("#tooltip").classed("hidden", true);

    svg.classed("active", false);
    projection.classed("inactive", false);
    ordinal_labels.classed("inactive", false);

  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }
});

function draw(d) {
  return line(dimensions.map(function(dimension) {
    return [x(dimension.name), dimension.scale(d[dimension.name])];
  }));
}
