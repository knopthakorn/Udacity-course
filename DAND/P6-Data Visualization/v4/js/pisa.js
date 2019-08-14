// main topic for visulaize data
var findingTopics = [
   "What is PISA?",
   "Teacher Arrives Late.",
   "Teacher Sets Clear Goals.",
   "Teacher Summarizes Previous Lessons.",
   "Teacher Checks Understanding.",
   "Teacher Helps Students with Learning.",
   "Teacher Encourages to Reflect Problems.",
   "Homework Once a Week Not Back in Time.",
   "Summarize by country"
   ];

// explaination of the main topic
var findingSummary = [
  "PISA is a measure of 15-year-olds students' ability to use their reading, maths and science skills and knowledge to meet the real-life world.",
  "Teacher in the contries that strong management the class room make the  high acheivement students.",
  "Teacher-Directed Instruction, Sets Clear Goals to student for their stduying will make student more understanding.",
  "Teacher-Directed Instruction Teacher Summarizes Previous Lessons",
  "Teacher-Directed Instruction, Teacher Checks Understanding.",
  "Teacher Support - Helps Students with Learning.",
  "Cognitive Activation - Teacher Encourages student to Reflect Problems.",
  "Theacher in those countries that spend more supportfor homework yield more student acheivement.",
  "Choose by country."];

// x axis variable
var xAxisItems = ["Male",
                  "Female",
                  "School",
                  "ST84Q03",
                  "ST79Q01",
                  "ST79Q08",
                  "ST79Q06",
                  "ST83Q03",
                  "ST80Q01",
                  "ST82Q03"];

// y axis variable
var yAxisItems = ["PV1MATH", "PV1READ", "PV1SCIE"];

var descriptions = {"GDP":"GDP per capita",
                    "Age":"Average student age",
                    "Female":"Female student participant",
                    "Male":"Male student participant",
                    "School":"School participant",
                    "PV1MATH":"Math Score",
                    "PV1READ":"Reading Score",
                    "PV1SCIE":"Science Score",
                    "ST79Q01":"Teacher Sets Clear Goals",
                    "ST79Q02":"Teacher Encourages Thinking and Reasoning",
                    "ST79Q06":"Teacher Checks Understanding",
                    "ST79Q08":"Teacher Summarizes Previous Lessons",
                    "ST80Q01":"Teacher Encourages to Reflect Problems",
                    "ST81Q03":"Teacher Has to Wait Until its Quiet",
                    "ST82Q01":"Homework Every Other Day Back in Time",
                    "ST82Q02":"Homework Once a Week Back in Time",
                    "ST82Q03":"Homework Once a Week Not Back in Time",
                    "ST83Q01":"Lets Us Know We Have to Work Hard",
                    "ST83Q03":"Helps Students with Learning",
                    "ST83Q04":"Gives Opportunity to Express Opinions",
                    "ST84Q03":"Teacher Arrives Late",
                    };

var barPlotTitle = ["Arrives Late",
                    "Sets Clear Goals",
                    "Summarizes Previous Lessons",
                    "Checks Understanding",
                    "Helps Students with Learning",
                    "Encourages to Reflect Problems",
                    "Homework Not Back in Time"];

// color pattern
var colorFill = d3.scale.category10().domain(["America", "Asia", "Europe", "Middle East & Africa", "Oceania" ,"South America"]);

var barColorFill = d3.scale.category10().domain(barPlotTitle);

var scoreFill = d3.scale.category10().domain(["Average", "Math", "Science", "Reading"]);

var partyFill = d3.scale.category10().domain(["Male", "Femal", "School"]);

// data of participent by student count
var student = [{name :"America"             , total : 76154.0},
               {name :"Asia"                , total : 66350.0},
               {name :"Europe"              , total: 238765.0},
               {name :"Middle East & Africa", total: 38966.0},
               {name :"Oceania"             , total: 18772.0},
               {name :"South America"       , total: 46483.0}];

// data of participent by school count
var school = [{name :"America"              , total: 2937.0},
              {name :"Asia"                 , total : 2022.0},
              {name :"Europe"               , total: 8750.0},
              {name :"Middle East & Africa" , total: 1173.0},
              {name :"Oceania"              , total: 952.0},
              {name :"South America"        , total: 1832.0}];

