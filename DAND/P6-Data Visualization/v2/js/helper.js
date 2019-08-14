

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800,
    height = 800 - margin.top - margin.bottom;

// Option selected in the navigation menu
var binWidth = 80;
// number parallel coordatinate
var colNum = 1;
var widthUpdate = 0;

// Option selected in the navigation menu
var menuOption = 0;

var types ={
            "Rank":
                  {
                      key: "Rank",
                      coerce: function(d) { return +d; },
                      extent: d3.extent,
                      within: function(d, extent) { return extent[0] <= d && d <= extent[1]; },
                      defaultScale: d3.scale.linear().range([1, height])
                  },
            "Number": {
                      key: "Number",
                      coerce: function(d) { return +d; },
                      extent: d3.extent,
                      within: function(d, extent) { return extent[0] <= d && d <= extent[1]; },
                      defaultScale: d3.scale.linear().range([height, 0])
                    },
            "String": {
                      key: "String",
                      coerce: String,
                      //extent: function (data) { return data.sort(); },
                      extent: function (data) { return data; },
                      within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
                      defaultScale: d3.scale.ordinal().rangePoints([height, 1])
                    }
};

var colorProfiles = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

// Titles for the navigation menu
var summaryTopics =["Student achievement over all test result.",
                    "The achievement focus on mathematics.",
                    "The achievement  focus on science.",
                    "The achievement  focus on reading."
                  ];
var summaryDetails =["PISA 2012 is assessed the competencies of 15-year-olds in mathematics, science and reading in 65 countries and around 510,000 students participated as a whole representing about 28 million globally.",
"PISA 2012 is assessed the competencies of 15-year-olds in mathematics, science and reading in 65 countries and around 510,000 students participated as a whole representing about 28 million globally.",
"PISA 2012 is assessed the competencies of 15-year-olds in mathematics, science and reading in 65 countries and around 510,000 students participated as a whole representing about 28 million globally.",
"PISA 2012 is assessed the competencies of 15-year-olds in mathematics, science and reading in 65 countries and around 510,000 students participated as a whole representing about 28 million globally.",
"PISA 2012 is assessed the competencies of 15-year-olds in mathematics, science and reading in 65 countries and around 510,000 students participated as a whole representing about 28 million globally."
];

var continentMap = {"America"              : 0,
                    "Asia"                 : 1,
                    "Europe"               : 2,
                    "Oceania"              : 3,
                    "Middle East & Africa" : 4};

var countrylists = {"China-Shanghai"        : "Asia",
                    "China-Hong Kong"       : "Asia",
                    "Singapore"             : "Asia",
                    "South Korea"           : "Asia",
                    "Japan"                 : "Asia",
                    "Taiwan"                : "Asia",
                    "Liechtenstein"         : "Europe",
                    "Estonia"               : "Europe",
                    "Poland"                : "Europe",
                    "China-Macao"           : "Asia",
                    "Czech Republic"        : "Europe",
                    "Vietnam"               : "Asia",
                    "Finland"               : "Europe",
                    "Ireland"               : "Europe",
                    "Belgium"               : "Europe",
                    "Netherlands"           : "Europe",
                    "Germany"               : "Europe",
                    "Canada"                : "America",
                    "New Zealand"           : "Oceania",
                    "Switzerland"           : "Europe",
                    "France"                : "Europe",
                    "Austria"               : "Europe",
                    "Australia"             : "Oceania",
                    "Latvia"                : "Europe",
                    "United Kingdom"        : "Europe",
                    "Spain"                 : "Europe",
                    "United States"         : "America",
                    "Italy"                 : "Europe",
                    "Norway"                : "Europe",
                    "Hungary"               : "Europe",
                    "Luxembourg"            : "Europe",
                    "Portugal"              : "Europe",
                    "Iceland"               : "Europe",
                    "Denmark"               : "Europe",
                    "Lithuania"             : "Europe",
                    "Sweden"                : "Europe",
                    "Russian Federation"    : "Europe",
                    "Croatia"               : "Europe",
                    "Slovenia"              : "Europe",
                    "Israel"                : "Middle East & Africa",
                    "Slovak Republic"       : "Europe",
                    "Greece"                : "Europe",
                    "Turkey"                : "Europe",
                    "Chile"                 : "America",
                    "Thailand"              : "Asia",
                    "Serbia"                : "Europe",
                    "Bulgaria"              : "Europe",
                    "Romania"               : "Europe",
                    "United Arab Emirates"  : "Middle East & Africa",
                    "Costa Rica"            : "America",
                    "Mexico"                : "America",
                    "Kazakhstan"            : "Asia",
                    "Malaysia"              : "Asia",
                    "Uruguay"               : "America",
                    "Montenegro"            : "Europe",
                    "Argentina"             : "America",
                    "Colombia"              : "America",
                    "Albania"               : "Europe",
                    "Tunisia"               : "Middle East & Africa",
                    "Jordan"                : "Middle East & Africa",
                    "Brazil"                : "America",
                    "Indonesia"             : "Asia",
                    "Qatar"                 : "Middle East & Africa",
                    "Peru"                  : "America"};


