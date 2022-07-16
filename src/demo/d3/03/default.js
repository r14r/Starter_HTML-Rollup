/**
 *
 */
const color_level1 = "white";
const color_level2 = "lightgrey";

var tableWidth = 500,
  tableHeight = 1000,
  barHeight = 40,
  barWidth = tableWidth * 1,
  duration = 300;

var tableData = [
  {
    name: "William",
    age: 40,
    children: [
      {
        name: "Billy",
        age: 10,
      },
      {
        name: "Charles",
        age: 12,
      },
    ],
  },
  {
    name: "Nancy",
    age: 35,
    children: [
      {
        name: "Sally",
        age: 8,
      },
    ],
  },
];

console.log(tableData);
tableData.forEach((d) => {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
});
console.log(tableData);

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
