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

var findingSummary = [
  "PISA is a measure of 15-year-olds students' ability to use their reading, maths and science skills and knowledge to meet the real-life world.",
  "Theacher in those countries of Asia, Ocenai and  almost of Europe are rarely late the classroom.",
  "Theacher in those countries of Asia an mostly Europe are mostly strong to make clear goals to their student.",
  "Almost teacher form most countires are somtime make summarizes previous lessons to thir student",
  "Theacher in those countries of Middle East & Africa and South America somtime they rarely to checks understanding for their student.",
  "Teachers in those countries of Europe rarely help the students to learn as much as they should.",
  "Theacher in those countries of Middle East & Africa and South America sometime or often to not encourages student to reflect problems.",
  "Theacher in those countries of Asia an mostly Europe are rarely taken not back in time for homework",
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

// variable explaination mapping
var descriptions = {"GDP":"GDP per capita",
                    "Female":"Female student participant",
                    "Male":"Male student participant",
                    "School":"School participant",
                    "PV1MATH":"Math Score",
                    "PV1READ":"Reading Score",
                    "PV1SCIE":"Science Score",
                    "ST79Q01":"Teacher Sets Clear Goals",
                    "ST79Q06":"Teacher Checks Understanding",
                    "ST79Q08":"Teacher Summarizes Previous Lessons",
                    "ST80Q01":"Teacher Encourages to Reflect Problems",
                    "ST82Q03":"Homework Once a Week Not Back in Time",
                    "ST83Q03":"Helps Students with Learning",
                    "ST84Q03":"Teacher Arrives Late"};

// horizontal bar chart title
var barChartTitle = ["Arrives Late",
                    "Sets Clear Goals",
                    "Summarizes Previous Lessons",
                    "Checks Understanding",
                    "Helps Students with Learning",
                    "Encourages to Reflect Problems",
                    "Homework Not Back in Time"];

// color pattern for continent
var continentFill = d3.scale.category10().domain(["America", "Asia", "Europe", "Middle East & Africa", "Oceania" ,"South America"]);

// color pattern for bar plot
var barColorFill = d3.scale.category10().domain(barChartTitle);

// color pattern for donut plot
//var scoreFill = d3.scale.category10().domain(["Average", "Math", "Science", "Reading"]);
var scoreFill = d3.scale.category10().domain(["Math", "Science", "Reading"]);

// color pattern for donut plot
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

// axis data.
var xAxis = 'STUDREL', yAxis = 'PV1MATH';

// axis boundary limit
var xAxisLimit, yAxisLimit;

// topic index
var topicIndex = 0;

// Navigation control
var isHomeNaviagtionActive = 0;
var isPreNaviagtionActive  = 0;
var isNextNaviagtionActive = 1;

// read and format data from csv file
/*
   param :
*/
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
/*
   param :
          padding     : weight factor
*/
function getAxisLimit(d, padding) {
  padding = typeof padding !== 'undefined' ? padding : 1;
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
    b[k].max > 0 ? b[k].max *= padding : b[k].max /= padding;
    b[k].min > 0 ? b[k].min /= padding : b[k].min *= padding;
  });
  return b;
}

// update summary title
/*
   param :
          info     : text to update
*/
function updateTopic(info) {

  d3.select("#finding p")
    .attr('font-size', '32px')
    .style('fill', '#110A03')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')
    .text(info);
}

// update summary title
/*
   param :
*/
function clearAllSVG() {
  d3.select("#info").select("svg").remove();
  d3.select("#info2").select("svg").remove();
  d3.select("#info3").select("svg").remove();
  d3.select("#plot1").select("svg").remove();
  d3.select("#plot2").select("svg").remove();
  d3.select("#plot3").select("svg").remove();
  d3.select("#cinfo1").select("svg").remove();
  d3.select("#cinfo2").select("svg").remove();
  d3.select("#cinfo3").select("svg").remove();
  d3.select("#cplot1").select("svg").remove();
  d3.select("#cplot2").select("svg").remove();
  d3.select("#cplot3").select("svg").remove();
  d3.select("#intro").select("svg").remove();
  d3.select("#analyze").select("svg").remove();
  d3.select("#customize").select("svg").remove();
}