var dimensions = [
  {//0
    key: "Country",
    desc: "Country",
    type: types["String"]
  },
  {//1
    key: "Country BM",
    desc: "Country",
    type: types["String"]
  },
  {//2
    key: "Country BS",
    desc: "Country",
    type: types["String"]
  },
  {//3
    key: "Country BR",
    desc: "Country",
    type: types["String"]
  },
  {//4
    key: "Rank",
    desc: "Ranking",
    type: types["Rank"]
  },
  {//5
    key: "Average",
    desc: "Average Score",
    type: types["Number"]
  },
  {//6
    key: "BM",
    desc: "Math Score",
    type: types["Number"]
  },
  {//7
    key: "BS",
    desc: "Sciecne Score",
    type: types["Number"]
  },
  {//8
    key: "BR",
    desc: "Reading Score",
    type: types["Number"]
  },
  {//9
    key: "Math",
    desc: "Math Score",
    type: types["Number"]
  },
  {//10
    key: "Science",
    desc: "Science Score",
    type: types["Number"]
  },
  {//11
    key: "Reading",
    desc: "Reading Score",
    type: types["Number"]
  },
  {//12
    key: "GDP per capita",
    desc: "GDP per capita",
    type: types["Number"]
  },
  {//13
    key: "BM Sets Clear Goals",
    desc: "Sets Clear Goals",
    type: types["Number"]
  },
  {//14
    key: "BM Encourages Thinking",
    desc: "Encourages Thinking",
    type: types["Number"]
  },
  {//15
    key: "BM Summarizes Lessons",
    desc: "Summarizes Lessons",
    type: types["Number"]
  },
  {//16
    key: "BM Reflect Problems",
    desc: "Reflect Problems",
    type: types["Number"]
  },
  {//17
    key: "BM Wait Until its Quiet",
    desc: "Wait Until its Quiet",
    type: types["Number"]
  },
  {//18
    key: "BM HW Not Back in Time",
    desc: "Homework Not Back in Time",
    type: types["Number"]
  },
  {//19
    key: "BM Express Opinions",
    desc: "Opportunity to Express Opinions",
    type: types["Number"]
  },
  {//20
    key: "BM Teachers Are Interested",
    desc: "Teachers Are Interested",
    type: types["Number"]
  },
  {//21
    key: "BS Sets Clear Goals",
    desc: "Sets Clear Goals",
    type: types["Number"]
  },
  {//22
    key: "BS Encourages Thinking",
    desc: "Encourages Thinking",
    type: types["Number"]
  },
  {//23
    key: "BS Summarizes Lessons",
    desc: "Summarizes Lessons",
    type: types["Number"]
  },
  {//24
    key: "BS Reflect Problems",
    desc: "Reflect Problems",
    type: types["Number"]
  },
  {//25
    key: "BS Wait Until its Quiet",
    desc: "Wait Until its Quiet",
    type: types["Number"]
  },
  {//26
    key: "BS HW Not Back in Time",
    desc: "Homework Not Back in Time",
    type: types["Number"]
  },
  {//27
    key: "BS Express Opinions",
    desc: "Opportunity to Express Opinions",
    type: types["Number"]
  },
  {//28
    key: "BS Teachers Are Interested",
    desc: "Teachers Are Interested",
    type: types["Number"]
  },
  {//29
    key: "BR Sets Clear Goals",
    desc: "Sets Clear Goals",
    type: types["Number"]
  },
  {//30
    key: "BR Encourages Thinking",
    desc: "Encourages Thinking",
    type: types["Number"]
  },
  {//31
    key: "BR Summarizes Lessons",
    desc: "Summarizes Lessons",
    type: types["Number"]
  },
  {//32
    key: "BR Reflect Problems",
    desc: "Reflect Problems",
    type: types["Number"]
  },
  {//33
    key: "BR Wait Until its Quiet",
    desc: "Wait Until its Quiet",
    type: types["Number"]
  },
  {//34
    key: "BR HW Not Back in Time",
    desc: "Homework Not Back in Time",
    type: types["Number"]
  },
  {//35
    key: "BR Express Opinions",
    desc: "Opportunity to Express Opinions",
    type: types["Number"]
  },
  {//36
    key: "BR Teachers Are Interested",
    desc: "Teachers Are Interested",
    type: types["Number"]
  }];