// donut chart
var donutWidth = 200;
var donutHeight = 200;
var radius = Math.min(donutWidth, donutHeight) / 2;

// axis data.
var xAxis = 'STUDREL', yAxis = 'PV1MATH';

// axis boundary limit
var xAxisLimit, yAxisLimit;


// topic index
var topicIndex = 0;

// Navigation click control
var isHomeNaviagtionActive = 0;
var isPreNaviagtionActive  = 0;
var isNextNaviagtionActive = 1;
//////////

// read and format data from csv file
function parseData(d) {
  var keys = _.keys(d[0]);
  return _.map(d, function(d) {
    var o = {};
    _.each(keys, function(k) {
      if( k == 'Country')
        o[k] = d[k];
      else if( k == 'Continent')
          o[k] = d[k];
      else if( k == 'Female')
          o[k] = parseInt(d[k]);
      else if( k == 'Male')
          o[k] = parseInt(d[k]);
      else
          o[k] = parseFloat(d[k]);
      });
    return o;
  });
}


// get axis max and min
function getAxisLimit(d, paddingFactor) {
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;
  var keys = _.keys(d[0]), b = {};
  _.each(keys, function(k) {
    b[k] = {};
    _.each(d, function(d) {
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min)
        b[k].min = d[k];
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });
    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}


// update summary titale
function updateTopic(info) {

  d3.select("#finding p")
    .attr('font-size', '32px')
    .style('fill', '#110A03')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')
    .text(info);
}

function clearAllSVG() {

  d3.select("#info").select("svg").remove();
  d3.select("#info2").select("svg").remove();
  d3.select("#info3").select("svg").remove();
  d3.select("#plot1").select("svg").remove();
  d3.select("#plot2").select("svg").remove();
  d3.select("#plot3").select("svg").remove();
  d3.select("#cinfo").select("svg").remove();
  d3.select("#cplot1").select("svg").remove();
  d3.select("#cplot2").select("svg").remove();
  d3.select("#cplot3").select("svg").remove();
  d3.select("#intro").select("svg").remove();
  d3.select("#analyze").select("svg").remove();
  d3.select("#customize").select("svg").remove();
//  d3.select("#countrylist").selectAll("*").remove();

}

// Change texts and axis for every step in navigation
function plotData(d)
{
  var xAxisSelect = 'ST84Q03';

  updateTopic(findingTopics[topicIndex]);

  d3.select("#findingSummary p").text(findingSummary[topicIndex]);

  if(topicIndex == 0)
  {
    clearAllSVG();
    d3.select("#intro").classed("hidden", false);
    d3.select("#analyze").classed("hidden", true);
    d3.select("#customize").classed("hidden", true);
    d3.select("#countrylist").classed("hidden", true);
    d3.select("#scoreaxis").classed("hidden", true);


    introductionView();
  }
  else if (topicIndex == 8)
  {
    clearAllSVG();
    d3.select("#intro").classed("hidden", true);
    d3.select("#analyze").classed("hidden", true);
    d3.select("#customize").classed("hidden", false);
    d3.select("#countrylist").classed("hidden", false);
    d3.select("#scoreaxis").classed("hidden", true);
    d3.select("#intro").classed("hidden", true);

    summaryByCountry();

  }
  else
  {
    clearAllSVG();
    d3.select("#analyze").classed("hidden", false);
    d3.select("#intro").classed("hidden", true);
    d3.select("#customize").classed("hidden", true);
    d3.select("#countrylist").classed("hidden", true);
    d3.select("#scoreaxis").classed("hidden", false);

    switch(topicIndex) {
      case 1:
            xAxisSelect = 'ST84Q03';
            break;
        case 2:
            xAxisSelect = 'ST79Q01';
            break;
        case 3:
            xAxisSelect = 'ST79Q08';
            break;
        case 4:
            xAxisSelect = 'ST79Q06';
            break;
        case 5:
            xAxisSelect = 'ST83Q03';
            break;
        case 6:
            xAxisSelect = 'ST80Q01';
            break;
        case 7:
            xAxisSelect = 'ST82Q03';
            break;
      }

      xAxis = xAxisSelect;
      pisaSummaryView();
  }

}

function makeWorldMap (tag, tx, ty, info) {
  // plot world map
  var map = new Datamap({
                  element         : document.getElementById('plot3'),
                  scope           : 'world',
                  //geographyConfig : { highlightOnHover: false },
                  setProjection   : function(element, options) {
                                      var projection, path;
                                      projection = d3.geo.mercator()
                                                         .scale(element.offsetWidth-350)
                                                         .translate([280, element.offsetHeight / 2]);

                                      path = d3.geo.path().projection( projection );

                                      return {path: path, projection: projection}; },
                  fills           : { defaultFill        : "#E6E6E6",
                                      America            : colorFill("America"),
                                      Asia               : colorFill("Asia"),
                                      Europe             : colorFill("Europe"),
                                      Oceania            : colorFill("Oceania"),
                                      Middle_East_Africa : colorFill("Middle East & Africa"),
                                      South_America      : colorFill("South America")},
                                      data: { CHN  : { fillKey:  "Asia" },
                                              HKG  : { fillKey:  "Asia" },
                                              SGP  : { fillKey:  "Asia" },
                                              KOR  : { fillKey:  "Asia" },
                                              JPN  : { fillKey:  "Asia" },
                                              TWN  : { fillKey:  "Asia" },
                                              LIE  : { fillKey:  "Europe" },
                                              EST  : { fillKey:  "Europe" },
                                              POL  : { fillKey:  "Europe" },
                                              MAC  : { fillKey:  "Asia" },
                                              CZE  : { fillKey:  "Europe" },
                                              VNM  : { fillKey:  "Asia" },
                                              FIN  : { fillKey:  "Europe" },
                                              IRL  : { fillKey:  "Europe" },
                                              BEL  : { fillKey:  "Europe" },
                                              NLD  : { fillKey:  "Europe" },
                                              DEU  : { fillKey:  "Europe" },
                                              CAN  : { fillKey:  "America" },
                                              NZL  : { fillKey:  "Oceania" },
                                              CHE  : { fillKey:  "Europe" },
                                              FRA  : { fillKey:  "Europe" },
                                              AUT  : { fillKey:  "Europe" },
                                              AUS  : { fillKey:  "Oceania" },
                                              LVA  : { fillKey:  "Europe" },
                                              GBR  : { fillKey:  "Europe" },
                                              ESP  : { fillKey:  "Europe" },
                                              USA  : { fillKey:  "America" },
                                              ITA  : { fillKey:  "Europe" },
                                              NOR  : { fillKey:  "Europe" },
                                              HUN  : { fillKey:  "Europe" },
                                              LUX  : { fillKey:  "Europe" },
                                              PRT  : { fillKey:  "Europe" },
                                              ISL  : { fillKey:  "Europe" },
                                              DNK  : { fillKey:  "Europe" },
                                              LTU  : { fillKey:  "Europe" },
                                              SWE  : { fillKey:  "Europe" },
                                              RUS  : { fillKey:  "Europe" },
                                              HRV  : { fillKey:  "Europe" },
                                              SVN  : { fillKey:  "Europe" },
                                              ISR  : { fillKey:  "Middle_East_Africa" },
                                              SVK  : { fillKey:  "Europe" },
                                              GRC  : { fillKey:  "Europe" },
                                              TUR  : { fillKey:  "Europe" },
                                              CHL  : { fillKey:  "South_America" },
                                              THA  : { fillKey:  "Asia" },
                                              SRB  : { fillKey:  "Europe" },
                                              BGR  : { fillKey:  "Europe" },
                                              ROU  : { fillKey:  "Europe" },
                                              ARE  : { fillKey:  "Middle_East_Africa" },
                                              CRI  : { fillKey:  "America" },
                                              MEX  : { fillKey:  "America" },
                                              KAZ  : { fillKey:  "Asia" },
                                              MYS  : { fillKey:  "Asia" },
                                              URY  : { fillKey:  "South_America" },
                                              MNE  : { fillKey:  "Europe" },
                                              ARG  : { fillKey:  "South_America" },
                                              COL  : { fillKey:  "South_America" },
                                              ALB  : { fillKey:  "Europe" },
                                              TUN  : { fillKey:  "Middle_East_Africa" },
                                              JOR  : { fillKey:  "Middle_East_Africa" },
                                              BRA  : { fillKey:  "South_America" },
                                              IDN  : { fillKey:  "Asia" },
                                              QAT  : { fillKey:  "Middle_East_Africa" },
                                              PER  : { fillKey:  "South_America"}}
                });

  // set description text
  var svg = d3.select(".datamap")
      svg.append('g')
         .append('text')
         .attr('font-size', '16px')
         .style('fill', '#888')
         .attr('text-anchor', 'start')
         .attr("transform", "translate(" +tx+ ","+ty +")")
         .text(info);
};


function setAxis(axid, orent, lim, tx, ty) {
  //console.log("setAxis call...");

  d3.select('svg g.analyze')
    .append("g")
    .attr("transform", "translate(" +tx+ ","+ty +")")
    .attr('id', axid)
    .call(d3.svg.axis()
    .scale(lim)
    .tickSize(3, 0)
    .ticks(9)
    .orient(orent));
};

function setAxisLabel (axid, align, label, tx, ty, rt) {

  //console.log("setAxisLabel " + label + " call...");

  d3.select('svg g.analyze')
    .append('text')
    .attr("transform", "translate("+tx+ ","+ty+")rotate("+rt+")")
    .attr({'id': axid, 'text-anchor': align})
    .text(label);
};

function setupAxisLimit (ax) {
    switch (ax)
    {
      case "Male":
      case "Female":
      case "School":
        xAxisLimit = d3.scale.linear().domain([bounds[xAxis].min+10, bounds[xAxis].max+10]).range([1, 600]);
        break;
      default:
        xAxisLimit = d3.scale.linear().domain([30, 100]).range([1, 600]);
    }
    //xAxisLimit = d3.scale.linear().domain([30, bounds[xAxis].max+10]).range([1, 600]);
    yAxisLimit = d3.scale.linear().domain([300, 650]).range([700, 300]);
};

function setLegend (svg, info, sx, sy, tx, ty) {

  //console.log('Setup legend ' + info);
  var linear = d3.legend.color().shapeWidth(30)
                                .orient('vertical')
                                .shape("path", d3.svg.symbol().type("circle").size(400)())
                                .shapePadding(10)
                                .labelOffset(10)
                                .scale(colorFill);
    svg.append("g")
       .attr("class", "linear")
       .attr("transform", "translate(" +sx+ ","+sy +")")
       .call(linear);

    d3.select('svg g.analyze')
      .append('text')
      .attr({'text-anchor': 'middle', 'font-weight': 'bold'})
      .attr("transform", "translate(" +tx+ ","+ty +")")
      .text(info);
};

function makeBubblePlot(data, sx, sy) {

  //console.log('makeBubblePlot call...');
  var stroke_width = 0;

  d3.select('svg g.analyze')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("transform", "translate(" +sx+ ","+sy+")")
    .attr("id", function (d) { return d.Country.replace(/ /g,''); })
    .attr('cx', function(d) { return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xAxisLimit(d[xAxis]); })
    .attr('cy', function(d) {return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yAxisLimit(d[yAxis]); })
    .attr('r', function(d) {return Math.sqrt((d.Female+d.Male)/63.8);})
    //.attr('fill', function(d, i) {return colorFill(countryMap[d.Country]);})
    .attr('fill', function(d, i) {return colorFill(d.Continent);})
    .style("fill-opacity", 0.8)
    .style('cursor', 'pointer')

    // Mouse in set stroke
    .on('mouseenter', setStroke)
    // Mouse out sreet stroke
    .on('mouseout',resetStroke)
    // Mouse clike
    //.on('click', selectBubble)
    // Mouse move show tooltip
    .on('mousemove', showTooltip);
};

function selectBubble (d) {
  if(d3.select(this).attr('stroke-width')  == 50) {
        d3.select(this)
          .transition()
          .style("stroke-opacity", 1)
          .attr("stroke-width", 0);
      }
      else {
        d3.select('svg g.chart')
          .selectAll('circle')
          .transition()
          .style("stroke-opacity", 1)
          .attr("stroke-width", 0);

        d3.select(this)
          .transition()
          .style("stroke-opacity", 0.3)
          .attr("stroke-width", 50);
        }
}

function setStroke (d) {
  d3.select(this)
    .transition()
    .attr("stroke", "#333")
    .attr("stroke-width", 2);

  //Hide the tooltip
  d3.select("#tooltip").classed("hidden", false);
}

function resetStroke (d) {
  d3.select(this)
    .transition()
    .attr("stroke", "#888")
    .attr("stroke-width", 0)

  //Hide the tooltip
  d3.select("#tooltip").classed("hidden", true);
}

function showTooltip (d) {
  var coordinates = [0, 0];
      coordinates = d3.mouse(this);

      var xPosition = coordinates[0] + 150;
      var yPosition = coordinates[1] - 250;

      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#country")
        .text(d.Country + " (" + d.Continent + ")");
      d3.select("#tooltip #y")
        .text(descriptions[yAxis] + ": " + d[yAxis]);
      d3.select("#tooltip #x")
        .text(descriptions[xAxis] + ": " + d[xAxis]);

      //Show the tooltip
      d3.select("#tooltip")
        .classed("hidden", false);
};

function updateInfo(textInfo) {
  var svg = d3.select("#customize #cinfo")
              .append("svg")
              .attr("width", 900)
              .attr("height", 100);

      svg.append('g')
         .append('text')
         .attr('font-size', '28px')
         .style('fill', '#888')
         .attr({'text-anchor': 'start', 'font-weight': 'bold'})
         .attr('transform', 'translate(200, 70)')
         .text(textInfo);
}

function makeBarPlot(barData, textInfo) {

    var grid = d3.range(10).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':250};
    });

    var tickVals = grid.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    //xAxisLimit = d3.scale.linear().domain([30, 100]).range([1, 600]);
    var xscale = d3.scale.linear().domain([1,100]).range([0,380]);

    var yscale = d3.scale.linear().domain([0,barPlotTitle.length]).range([0,250]);

    var svg = d3.select("#customize  #cplot3")
                .append("svg")
                .attr("width", 800)
                .attr("height", 400)
                .attr('transform', 'translate(250, 10)');

    var xAxis = d3.svg.axis()
                      .orient('bottom')
                      .scale(xscale)
                      .tickSize(1)
                      .tickValues(tickVals);

    var yAxis = d3.svg.axis()
                      .orient('left')
                      .scale(yscale)
                      .tickSize(1)
                      .tickFormat(function(d,i){ return barPlotTitle[i]; });

    var y_xis = svg.append('g')
                   .attr("transform", "translate(100, 20)")
                   .attr('id','yaxis')
                   .call(yAxis);

    var x_xis = svg.append('g')
                   .attr("transform", "translate(100, 270)")
                   .attr('id','xaxis')
                   .call(xAxis);

    var chart = svg.append('g')
              .attr("transform", "translate(100, 0)")
              .attr('id','bars')
              .selectAll('rect')
              .data(barData)
              .enter()
              .append('rect')
              .attr('height',18)
              .attr({'x':0,'y':function(d,i){ return yscale(i)+15; }})
              .style('fill',function(d,i){ return barColorFill(i); })
              .attr('width',function(d){ return 0; });


    var transit = d3.select("svg").selectAll("rect")
                .data(barData)
                .transition()
                .duration(200)
                .attr("width", function(d) {return xscale(d); });

    var transitext = d3.select('#bars')
              .selectAll('text')
              .data(barData)
              .enter()
              .append('text')
              .attr({'x':function(d) {return xscale(d)-100; },'y':function(d,i){ return yscale(i)+27; }})
              .text(function(d){ return d+"%"; })
              .style({'fill':'#fff','font-size':'12px'});

    var svg = d3.select("#customize #cinfo")
              .append("svg")
              .attr("width", 800)
              .attr("height", 100);

      svg.append('g')
         .append('text')
         .attr('font-size', '28px')
         .style('fill', '#888')
         .attr({'text-anchor': 'start', 'font-weight': 'bold'})
         .attr('transform', 'translate(200, 70)')
         .text(textInfo);

};

