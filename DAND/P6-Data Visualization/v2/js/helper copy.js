

var margin = {top: 100, right: 100, bottom: 150, left: 150},
    width = 800,
    height = 900 - margin.top - margin.bottom;

// Option selected in the navigation menu
var menuOption = 0;

var colorProfiles = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099"];

// Titles for the navigation menu
var explanationTitle = [
                        "PISA 2012 Overview",
                        "Teacher-Directed Instruction - Sets Clear Goals",
                        "Teacher-Directed Instruction - Encourages Thinking and Reasoning",
                        "Teacher-Directed Instruction - Summarizes Previous Lessons",
                        "Cognitive Activation - Teacher Encourages to Reflect Problems",
                        "Disciplinary Climate - Teacher Has to Wait Until its Quiet",
                        "Vignette Teacher Support - Homework Once a Week/Not Back in Time",
                        "Teacher Support - Gives Opportunity to Express Opinions",
                        "Student-Teacher Relation - Teachers Are Interested"
                        ];


var countryDomain = ["China-Shanghai", "Singapore", "Hong Kong", "Taiwan", "South Korea", "Macao", "Liechtenstein", "Japan", "Estonia", "Poland", "Switzerland", "Czech Republic",
                    "Belgium", "Netherlands", "Germany", "Vietnam", "Canada", "Finland", "Austria", "New Zealand",
                    "Ireland", "France", "Latvia", "Spain", "Iceland", "Australia", "Italy", "Luxembourg", "United Kingdom",
                    "Norway", "Denmark", "Hungary", "United States", "Slovak Republic", "Slovenia", "Portugal",
                    "Russian Federation", "Sweden", "Lithuania", "Croatia", "Israel",
                    "Greece", "Turkey", "Serbia", "Romania", "Chile", "Bulgaria", "Thailand", "United Arab Emirates",
                    "Kazakhstan", "Malaysia", "Mexico", "Uruguay", "Costa Rica", "Montenegro", "Argentina",
                    "Albania", "Tunisia", "Colombia", "Jordan", "Brazil", "Qatar", "Indonesia", "Peru", 'Max', 'Min'];

var countrylists = {
                    1 : "China-Shanghai",
                    2 : "Singapore",
                    3 : "Hong Kong",
                    4 : "Taiwan",
                    5 : "South Korea",
                    6 : "Macao",
                    7 : "Liechtenstein",
                    8 : "Japan",
                    9 : "Estonia",
                    10 : "Poland",
                    11 : "Switzerland",
                    12 : "Czech Republic",
                    13 : "Belgium",
                    14 : "Netherlands",
                    15 : "Germany",
                    16 : "Vietnam",
                    17 : "Canada",
                    18 : "Finland",
                    19 : "Austria",
                    20 : "New Zealand",
                    21 : "Ireland",
                    22 : "France",
                    23 : "Latvia",
                    24 : "Spain",
                    25 : "Iceland",
                    26 : "Australia",
                    27 : "Italy",
                    28 : "Luxembourg",
                    29 : "United Kingdom",
                    30 : "Norway",
                    31 : "Denmark",
                    32 : "Hungary",
                    33 : "United States",
                    34 : "Slovak Republic",
                    35 : "Slovenia",
                    36 : "Portugal",
                    37 : "Russian Federation",
                    38 : "Sweden",
                    39 : "Lithuania",
                    40 : "Croatia",
                    41 : "Israel",
                    42 : "Greece",
                    43 : "Turkey",
                    44 : "Serbia",
                    45 : "Romania",
                    46 : "Chile",
                    47 : "Bulgaria",
                    48 : "Thailand",
                    49 : "United Arab Emirates",
                    50 : "Kazakhstan",
                    51 : "Malaysia",
                    52 : "Mexico",
                    53 : "Uruguay",
                    54 : "Costa Rica",
                    55 : "Montenegro",
                    56 : "Argentina",
                    57 : "Albania",
                    58 : "Tunisia",
                    59 : "Colombia",
                    60 : "Jordan",
                    61 : "Brazil",
                    62 : "Qatar",
                    63 : "Indonesia",
                    64 : "Peru"};