// control indext of finding topic
/*
   param :
*/
function topicsControl(d)
{
  var xAxisSelect = 'ST84Q03';

  updateTopic(findingTopics[topicIndex]);

  d3.select("#findingSummary p").text(findingSummary[topicIndex]);

  // fist index show overiew
  if(topicIndex == 0){
    clearAllSVG();
    d3.select("#intro").classed("hidden", false);
    d3.select("#analyze").classed("hidden", true);
    d3.select("#customize").classed("hidden", true);
    d3.select("#countrylist").classed("hidden", true);
    d3.select("#scoreaxis").classed("hidden", true);
    d3.select("#remark").classed("hidden", false);
    introductionView();
  }
  // last index, user select by contry
  else if (topicIndex == 8){
    clearAllSVG();
    d3.select("#intro").classed("hidden", true);
    d3.select("#analyze").classed("hidden", true);
    d3.select("#customize").classed("hidden", false);
    d3.select("#countrylist").classed("hidden", false);
    d3.select("#scoreaxis").classed("hidden", true);
    d3.select("#intro").classed("hidden", true);
    d3.select("#remark").classed("hidden", true);

    summaryByCountry();
  }

  // othervise show by topic
  else{
    clearAllSVG();
    d3.select("#analyze").classed("hidden", false);
    d3.select("#intro").classed("hidden", true);
    d3.select("#customize").classed("hidden", true);
    d3.select("#countrylist").classed("hidden", true);
    d3.select("#scoreaxis").classed("hidden", false);
    d3.select("#remark").classed("hidden", true);

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

// build world map chart
/*
   param :
          tag     : #element
          tx      : x position of plot title
          ty      : y position of plot title
          info    : text to represent plot title
*/
function makeWorldMap (tag, tx, ty, info) {

  var map = new Datamap({
                  element         : document.getElementById('plot3'),
                  scope           : 'world',
                  setProjection   : function(element, options) {
                                      var projection, path;
                                      projection = d3.geo.mercator()
                                                         .scale(element.offsetWidth-350)
                                                         .translate([280, element.offsetHeight / 2]);

                                      path = d3.geo.path().projection( projection );

                                      return {path: path, projection: projection}; },
                  fills           : { defaultFill        : "#E6E6E6",
                                      America            : continentFill("America"),
                                      Asia               : continentFill("Asia"),
                                      Europe             : continentFill("Europe"),
                                      Oceania            : continentFill("Oceania"),
                                      Middle_East_Africa : continentFill("Middle East & Africa"),
                                      South_America      : continentFill("South America")},
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

// x axis layout for buble chart
/*
   param :
          axid    : #element
          orent   : axis label orentation in degree
          lim     : axis boundary
          tx      : x position
          ty      : y position

*/
function setAxis(axid, orent, lim, tx, ty) {
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

// x axis lable
/*
   param :
          axid    : #element
          align   : alighment location for text
          label   : text lablel
          tx      : x position
          ty      : y position
          rt      : rotation in degree
*/
function setAxisLabel (axid, align, label, tx, ty, rt) {
  d3.select('svg g.analyze')
    .append('text')
    .attr("transform", "translate("+tx+ ","+ty+")rotate("+rt+")")
    .attr({'id': axid, 'text-anchor': align})
    .text("Average " + label);
};

// set axis boundary
/*
   param :
          limit     : axis limit
*/
function setupAxisLimit (limit) {
    xAxisLimit = d3.scale.linear().domain([limit[xAxis].min-5, limit[xAxis].max+5]).range([10, 600]);
    yAxisLimit = d3.scale.linear().domain([1, 650]).range([700, 300]);
};

// y axis variable select
/*
   param :
*/
function updateYAxis() {
  d3.select('#yaxisitems')
    .selectAll('li')
    .classed('selected', function(d) {
    return d === yAxis;
  });
  topicsControl();
};

// build legend represent by continent
/*
   param :
          svg     : #element
          info    : text represent legend lable
          or      : orentation, hoeizontal or vertical
          sc      : scale profile
          sx      : circle fill x position
          sy      : circle fill y position
          tx      : legend text x position
          ty      : legend text y position
*/
function setLegend (svg, info, or, sc, sx, sy, tx, ty) {

  var linear = d3.legend.color().shapeWidth(30)
                                .orient(or)
                                .shape("path", d3.svg.symbol().type("circle").size(400)())
                                .shapePadding(10)
                                .labelOffset(10)
                                .scale(sc);
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

// build legend represent the size of bubble
/*
   param :
          svg     : #element
          info    : text represent legend lable
          or      : orentation, hoeizontal or vertical
          sc      : scale profile
          sx      : circle fill x position
          sy      : circle fill y position
          tx      : legend text x position
          ty      : legend text y position
*/
function setLegendSize (svg, info, or, sx, sy, tx, ty) {

  var linearSize = d3.scale.linear().domain([2,  150]).range([4, 12]);

  var legendSize = d3.legend.size()
                            .scale(linearSize)
                            .shape('circle')
                            .shapePadding(10)
                            .labelOffset(10)
                            .orient(or)
                            .labels(["<30K$", "30-60K$", "60-90K$", "90-120k$", "120-150K$"]);


  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(" +sx+ ","+sy +")")
    .attr("fill", "#888")
    .call(legendSize);

  d3.select('svg g.analyze')
    .append('text')
    .attr("transform", "translate(" +tx+ ","+ty +")")
    .attr({'text-anchor': 'middle', 'font-weight': 'bold'})
    .text(info);


};


// build bubble plot, size of buble depend on gdp divide by 100
/*
   param :
          data    : data to plot
          sx      : circle fill x position
          sy      : circle fill y position
*/
function makeBubblePlot(data, sx, sy) {
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
    //.attr('r', function(d) {return Math.sqrt(((d.PV1MATH + d.PV1SCIE + d.PV1READ)/3)/3.14);})
    .attr('r', function(d) {return Math.sqrt(d.GDP);})
    .attr('fill', function(d, i) {return continentFill(d.Continent);})
    .style("fill-opacity", 0.8)
    .style('cursor', 'pointer')

    // Mouse in set stroke
    .on('mouseenter', setStroke)
    // Mouse out sreet stroke
    .on('mouseout',resetStroke)
    // Mouse move show tooltip
    .on('mousemove', showTooltip);
};

// fill circumference when mouse over
/*
   param :
*/
function setStroke (d) {
  d3.select(this)
    .transition()
    .attr("stroke", "#333")
    .attr("stroke-width", 2);

  //Hide the tooltip
  d3.select("#tooltip").classed("hidden", false);
}

// remove circumference when mouse out
/*
   param :
*/
function resetStroke (d) {
  d3.select(this)
    .transition()
    .attr("stroke", "#888")
    .attr("stroke-width", 0)

  //Hide the tooltip
  d3.select("#tooltip").classed("hidden", true);
}

// update tooltip when mouse over
/*
   param :
*/
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
      d3.select("#tooltip #w")
        .text(descriptions["GDP"] + ": " + d.GDP + "K$");
      d3.select("#tooltip #y")
        .text(descriptions[yAxis] + ": " + d[yAxis].toFixed(2));
      d3.select("#tooltip #x")
        .text(descriptions[xAxis] + ": " + d[xAxis].toFixed(2));


      //Show the tooltip
      d3.select("#tooltip")
        .classed("hidden", false);
};

// build the bar chart
/*
   param :
          barData  : data to build bar chart
          textInfo : bar chart title
*/
function makeBarChart(barData, textInfo) {

    // x axis tick interval
    var xTick = d3.range(10).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':250};
    });

    // x axis tick label
    var xTickLabel = xTick.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    // x axis scale
    var xscale = d3.scale.linear().domain([1,100]).range([0,380]);

    // x axis scale
    var yscale = d3.scale.linear().domain([0,barChartTitle.length]).range([0,250]);

    var svg = d3.select("#customize  #cplot3")
                .append("svg")
                .attr("width", 800)
                .attr("height", 400)
                .attr('transform', 'translate(250, 10)');

    var xAxis = d3.svg.axis()
                      .orient('bottom')
                      .scale(xscale)
                      .tickSize(1)
                      .tickValues(xTickLabel);

    var yAxis = d3.svg.axis()
                      .orient('left')
                      .scale(yscale)
                      .tickSize(1)
                      .tickFormat(function(d,i){ return barChartTitle[i]; });

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
              .text(function(d){ return d; })
              .style({'fill':'#fff','font-size':'12px'});

    // set chart title
    var svg = d3.select("#customize #cinfo3")
              .append("svg")
              .attr("width", 800)
              .attr("height", 100);

      svg.append('g')
         .append('text')
         .attr('font-size', '16px')
         .style('fill', '#888')
         .attr('text-anchor', 'middle')
         .attr('transform', 'translate(500, 50)')
         .text(textInfo);

};

// build donut chart title
/*
   param :
          tag     : #element
          info    : title text
          tx      : x position
          ty      : y position
*/
function makeDonutTitle (tag, info, tx, ty) {
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

// create text plot
/*
   param :
          tag     : #element
          alig    : text align
          textx   : text to add in chart
*/
function makeTextChart (tag, alig, text1, text2, text3, text4, text5, text6) {

    var svg=d3.select(tag)
            .append("svg")
            .attr("width", 400)
            .attr("height", 400)
            .attr('transform', 'translate(-5, 0)');


      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '20px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 20)')
         .text(text1);

      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '20px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 50)')
         .text(text2);

      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '20px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 80)')
         .text(text3);

      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '26px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 120)')
         .text(text4);

      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '26px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 160)')
         .text(text5);

      svg.append('g')
         .append('text')
         .attr('font-weight', 'bold')
         .attr('font-size', '26px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 200)')
         .text(text6);

      svg.append('g')
         .append('text')
         .attr('font-size', '12px')
         .attr('text-anchor', alig)
         .style('fill', '#888')
         .attr('transform', 'translate(5, 220)')
         .text("*all score in average value.");
};