function makeDonutTitle (tag, info, tx, ty) {
    // plot student
  var svg=d3.select(tag)
            .append("svg")
            .attr("width", 500)
            .attr("height", 50);

      svg.append('g')
         .append('text')
         .attr('font-size', '16px')
         .style('fill', '#888')
         .attr('text-anchor', 'start')
         .attr("transform", "translate(" +tx+ ","+ty +")")
         .text(info);
}

// create donut plot
function makeDonutChart (tag, fact, w, h, tx, ty, fc, lg) {

    var pie=d3.layout.pie().value(function(d){return d.total}).sort(null);

    var outerRadius=w/2-5;
    var innerRadius=w/3-5;



    var arc=d3.svg.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);


    var svg=d3.select(tag)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append('g')
            .attr('transform', 'translate('+(w/2)+','+(h/2)+')');


    var path=svg.selectAll('path')
            .data(pie(fact))
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill',function(d,i){ return fc(d.data.name);});

    path.transition()
            .duration(10)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) { return arc(interpolate(t));};});

    var text=svg.selectAll('text')
                .data(pie(fact))
                .enter()
                .append("text")
                .transition()
                .duration(10)
                .attr("transform", function (d) {return "translate(" + arc.centroid(d) + ")";})
                .attr("dy", ".4em")
                .attr("text-anchor", "middle")
                .text(function(d){return d.data.total;})
                .style('font-size','10px')
                .style('fill','#fff');

    if(lg == 1)
    {
        var legendRectSize=15;
        var legendSpacing=5;
        var legendHeight=legendRectSize+legendSpacing;


        var legend=svg.selectAll('.legend')
                .data(fc.domain())
                .enter()
                .append('g')
                .attr({class:'legend',transform:function(d,i){
                        return 'translate(-30,' + ((i*legendHeight)-35) + ')';}});

        legend.append('rect')
                .attr({
                    width:legendRectSize,
                    height:legendRectSize,
                    rx:20,
                    ry:20
                })
                .style({
                    fill:fc,
                    stroke:fc
                });

        legend.append('text')
                .attr({
                    x:20,
                    y:15
                })
                .text(function(d){return d;
                }).style({
                    fill:'#929DAF',
                    'font-size':'12px'
                });
    }
};



