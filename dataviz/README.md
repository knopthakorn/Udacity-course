# dataviz
data visualization project

Overview
PISA 2012 :  PISA is a survey of students' skills and knowledge as they approach the end of compulsory education. It is not a conventional school test. Rather than examining how well students have learned the school curriculum, it looks at how well prepared they are for life beyond school.
Around 510,000 students in 65 economies took part in the PISA 2012 assessment of reading, mathematics and science representing about 28 million 15-year-olds globally. Of those economies, 44 took part in an assessment of creative problem solving and 18 in an assessment of financial literacy.

#Summary : 
This visualization is consider to explore the students achievement based on teacher practices and attitudes.
My finding as    : Teacher with strong classroom management make higher student acheivement.
                 : Students from contries that their teacher had clear instruction make more acheivement.
                 : Student from the countries that teacher support on their homework also make more effective.

#Design: 
###Version 1 
               I decide to make one page summary for my finding, then I choose parallel coordinate plot to represent the data.
###Version 2 
              design base on parallel coordinate plot and separate finding topic by slide with add nevication icon to explore summary.
###Version 3 
              update base on feed back from @jasonicarter and @wambui and  milesbryony
              - change visultlization from parallel coordinate to scatter plot
              - x-axis represent finding topic
              - y-asis represent student achievement score
              - add introduction slide to show overall data
              - add customize slide to interact with audiance for selcet detail by countries.
              - add dinamic featue
###Version 4 : fix bug from version 3, because all code from version 3 is damage.
###Version 5 : updatebase on feed back from reviewer
            - add remark in first slide
            - add comment to explain the code in the js file
            - fixed the data of donut chart from countabkle data to propotional data
            - review the bar chart data it not the percentage

#Feedback:
###jasonicarter [12:51 AM]:
@nopthakorn: I'm starting this project now - just glanced at your (on mobile) and it seems a bit clutter with all of the countries being displayed at once. Could be cause it's on an iPhone but I'd suggest perhaps some type of dynamic feature where the user can select multiple countries to view and the graph changes accordingly.

####wambui [1:50 AM]:
@nopthakorn:  i agree with @jasonicarter . When all the countries are displayed at once, one is unable to get the story behind the visualization. I would also suggest a dynamic feature of not only countries but also regions or ranking  categories

###milesbryony:
I also admire the fact that you've tried to tackle the achievement focus. Personally I don't find it very easy to read anything from it. I suspect this might be the nature of the data rather than the visualisation choice?
As a matter of interest, here is my attempt: http://bl.ocks.org/BMPMS/raw/32cfa44714206cf7c79bb5d1e60657bc/5
It'll be interesting to see what the 2015 PISA data holds.

###Reviewer feedback
What is score?
include a comment about what these scores represent. It seems like they are on a scale from perhaps 0 to 100 and that a lower score is always better for all metrics, but the visualization didn't explicitly mention this. And the y-axis was probably average score for each country, right? The chart didn't mention if it was average, median, or something else. So the y-axis labels should probably say "Average Science Score", etc.
circle area encoding

the charts never mentioned what was being represented by bubble size. I thought it might be population until I noticed that Mexico and Italy were larger than the USA. I had to look at the code to figure out what the encoding was. Consider whether or not encoding to bubble size is important; in other words, does it add to the explanatory finding? If all of the points were the same size, that might alleviate some of the over plotting. At any rate, to meet specifications, the visualization should at least explain what the encoding is and ideally include a legend for bubble size so the reader has a sense of what range bubble size represents. Another option could be to put the value encoded to bubble size in the tooltip
Ring charts versus bar charts

I really like how the last slide lets the user explore the data set in more detail. I had some trouble understanding the ring charts on this slide. They didn't have clear chart titles, so the reader has to assume what is being represented (counts of male and female students tested? and number of schools participating?)

But more importantly, ring charts (or pie charts) are generally used to show fractions of a variable. In the ring chart on the left, it looks like two variables are being represented: number of students and number of schools:
I could see a ring chart being used to show the proportion of male to female students; however, putting the proportion of male/female and schools don't really go together. A bar chart would be more appropriate if all three were going to be shown on the same chart. Otherwise, there's an assumption that School / (School + Male + Female) has a clear meaning, which it doesn't really.

There's a similar issue with the ring chart on the right:
Screen Shot 2016-10-04 at 5.24.16 PM.png

A ring chart should be used to represent a proportion. For example, what would Reading / (Reading + Science + Average + Math) represent? A bar chart would also be a more intuitive encoding.

bar chart showing scores for each country

I just wanted to check that score really does represent a percent. From the scatterplots, it seemed like having a lower score was always better, so it seems like score doesn't really represent a percent. I just wanted to double check. If score isn't a percent, then the final bar chart on the last slide probably shouldn't say % on it.

#Reference:
http://bl.ocks.org/mostaphaRoudsari/b4e090bb50146d88aec4
http://bl.ocks.org/hlucasfranca/f133da4493553963e710
http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
http://bl.ocks.org/ABSegler/9791707
http://www.worldatlas.com/aatlas/ctycodes.htm
https://web.archive.org/web/20160207203252/https://github.com/markmarkoh/datamaps/blob/master/README.md#using-custom-maps
https://web.archive.org/web/20160123153243/https://github.com/mbostock/topojson/wiki/API-Reference
https://web.archive.org/web/20160123161844/https://github.com/mbostock/d3/wiki/Geo-Projections
https://github.com/d3/d3-geo/blob/master/README.md#geoProjection
https://www.sitepoint.com/getting-started-with-underscore-js/
http://www.worldatlas.com/aatlas/ctycodes.htm
https://web.archive.org/web/20160207203252/https://github.com/markmarkoh/datamaps/blob/master/README.md#using-custom-maps
https://web.archive.org/web/20160123153243/https://github.com/mbostock/topojson/wiki/API-Reference
https://web.archive.org/web/20160123161844/https://github.com/mbostock/d3/wiki/Geo-Projections
https://github.com/d3/d3-geo/blob/master/README.md#geoProjection
https://plot.ly/javascript/pie-charts/
http://jsfiddle.net/nrabinowitz/GQDUS/
http://jsfiddle.net/gregfedorov/qh9x5/9/
http://www.adeveloperdiary.com/d3-js/create-a-simple-donut-chart-using-d3-js/
http://zeroviscosity.com/d3-js-step-by-step/step-2-a-basic-donut-chart
https://github.com/zeroviscosity/d3-js-step-by-step/blob/master/step-2-a-basic-donut-chart.html
http://www.w3schools.com/jsref/jsref_tofixed.asp
