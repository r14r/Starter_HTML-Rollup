var data = [
  { Date: "12/15/2015", Value: 5165, Rate: "1.25%", Type: "CD" },
  { Date: "05/01/2016", Value: 2523, Rate: "9.54%", Type: "CD" },
  { Date: "08/12/2016", Value: 4435, Rate: "21.25%", Type: "CD" },
  { Date: "03/11/2017", Value: 1234, Rate: "7.25%", Type: "Ladder" },
  { Date: "01/14/2018", Value: 6546, Rate: "1.3%", Type: "Ladder" },
  { Date: "02/15/2018", Value: 7234, Rate: "7.25%", Type: "Savings Goal" },
  { Date: "03/11/2019", Value: 4534, Rate: "7.25%", Type: "Savings Goal" },
];

var totalValue = 0;
for (var i = 0; i < data.length; i++) totalValue += data[i].Value; //  w  w   w   .  d e m  o    2s    .c   o   m
width = 670; // Changes pie size as a whole
height = 326; // Changes pie size as a whole
radius = 150;

var color = d3.scale.category20();
var arc = d3.svg
  .arc() //Size of donut chart
  .outerRadius(radius)
  .innerRadius(80); //Changes width of the slices of the pie

var arcOver = d3.svg
  .arc() // Size of donut chart when hovering
  .outerRadius(radius + 5)
  .innerRadius(85);

var svg = d3
  .select("#demo4")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + 335 + "," + radius * 1.1 + ")");
div = d3.select("body").append("div").attr("class", "tooltip");
var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return d.Value;
  });
var g = svg
  .selectAll(".arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc")
  .on("mousemove", function (d) {
    var mouseVal = d3.mouse(this);
    div.style("display", "none");
    div
      .html(
        "Date:" +
          d.data.Date +
          "</br>" +
          "Value:" +
          d.data.Value +
          "</br>" +
          "Rate:" +
          d.data.Rate +
          "</br>" +
          "Type:" +
          d.data.Type
      )
      .style("left", d3.event.pageX + 12 + "px")
      .style("top", d3.event.pageY - 10 + "px")
      .style("opacity", 1)
      .style("display", "block");
  })
  .on("mouseover", function (d) {
    d3.select(this)
      .select("path")
      .transition()
      .duration(100)
      .attr("d", arcOver);
  })
  .on("mouseout", function (d) {
    div.html(" ").style("display", "none");
    d3.select(this).select("path").transition().duration(100).attr("d", arc);
  });
svg
  .append("text")
  .attr("text-anchor", "middle")
  .text("$" + totalValue);
var paths = g
  .append("path")
  .attr("d", arc)
  .attr("data-legend", function (d) {
    return d.data.name;
  })
  .style("fill", function (d) {
    if (d.data.Type == "CD") {
      return "blue";
    } else if (d.data.Type == "Ladder") {
      return "green";
    } else if (d.data.Type == "Savings Goal") {
      return "red";
    }
  });
var keys = ["Date", "Value", "Rate", "Type"];
d3.select("#testtable")
  .append("tr")
  .selectAll(".head")
  .data(keys)
  .enter()
  .append("th")
  .attr("class", "head")
  .text(function (d) {
    return d;
  });
d3.select("#testtable")
  .selectAll(".dataRow")
  .data(data)
  .enter()
  .append("tr")
  .attr("class", "dataRow")
  .on("mouseover", function (d, i) {
    d3.select(this).style("background-color", "red");
    var path = paths[0][i];
    d3.select(path).transition().duration(100).attr("d", arcOver);
  })
  .on("mouseout", function (d, i) {
    d3.select(this).style("background-color", "transparent");
    var path = paths[0][i];
    d3.select(path).transition().duration(100).attr("d", arc);
  });
d3.selectAll("#testtable .dataRow")
  .selectAll("td")
  .data(function (row) {
    return keys.map(function (d) {
      return { value: row[d] };
    });
  })
  .enter()
  .append("td")
  .html(function (d) {
    return d.value;
  });

/**
 *
 *
 */
var target = d3
  .select("#container")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .classed("table-svg", true)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + tableWidth + " " + tableHeight);

updateTable(tableData);

/**
 *
 */
function updateTable(source) {
  var x0 = 0,
    y0 = 0,
    barHeight = 20,
    padding = 1,
    shownChildren = [];

  source.forEach(function (d) {
    d.x = x0;
    d.y = y0;

    var parentX = x0;
    var parentY = y0;

    y0 += barHeight + padding;

    if (d.children) {
      d.children.forEach(function (data) {
        data.x = x0;
        data.y = y0;
        data.parentX = parentX;
        data.parentY = parentY;
        y0 += barHeight + padding;

        shownChildren.push(data);
      });
    } else if (d._children) {
      d._children.forEach(function (data) {
        data.x = parentX;
        data.y = parentY;
        data.parentX = parentX;
        data.parentY = parentY;

        shownChildren.push(data);
      });
    }
  });

  target
    .transition()
    .duration(duration)
    .attr("viewBox", "0 0 " + tableWidth + " " + y0);

  d3.select(self.frameElement)
    .transition()
    .duration(duration)
    .style("height", tableHeight + "px");

  var childRow = target.selectAll(".children").data(shownChildren);
  var childEnter = childRow
    .enter()
    .append("g", ":first-child")
    .classed("children", true)
    .attr("transform", function (d) {
      console.log("Child Enter: " + d.name + "," + d.y);
      return "translate(" + d.parentX + "," + d.parentY + ")";
    });

  var childRect = childEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color);

  var childText = childEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .text(function (d) {
      console.log("Child Name: " + d.name + "," + d.y);
      if (d.name.length > 70) {
        return d.name.substring(0, 67) + "...";
      } else {
        return d.name;
      }
    });
  // Transition nodes to their new position.
  childEnter
    .transition()
    .duration(duration)
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .style("opacity", 1);

  childRow
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  childRow
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.parentX + "," + d.parentY + ")";
    })
    .style("opacity", 1e-6)
    .remove();

  var tableRow = target.selectAll(".tableRow").data(source);
  var rowEnter = tableRow
    .enter()
    .append("g")
    .classed("tableRow", true)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  var rowRect = rowEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color)
    .on("click", click);

  var rowText = rowEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .text(function (d) {
      if (d.name.length > 70) {
        return d.name.substring(0, 67) + "...";
      } else {
        return d.name;
      }
    })
    .on("click", click);

  rowEnter
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);

  tableRow
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    updateTable(source);
  }

  function color(d) {
    return d._children ? "#3182bd" : d.children ? color_level1 : color_level2;
  }
}