function introductionView()
{

  //init navigation icon
  d3.select("#navigation #next")
          .style('background-image', 'url("images/next.png")')
  d3.select("#navigation #prev")
          .style('background-image', 'url("images/prev_light.png")')
  d3.select("#navigation #home")
        .style('background-image', 'url("images/home_light.png")')

  // Set summary message
  d3.select("#findingSummary p").text(findingSummary[topicIndex])
  updateTopic(findingTopics[topicIndex]);

  // set summary message
  var svg = d3.select("#info")
                .append("svg")
                .attr("width", 300)
                .attr("height", 200);

      svg.append('g')
         .append('text')
         .attr('font-size', '28px')
         //.style('fill', '#110A03')
         .style('fill', '#888')
         .attr({'text-anchor': 'start', 'font-weight': 'bold'})
         .attr('transform', 'translate(10, 100)')
         .text('PISA 2012');

      svg.append('g')
         .append('text')
         .attr('font-size', '28px')
         .style('fill', '#888')
         .attr({'text-anchor': 'start', 'font-weight': 'bold'})
         .attr('transform', 'translate(10, 130)')
         .text('participants');

  // plot student

  makeDonutTitle ("#intro #info2", "Around 510,000 students globally", 200, 20);
  makeDonutTitle ("#intro #info3", "Around 20,000 school globally", 40, 20 );


  makeDonutChart ("#intro #plot1", student, 195, 195,-50, 100, colorFill, 0);
  makeDonutChart ("#intro #plot2", school, 195, 195,-50, 100, colorFill, 0);
  // plot world map
  makeWorldMap (plot3, 500, 120, "65 countries and economies");
}