var optionSelect = {
                      0 : [dimensions[0], dimensions[4], dimensions[9], dimensions[10], dimensions[11]],
                      1 : [dimensions[1], dimensions[4], dimensions[6], dimensions[13], dimensions[14], dimensions[15], dimensions[16], dimensions[19], dimensions[20]],
                      2 : [dimensions[2], dimensions[4], dimensions[7], dimensions[21], dimensions[22], dimensions[23], dimensions[24], dimensions[27], dimensions[28]],
                      3 : [dimensions[3], dimensions[4], dimensions[8], dimensions[29], dimensions[30], dimensions[31], dimensions[32], dimensions[35], dimensions[36]]
 }

var optionFlow = {
                  0 : optionSelect[0],
                  1 : optionSelect[1],
                  2 : optionSelect[2],
                  3 : optionSelect[3]
                };

var line = d3.svg.line()
                 .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
                  .orient("left");

//var svg = d3.select(".chart")
var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("#tooltip").classed("hidden", true);


// load the data
d3.csv("data/pisa.csv", function(error,data)
{
    updateChart();
    nevigationClick();
    // Update chart elements when axis variables change
    function updateChart()
    {
        switch (menuOption)
        {
            case 0:
                colNum = 5;
                break;
            case 1:
            case 2:
            case 3:
                colNum = 9;
                break;
                colNum = 5;
                break;
        };

        // falculate new width
        widthUpdate = binWidth * colNum;
        var x = d3.scale.ordinal()
                        .domain(optionFlow[menuOption].map(function(d) { return d.key; }))
                        .rangePoints([0, widthUpdate]);

        // clere previous plot beefore draw new one
        svg.selectAll("*").remove();

        var dimension = svg.selectAll(".dimension")
                           .data(optionFlow[menuOption])
                           .enter().append("g")
                           .attr("class", "dimension")
                           .attr("transform", function(d) { return "translate(" + x(d.key) + ")"; });

        data.forEach(function(d)
        {   // truncate values

            optionFlow[menuOption].forEach(function(p){

              d[p.key] = p.type.coerce(d[p.key]);
            });
        });

        drawLegend();

        // type/dimension default setting happens here
        optionFlow[menuOption].forEach(function(dim)
        {
            if (!("domain" in dim))
            {
                // detect domain using dimension type's extent function
                dim.domain = d3.functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));

                dim.domain.sort(function(a,b) {
                  return a - b;
                });
            }
            if (!("scale" in dim))
            {
              // use type's default scale for dimension
              dim.scale = dim.type.defaultScale.copy();
            }
            dim.scale.domain(dim.domain);
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
            .style('opacity',function(d){if(d.Rank == 65 )
                                              return 0;
                                            else
                                              return 1;})
            .style("stroke", function(d){return colorProfiles[continentMap[countrylists[d["Country"]]]]; })
            .attr("d", draw);

        dimension.append("g")
                  .attr("class", "axis")
                  .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
                  .append("text")
                  .attr("class", "title")
                  .attr("text-anchor", "begin")
                  .attr("y", -10)
                  .attr("transform", "translate(0,0) rotate(-30 -10 50)")
                  .text(function(d) { return "desc" in d ? d.desc : d.key; });

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
                projection.classed("inactive", function(p) { return p.key !== d; });
                projection.filter(function(p) { return p.key === d; }).each(moveToFront);
                ordinal_labels.classed("inactive", function(p) { return p !== d; });
                ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
            }
            else
            {
                projection.classed("inactive", function(p) { return p !== d; });
                projection.filter(function(p) { return p === d; }).each(moveToFront);
                ordinal_labels.classed("inactive", function(p) { return p !== d.key; });
                ordinal_labels.filter(function(p) { return p === d.key; }).each(moveToFront);
            }

            //Get the mouse x/y, then augment for the tooltip
            var coordinates = [0, 0];
                coordinates = d3.mouse(this);
            var xPosition   = coordinates[0] + 170;
            var yPosition   = coordinates[1] + 80;

            // Set boundary to display tool tip
            if((xPosition > 150) && (xPosition < 1260) && (yPosition < 700) && (yPosition > 80)){
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#country")
                .text(d["Country"]);


              d3.select("#tooltip #ms")
                .text("Math Score       : " + d["Math"]);
              d3.select("#tooltip #ss")
                .text("Science Score : " + d["Science"]);
              d3.select("#tooltip #rs")
                .text("Reading Score : " + d["Reading"]);
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



        function draw(d)
        {
            return line(optionFlow[menuOption].map(function(dimension)
            {
                return [x(dimension.key), dimension.scale(d[dimension.key])];
            }));
        }

        function drawLegend ()
        {
            var continentLegend = d3.scale.ordinal()
                                          .domain(["America", "Asia", "Europe", "Oceania", "ME & Africa"])
                                          .range(colorProfiles);
            svg.append("g")
               .attr("class", "legendOrdinal")
               //.attr("transform", "translate(300,400)");
               .attr("transform", "translate(" + (widthUpdate + 50) + "," + 250 + ")");

            var legendOrdinal = d3.legend.color()
              .shape("path", d3.svg.symbol().type("circle").size(400)())
              .orient('vertical')
              .shapePadding(10)
              .scale(continentLegend);

            svg.select(".legendOrdinal")
               .call(legendOrdinal);

            // legent description
            svg.append("g")
               .append('text')
               .attr('transform', 'translate(300, 400)')
               .attr("font-family", "sans-serif")
               .attr("font-size", "14px")
               .attr({'text-anchor': 'begin'})
               .attr("transform", "translate(" + (widthUpdate + 40) + "," + 225 + ")")
               .text('Continent');
        }
    }

    function nevigationClick()
    {
        // Control the prev button
        d3.select("#navigation #prev ").on("click", function()
        {

            if( menuOption > 0)
                menuOption -= 1;

            if( menuOption == 0)
            {
                d3.select("#navigation #prev")
                  .style('background-image', 'url("images/prev_light.png")')
            }
            if( menuOption < 3 )
            {
                d3.select("#navigation #next")
                  .style('background-image', 'url("images/next.png")')
            }
            navigation();
        });

        // Control the next button
        d3.select("#navigation #next").on("click", function()
        {
            if( menuOption < 3)
                menuOption += 1;

            if( menuOption == 3)
            {
                d3.select("#navigation #next")
                  .style('background-image', 'url("images/next_light.png")')
            }
            if( menuOption == 1)
            {
                d3.select("#navigation #prev")
                  .style('background-image', 'url("images/prev.png")')
            }
            navigation();
        });

        // Control the next button
        d3.select("#navigation #home").on("click", function()
        {
            menuOption = 0;
            d3.select("#navigation #next")
              .style('background-image', 'url("images/next.png")')

            d3.select("#navigation #prev")
              .style('background-image', 'url("images/prev_light.png")')
            navigation();
        });
    }

    // Change texts and axis for every step in navigation
    function navigation(d)
    {
        d3.select("#summary p")
          .text(summaryTopics[menuOption]);
        d3.select("summary-description p")
            .text(summaryDetails[menuOption]);
        //console.log("Navigation : " + menuOption);

        updateChart();
    }
});
