var ColorMap = {
                1 : 2,
                2 : 2,
                3 : 2,
                4 : 2,
                5 : 2,
                6 : 2,
                7 : 3,
                8 : 2,
                9 : 3,
                10 : 3,
                11 : 3,
                12 : 3,
                13 : 3,
                14 : 3,
                15 : 3,
                16 : 2,
                17 : 1,
                18 : 3,
                19 : 3,
                20 : 5,
                21 : 3,
                22 : 3,
                23 : 3,
                24 : 3,
                25 : 3,
                26 : 5,
                27 : 3,
                28 : 3,
                29 : 3,
                30 : 3,
                31 : 3,
                32 : 3,
                33 : 1,
                34 : 3,
                35 : 3,
                36 : 3,
                37 : 3,
                38 : 3,
                39 : 3,
                40 : 3,
                41 : 4,
                42 : 3,
                43 : 3,
                44 : 3,
                45 : 3,
                46 : 1,
                47 : 3,
                48 : 2,
                49 : 4,
                50 : 2,
                51 : 2,
                52 : 1,
                53 : 1,
                54 : 1,
                55 : 3,
                56 : 1,
                57 : 3,
                58 : 4,
                59 : 1,
                60 : 4,
                61 : 1,
                62 : 4,
                63 : 2,
                64 : 1};

var Continentlists = {
                      1 : "Asia",
                      2 : "Asia",
                      3 : "Asia",
                      4 : "Asia",
                      5 : "Asia",
                      6 : "Asia",
                      7 : "Europe",
                      8 : "Asia",
                      9 : "Europe",
                      10 : "Europe",
                      11 : "Europe",
                      12 : "Europe",
                      13 : "Europe",
                      14 : "Europe",
                      15 : "Europe",
                      16 : "Asia",
                      17 : "America",
                      18 : "Europe",
                      19 : "Europe",
                      20 : "Oceania",
                      21 : "Europe",
                      22 : "Europe",
                      23 : "Europe",
                      24 : "Europe",
                      25 : "Europe",
                      26 : "Oceania",
                      27 : "Europe",
                      28 : "Europe",
                      29 : "Europe",
                      30 : "Europe",
                      31 : "Europe",
                      32 : "Europe",
                      33 : "America",
                      34 : "Europe",
                      35 : "Europe",
                      36 : "Europe",
                      37 : "Europe",
                      38 : "Europe",
                      39 : "Europe",
                      40 : "Europe",
                      41 : "Middle East & Africa",
                      42 : "Europe",
                      43 : "Europe",
                      44 : "Europe",
                      45 : "Europe",
                      46 : "America",
                      47 : "Europe",
                      48 : "Asia",
                      49 : "Middle East & Africa",
                      50 : "Asia",
                      51 : "Asia",
                      52 : "America",
                      53 : "America",
                      54 : "America",
                      55 : "Europe",
                      56 : "America",
                      57 : "Europe",
                      58 : "Middle East & Africa",
                      59 : "America",
                      60 : "Middle East & Africa",
                      61 : "America",
                      62 : "Middle East & Africa",
                      63 : "Asia",
                      64 : "America"};


//var dimensions = [
var pisaDimention = [
  {
    name: "Country",
    scale: d3.scale.ordinal().domain(countryDomain).rangePoints([0, height]),
    axis:  d3.svg.axis().orient("right")
                        .tickFormat(function(d) { return d.slice(0,12); }),
    type: "String"
  },
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
    name: "Encourages Thinking",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Summarizes Lessons",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Reflect Problems",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Wait Until its Quiet",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  },
  {
    name: "Homework Not Back in Time",
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
  {
    name: "GDP per capita",
    scale: d3.scale.linear().range([height, 0]),
    type: "number"
  }];

var option0  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[4]];
var option1  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[4]];
var option2  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[5]];
var option3  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[6]];
var option4  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[7]];
var option5  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[8]];
var option6  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[9]];
var option7  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[10]];
var option8  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[11]];
var option9  = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[12]];
var option10 = [pisaDimention[0], pisaDimention[1], pisaDimention[2], pisaDimention[3], pisaDimention[13]];

console.log(pisaDimention[0]);

var optionFlow = {
                    0 : option0,
                    1 : option1,
                    2 : option2,
                    3 : option3,
                    4 : option4,
                    5 : option5,
                    6 : option6,
                    7 : option7,
                    8 : option8};

//var dimensions = [
var dimensions = optionFlow[0];

var tooltip = d3.select("#tooltip").classed("hidden", true);

var x = d3.scale.ordinal()
    .domain(dimensions.map(function(d) { return d.name; }))
    .rangePoints([0, width]);

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
    .orient("left");
/*
    xAxis = d3.svg.axis().scale(xScale)
            .tickFormat(function(d) {

                if(seriesX == 'seriesValue'){
                    return factions[d]}

                else{
                    return d}
            })
         .orient("bottom");
         */

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

var axes = svg.selectAll(".axis")
    .data(dimensions)
  .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

// Control the prev button
d3.select("#navigation #prev ").on("click", function()
{

    if( menuOption > 0)
    {
        menuOption -= 1;
        console.log(explanationTitle[menuOption])
    }
    if( menuOption == 0)
    {
        d3.select("#navigation #prev")
          .style('background-image', 'url("images/prev_light.png")')
    }
    if( menuOption == 8 )
    {
        d3.select("#navigation #next")
          .style('background-image', 'url("images/next.png")')
    }
    navigation()

});