function pisaSummaryView()
{
  //d3.csv('data/pisa2012_v2.csv', function(data) {
  d3.csv('data/pisa2012_v2.csv', function(error, data) {
    if (error) throw error;


    // Create svg
    var svg = d3.select("#analyze")
                .append("svg")
                .attr("width", 900)
                .attr("height", 700);

    svg.append('g')
       .classed('analyze', true)
       .attr('transform', 'translate(80, -150)');

    // Get keys, data and bounds from file
    var keys = _.keys(data[0]);
    var data = parseData(data);
    var bounds = getAxisLimit(data, 1);



    // Setup the range of the plot ***********************************************************
    setupAxisLimit(xAxis);

    // make bubble plot ***********************************************************
    makeBubblePlot(data, 10, -100);

    // Setup Axis ***********************************************************
    setAxis('xAxis', "bottom", xAxisLimit, 10, 600);
    setAxis('yAxis', "left", yAxisLimit, 10, -100);

    // Setup Label ***********************************************************
    setAxisLabel ('xLabel', 'middle', descriptions[xAxis], 300, 650, 0);
    setAxisLabel ('yLabel', 'middle', descriptions[yAxis], -40, 390, -90);

    // Setup legend ***********************************************************
    //var svg = d3.select("svg");
    setLegend (svg, 'Continent', 760, 150, 700, 280);

  });

};