// create donut plot
/*
   param :
          tag     : #element
          dataset : data to plot
          w       : dount width
          h       : dount height
          fc      : color pattern to fill
          lg      : legen option, 1 if add legen to chart, otherwise exclude legen
*/
function makeDonutChart (tag, dataset, w, h, fc, lg) {

    // construct donut laout
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
            .data(pie(dataset))
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
                .data(pie(dataset))
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

    // add legend to donut if enable
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

 // execute overall of pisa test
function introductionView()
{
  //set navigation icon
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

  // plot student and school
  makeDonutTitle ("#intro #info2", "Around 510,000 students globally", 200, 20);
  makeDonutTitle ("#intro #info3", "Around 20,000 school globally", 40, 20 );
  makeDonutChart ("#intro #plot1", student, 195, 195, continentFill, 0);
  makeDonutChart ("#intro #plot2", school, 195, 195, continentFill, 0);
  // plot world map
  makeWorldMap (plot3, 500, 120, "65 countries and economies");

  // show remark
  d3.select("#remark").classed("hidden", false);
}

// execute summary for finding topic
function pisaSummaryView()
{
  // hide remark
  d3.select("#remark").classed("hidden", true);
  d3.csv('data/pisa2012_v3.csv', function(error, data) {
    if (error) throw error;

    // Create svg
    var svg = d3.select("#analyze")
                .append("svg")
                .attr("width", 1000)
                .attr("height", 700);

    svg.append('g')
       .classed('analyze', true)
       .attr('transform', 'translate(100, -150)');

    // Get keys, data and bounds from file
    var keys = _.keys(data[0]);
    var data = parseData(data);
    var bounds = getAxisLimit(data, 1);

    // Setup the range of the plot
    setupAxisLimit(bounds);

    // make bubble plot
    makeBubblePlot(data, -5, -100);

    // Setup Axis
    setAxis('xAxis', "bottom", xAxisLimit, 5, 600);
    setAxis('yAxis', "left", yAxisLimit, 10, -100);

    // Setup Label
    setAxisLabel ('xLabel', 'middle', descriptions[xAxis], 300, 650, 0);
    setAxisLabel ('yLabel', 'middle', descriptions[yAxis], -40, 390, -90);

    // Setup legend
    setLegend (svg, 'Continent', 'vertical', continentFill, 730, 150, 650, 280);

    // setup legend size
    setLegendSize (svg, 'GDP per Capita', 'vertical', 900, 150, 830, 280);

  });

};

// execute customize view when user select country name from dropdown list
function summaryByCountry()
{
  d3.csv('data/pisa2012_v3.csv', function(error, data) {
    if (error) throw error;

    // get overall data
    clearAllSVG();

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

    var color = d3.scale.category10();

    // set bar chart value
    var barDataset = [(d3.sum(data.map(function(d){ return d.ST84Q03}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST79Q01}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST79Q08}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST79Q06}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST83Q03}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST80Q01}))/64).toFixed(2),
                      (d3.sum(data.map(function(d){ return d.ST82Q03}))/64).toFixed(2)]

    // globale max score
    var maxMath    = d3.max(data.map(function(d){ return d.PV1MATH}));
    var maxScience = d3.max(data.map(function(d){ return d.PV1READ}));
    var maxReading = d3.max(data.map(function(d){ return d.PV1SCIE}));

    // get average score
    var averageMath    = (d3.sum(data.map(function(d){ return d.PV1MATH}))/64);
    var averageScience = (d3.sum(data.map(function(d){ return d.PV1READ}))/64);
    var averageReading = (d3.sum(data.map(function(d){ return d.PV1SCIE}))/64);

    // get raio of studen score
    var ratioMath    =  ((averageMath/maxMath)*100).toFixed(2);
    var ratioScience =  ((averageScience/maxScience)*100).toFixed(2);
    var ratioReading =  ((averageReading/maxReading)*100).toFixed(2);

    // set raio of studen score
    var ratioScore = [{name :"Math"    , total: ratioMath},
                    {name :"Science" , total: ratioScience},
                    {name :"Reading" , total: ratioReading}];

    // get participant value
    var partyMale   = d3.sum(data.map(function(d){ return d.Male}));
    var partyFemale = d3.sum(data.map(function(d){ return d.Female}));
    var partySchool = d3.sum(data.map(function(d){ return d.School}));

    var maleParticipant      = partyMale + " of males";
    var femaleParticipant    = partyFemale + " of female";
    var schoolParticipant    = partySchool + " of school";
    var mathScoreTextInfo    = "*Mathematic : " + averageMath.toFixed(2);
    var scienceScoreTextInfo = "*Sciecnce : " + averageScience.toFixed(2);
    var readingScoreTextInfo = "*Reading : " + averageReading.toFixed(2);

    // make bar plot
    makeBarChart(barDataset, "Teacher practices and attitudes");

    // make test info plot
    makeTextChart("#customize #cplot1",
                  'begin',
                  maleParticipant,
                  maleParticipant,
                  schoolParticipant,
                  mathScoreTextInfo,
                  scienceScoreTextInfo,
                  readingScoreTextInfo);
    // make donut plot
    makeDonutChart ("#customize #cplot2", ratioScore, 195, 195, scoreFill, 1);
    makeDonutTitle ("#customize #cinfo1", "PISA 2012 Result", 50, 40);
    makeDonutTitle ("#customize #cinfo2", "Global student achievement", 0, 40);

    // enable dropdonw menu action
    d3.select('select').on("change", function() {
      // Get select country
      key = this.selectedIndex;
      var selectItem = data[key];
      // clear all svg
      clearAllSVG();

      var textInfo = selectItem.Country + " teacher practices and attitudes";

      // set bar chart value
      barDataset = [ selectItem.ST84Q03.toFixed(2),
                     selectItem.ST79Q01.toFixed(2),
                     selectItem.ST79Q08.toFixed(2),
                     selectItem.ST79Q06.toFixed(2),
                     selectItem.ST83Q03.toFixed(2),
                     selectItem.ST80Q01.toFixed(2),
                     selectItem.ST82Q03.toFixed(2)];

      // get test score
      averageMath    = selectItem.PV1MATH;
      averageScience = selectItem.PV1SCIE;
      averageReading = selectItem.PV1READ;

      // get raio of studen score
      ratioMath    =  ((averageMath/maxMath)*100).toFixed(2);
      ratioScience =  ((averageScience/maxScience)*100).toFixed(2);
      ratioReading =  ((averageReading/maxReading)*100).toFixed(2);

      // set raio of studen score
      ratioScore = [{name :"Math"    , total: ratioMath},
                    {name :"Science" , total: ratioScience},
                    {name :"Reading" , total: ratioReading}];

      // get participant value
      partyMale   = selectItem.Male;
      partyFemale = selectItem.Female;
      partySchool = selectItem.School;

      maleParticipant      = partyMale + " of males";
      femaleParticipant    = partyFemale + " of female";
      schoolParticipant    = partySchool + " of school";
      mathScoreTextInfo    = "*Mathematic : " + averageMath.toFixed(2);
      scienceScoreTextInfo = "*Sciecnce : " + averageScience.toFixed(2);
      readingScoreTextInfo = "*Reading : " + averageReading.toFixed(2);

      makeBarChart(barDataset, textInfo);

      makeTextChart("#customize #cplot1",
                  'begin',
                  maleParticipant,
                  maleParticipant,
                  schoolParticipant,
                  mathScoreTextInfo,
                  scienceScoreTextInfo,
                  readingScoreTextInfo);

      makeDonutChart ("#customize #cplot2", ratioScore, 195, 195, scoreFill, 1);
      makeDonutTitle ("#customize #cinfo1", "PISA 2012 Result", 50, 40);
      makeDonutTitle ("#customize #cinfo2", "Student achievement compare with global", 0, 40);

    });

  });
}


// start dender
introductionView();

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
    topicsControl();
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
    topicsControl();
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

    topicsControl();

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