// Control the next button
d3.select("#navigation #next").on("click", function()
{
    if( menuOption < 8)
    {
        menuOption += 1;
        console.log(explanationTitle[menuOption])
        navigation()
    }
    if( menuOption == 8)
    {
        d3.select("#navigation #next")
          .style('background-image', 'url("images/next_light.png")')

        //menuOption = 0;
    }
    if( menuOption == 1)
    {
        d3.select("#navigation #prev")
          .style('background-image', 'url("images/prev.png")')
    }
});

// Control the next button
d3.select("#navigation #home").on("click", function()
{
    menuOption = 0;
    console.log(explanationTitle[menuOption])
    navigation()

    d3.select("#navigation #next")
      .style('background-image', 'url("images/next.png")')

    d3.select("#navigation #prev")
      .style('background-image', 'url("images/prev_light.png")')

});



// Change texts and axis for every step in navigation
function navigation(d)
{
      d3.select("#explanationTopic p")
        .text(explanationTitle[menuOption]);

      //d3.select("#explanationTitle p")
      //  .text(explanationTitle[menuOption]);
}

// load the data
d3.csv("data/pisa.csv", function(data)
{
    dimensions.forEach(function(dimension)
    {
      dimension.scale.domain(dimension.type === "number"
                            ? d3.extent(data, function(d) { return +d[dimension.name]; })
                            : data.map(function(d) { return d[dimension.name]; }).sort());
    });

    var ordinal = d3.scale.ordinal()
                          //.domain(["America", "Asia", "Europe", "Oceania", "ME & Africa"])
                          .domain(["Oceania", "America", "Asia", "Europe", "ME & Africa"])
                          .range(colorProfiles);

    svg.append("g")
       .attr("class", "legendOrdinal")
       .attr("transform", "translate(300,520)");

    var legendOrdinal = d3.legend.color()
      .shape("path", d3.svg.symbol().type("circle").size(400)())
      .orient('horizontal')
      .shapePadding(40)
      .scale(ordinal);

    svg.select(".legendOrdinal")
       .call(legendOrdinal);



    ///
/*
axes.append("g")
      .attr("class", "axis")
      .each(function(d) {
        var renderAxis = "axis" in d
          ? d.axis.scale(d.scale)  // custom axis
          : yAxis.scale(d.scale);  // default axis
        d3.select(this).call(renderAxis);
      })
    .append("text")
      .attr("class", "title")
      .attr("text-anchor", "start")
      //.text(function(d) { return "description" in d ? d.description : d.name; });
      .text(function(d) { return d.name; });
*/
    ///

    // legent description
    svg.append("g")
       .append('text')
       .attr('transform', 'translate(400, 500)')
       .attr("font-family", "sans-serif")
       .attr("font-size", "20px")
       .attr({'text-anchor': 'middle', 'font-weight': 'bold'})
       .text('Continent');

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
        .style('opacity',function(d){
                                        if(d["Rank"] == 65 )
                                          return 0;
                                        else
                                          return 1;})
        .style("stroke", function(d){return lineColores(ColorMap[d["Rank"]]); })
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

    function mouseover(d)
    {
        svg.classed("active", true);

        // this could be more elegant
        if (typeof d === "string")
        {
            projection.classed("inactive", function(p) { return p.name !== d; });
            projection.filter(function(p) { return p.name === d; }).each(moveToFront);
            ordinal_labels.classed("inactive", function(p) { return p !== d; });
            ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
        }
        else
        {
            projection.classed("inactive", function(p) { return p !== d; });
            projection.filter(function(p) { return p === d; }).each(moveToFront);
            ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
            ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
        }

        //Get the mouse x/y, then augment for the tooltip
        var coordinates = [0, 0];
            coordinates = d3.mouse(this);
        var xPosition   = coordinates[0] + 170;
        var yPosition   = coordinates[1] + 80;

        // Set boundary to display tool tip
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

    }

    function mouseout(d)
    {
        // hide tool tip when move out
        d3.select("#tooltip").classed("hidden", true);

        svg.classed("active", false);
        projection.classed("inactive", false);
        ordinal_labels.classed("inactive", false);

    }

    //move active selection to front
    function moveToFront()
    {
        this.parentNode.appendChild(this);
    }

});

function draw(d)
{
    return line(dimensions.map(function(dimension)
    {
        return [x(dimension.name), dimension.scale(d[dimension.name])];
    }));
}

function lineColores(n)
{
  return colorProfiles[n];
  //return colores_g[n % colores_g.length];
}