function summaryByCountry()
{
  d3.csv('data/pisa2012_v2.csv', function(error, data) {
    if (error) throw error;

    // get overall data
    clearAllSVG();

    var color = d3.scale.category10();

    var overalTeacher = [Math.round(d3.sum(data.map(function(d){ return d.ST84Q03}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST79Q01}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST79Q08}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST79Q06}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST83Q03}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST80Q01}))/64),
                         Math.round(d3.sum(data.map(function(d){ return d.ST82Q03}))/64)]


    var overallMath    = Math.round(d3.sum(data.map(function(d){ return d.PV1MATH}))/64);
    var overallScience = Math.round(d3.sum(data.map(function(d){ return d.PV1READ}))/64);
    var overallReading = Math.round(d3.sum(data.map(function(d){ return d.PV1SCIE}))/64);
    var overallScore   = Math.round((overallMath +  overallScience + overallReading)/3);

    var acheivement = [{name :"Average" , total: overallScore},
                       {name :"Math" , total : overallMath},
                       {name :"Science" , total: overallScience},
                       {name :"Reading", total: overallReading}];

    var cntMale   = Math.round(d3.sum(data.map(function(d){ return d.Male})));
    var cntFemale = Math.round(d3.sum(data.map(function(d){ return d.Female})));
    var cntSchool = Math.round(d3.sum(data.map(function(d){ return d.School})));

    var cntParty = [{name :"Male"   , total : cntMale},
                    {name :"Femal"  , total : cntFemale},
                    {name :"School" , total : cntSchool}];

    var keys = _.keys(data[0]);
    var data = parseData(data);
    var bounds = getAxisLimit(data, 1);


    // create dropdown list
    d3.select("#countrylist #list").selectAll("select").remove();
    var dropDown = d3.select("#countrylist #list")
                     .append("select")
                     .attr("name", "list");

    var countries = dropDown.selectAll("option")
                          .data(data)
                          .enter()
                          .append("option")
                          .text(function (d) { return d.Country; }).attr("value", function (d) { return d.Country; });

    //updateInfo("Global teacher practices and attitudes");
    makeBarPlot(overalTeacher, "Global teacher practices and attitudes");
    makeDonutChart ("#customize #cplot1", cntParty, 195, 195,-50, 100, partyFill, 1);
    makeDonutChart ("#customize #cplot2", acheivement, 195, 195,-50, 100, scoreFill, 1);

    d3.select('select').on("change", function() {
      // Get select country
      key = this.selectedIndex;
      var selectItem = data[key];
      // clear all svg
      clearAllSVG();

      var textInfo = selectItem.Country + " teacher practices and attitudes";

      var bplotData = [Math.round((selectItem.ST84Q03 *100.01)/100),
                     Math.round((selectItem.ST79Q01 *100.01)/100),
                     Math.round((selectItem.ST79Q08 *100.01)/100),
                     Math.round((selectItem.ST79Q06 *100.01)/100),
                     Math.round((selectItem.ST83Q03 *100.01)/100),
                     Math.round((selectItem.ST80Q01 *100.01)/100),
                     Math.round((selectItem.ST82Q03 *100.01)/100)];

      var cntMath    = Math.round((selectItem.PV1MATH *100.01)/100);
      var cntScience = Math.round((selectItem.PV1SCIE *100.01)/100);
      var cntReading = Math.round((selectItem.PV1READ *100.01)/100);
      var cntAverage = Math.round((cntMath +  cntScience + cntReading)/3);

      var cntTeacher = [{name :"Average"  , total : cntAverage},
                        {name :"Math"     , total : cntMath},
                        {name :"Science"  , total : cntScience},
                        {name :"Reading"  , total : cntReading}];

      cntMale   = Math.round((selectItem.Male *100.01)/100);
      cntFemale = Math.round((selectItem.Female *100.01)/100);
      cntSchool = Math.round((selectItem.School *100.01)/100);

      cntParty = [{name :"Male"   , total : cntMale},
                  {name :"Femal"  , total : cntFemale},
                  {name :"School" , total : cntSchool}];

      makeBarPlot(bplotData, textInfo);

      makeDonutChart ("#customize #cplot1", cntParty, 195, 195,-50, 100, partyFill, 1);
      makeDonutChart ("#customize #cplot2", cntTeacher, 195, 195,-50, 100, scoreFill, 1);

    });

  });
}


