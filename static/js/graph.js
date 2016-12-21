queue()
    .defer(d3.json, "/donorsUS/projects")
    .defer(d3.json, "/static/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

    //Clean projectsJson data
    var donorsUSProjects = projectsJson;
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    donorsUSProjects.forEach(function (d) {
        d["date_posted"] = dateFormat.parse(d["date_posted"]);
        d["date_posted"].setDate(1);
        d["total_donations"] = +d["total_donations"];
    });


    // Crossfilter instance
    var ndx = crossfilter(donorsUSProjects);

    //Defined Dimensions
    var dateDim = ndx.dimension(function (d) {
        return d["date_posted"];
    });
    var resourceTypeDim = ndx.dimension(function (d) {
        return d["resource_type"];
    });
    var povertyLevelDim = ndx.dimension(function (d) {
        return d["poverty_level"];
    });
    var stateDim = ndx.dimension(function (d) {
        return d["school_state"];
    });
    var totalDonationsDim = ndx.dimension(function (d) {
        return d["total_donations"];
    });

    var fundingStatus = ndx.dimension(function (d) {
        return d["funding_status"];
    });



    //Calculating metrics
    var numProjectsByDate = dateDim.group();
    var numProjectsByResourceType = resourceTypeDim.group();
    var numProjectsByPovertyLevel = povertyLevelDim.group();
    var numProjectsByFundingStatus = fundingStatus.group();
    var totalDonationsByState = stateDim.group().reduceSum(function (d) {
        return d["total_donations"];
    });
    var stateGroup = stateDim.group();

    var all = ndx.groupAll();
    var totalDonations = ndx.groupAll().reduceSum(function (d) {
        return d["total_donations"];
    });
fundingStatusmap
    var max_state = totalDonationsByState.top(1)[0].value;

    //Defining values (used in charts)
    var minDate = dateDim.bottom(1)[0]["date_posted"];
    var maxDate = dateDim.top(1)[0]["date_posted"];

    //Charts
    var timeChart = dc.barChart("#time-chart");
    var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
    var numberProjectsND = dc.numberDisplay("#number-projects-nd");
    var totalDonationsND = dc.numberDisplay("#total-donations-nd");
    var fundingStatusChart = dc.pieChart("#funding-chart");
    var fundingStatusmap = dc.geoChoroplethChart("#funding-map");
    var chart1 = dc.scatterPlot("#test1");
    var chart2 = dc.scatterPlot("#test2");

    selectField = dc.selectMenu('#menu-select')
        .dimension(stateDim)
        .group(stateGroup);


    numberProjectsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    totalDonationsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(totalDonations)
        .formatNumber(d3.format(".3s"));

    timeChart
        .width(1200)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dateDim)
        .group(numProjectsByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    resourceTypeChart
        .width(300)
        .height(250)
        .dimension(resourceTypeDim)
        .group(numProjectsByResourceType)
        .xAxis().ticks(4);

    povertyLevelChart
        .width(300)
        .height(250)
        .dimension(povertyLevelDim)
        .group(numProjectsByPovertyLevel)
        .xAxis().ticks(4);

    fundingStatusChart
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(fundingStatus)
        .group(numProjectsByFundingStatus);

    fundingStatusmap.width(500)
        .height(330)
        .dimension(stateDim)
        .group(totalDonationsByState)
        .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#7C151D"])
        .colorDomain([0, max_state])
        .overlayGeoJson(statesJson["features"], "state", function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.albersUsa()
            .scale(600)
            .translate([340, 150]))
        .title(function (p) {
            return "State: " + p["key"]
                + "\n"
                + "Total Donations: " + Math.round(p["value"]) + " $";
        });
      // Scaterplot input data and graph
    var data2 = "x,y,z\n" +
        "1,1,3\n" +
        "5,2,11\n" +
        "13,13,13\n" +
        "5,3,20\n" +
        "12,12,10\n" +
        "3,6,8\n" +
        "15,2,9\n" +
        "8,6,14\n" +
        "1,4,9\n" +
        "8,8,12\n" +
        "11,7,4\n" +
        "4,2,10\n" +
        "7,6,3\n" +
        "6,1,2\n" +
        "8,13,8\n" +
        "4,4,4\n" +
        "9,2,7\n" +
        "8,1,1\n" +
        "4,13,1\n" +
        "7,4,1\n" +
        "8,8,8\n" +
        "3,2,1\n" +
        "2,3,11\n" +
        "12,8,4\n" +
        "20,11,6\n";
    var data1 = d3.csv.parse(data1);
    data1.forEach(function (x) {
        x.x = +x.x;
        x.y = +x.y;
        x.z = +x.z;
    });
    var ndx1 = crossfilter(data1),
        dim1 = ndx1.dimension(function (d) {
            return [+d.x, +d.y];
        }),
        dim2 = ndx1.dimension(function (d) {
            return [+d.y, +d.z];
        }),
        group1 = dim1.group(),
        group2 = dim2.group();
    chart1.width(300)
        .height(300)
        .x(d3.scale.linear().domain([0, 20]))
        .yAxisLabel("y")
        .xAxisLabel("x")
        .clipPadding(10)
        .dimension(dim1)
        // .excludedOpacity(0.5)
        .group(group1);
    chart2.width(300)
        .height(300)
        .x(d3.scale.linear().domain([0, 20]))
        .yAxisLabel("z")
        .xAxisLabel("y")
        .clipPadding(10)
        .dimension(dim2)
        // .excludedColor('#ddd')
        .group(group2);

    dc.renderAll();
}