// start dender
introductionView();
//updateAxisLabel();

// Control the prev button
d3.select("#navigation #prev ").on("click", function() {
  if(isPreNaviagtionActive == 1) {
    if( topicIndex > 0) {
        topicIndex -= 1;
        isHomeNaviagtionActive = 1;
        isNextNaviagtionActive = 1;
    }

    if( topicIndex == 0) {
      d3.select("#navigation #prev")
        .style('background-image', 'url("images/prev_light.png")')

      d3.select("#navigation #home")
        .style('background-image', 'url("images/home_light.png")')

      isPreNaviagtionActive  = 0;
      isHomeNaviagtionActive = 0;
    }

    if( topicIndex == 7 ) {
        d3.select("#navigation #next")
          .style('background-image', 'url("images/next.png")')
    }
    plotData();
  }
});

// Control the next button
d3.select("#navigation #next").on("click", function() {
  if(isNextNaviagtionActive == 1) {
    if( topicIndex < 8) {
        topicIndex += 1;
        isHomeNaviagtionActive = 1;
        isPreNaviagtionActive  = 1;
    }

    if( topicIndex == 8) {
        d3.select("#navigation #next")
          .style('background-image', 'url("images/next_light.png")')
        d3.select("#navigation #prev")
          .style('background-image', 'url("images/prev.png")')
        d3.select("#navigation #home")
        .style('background-image', 'url("images/home.png")')

        isNextNaviagtionActive = 0;
        isHomeNaviagtionActive = 1;
        isPreNaviagtionActive  = 1;
    }

    if( topicIndex == 1) {
        d3.select("#navigation #prev")
          .style('background-image', 'url("images/prev.png")')

        d3.select("#navigation #home")
        .style('background-image', 'url("images/home.png")')
    }
    plotData();
  }
});

// Control the next button
d3.select("#navigation #home").on("click", function() {

  //disable activity if current page is home
  if(isHomeNaviagtionActive == 1) {
    topicIndex = 0;
    d3.select("#navigation #next")
      .style('background-image', 'url("images/next.png")');

    d3.select("#navigation #prev")
      .style('background-image', 'url("images/prev_light.png")');

    d3.select("#navigation #home")
        .style('background-image', 'url("images/home_light.png")')

    plotData();

    // reset
    isHomeNaviagtionActive = 0;
    isPreNaviagtionActive  = 0;
    isNextNaviagtionActive = 1;
  }
});

// Set y axis menu
d3.select('#yaxisitems')
  .selectAll('li')
  .data(yAxisItems)
  .enter()
  .append('li')
  .text(function(d) {return descriptions[d];})
  .classed('selected', function(d) {return d === yAxis;})
  .on('click', function(d) {
      yAxis = d;
      updateYAxis();
  });

// Update menus
function updateYAxis() {
  d3.select('#yaxisitems')
    .selectAll('li')
    .classed('selected', function(d) {
    return d === yAxis;
  });
  plotData();
};
