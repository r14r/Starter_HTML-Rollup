import d3, { HierarchyNode, HierarchyPointLink, HierarchyPointNode } from "d3";
import { Parser, Person } from "./parser";
import { hierarchy, tree } from "d3-hierarchy";

export function parseData(data: any) {
  console.info(data);
}

export function parsePersonData(data: any) {
  console.info(data);
  const parser = new Parser(data);

  const personCellWidth = 200;
  const personCellHeight = 25;

  const treeLayoutBuilder = tree<Person>().nodeSize([
    personCellHeight,
    personCellWidth,
  ]);
  const rootPerson: HierarchyNode<Person> = hierarchy(parser.getRoot());
  const root = treeLayoutBuilder(rootPerson);

  const container = document.getElementById("container") as HTMLDivElement;
  container.innerHTML = "";
  const svg = d3.select("#container").append("svg");

  const [x0, x1] = getHorizontalBounds(root);
  const [y0, y1] = getVerticalBounds(root);

  const linkFn = d3
    .linkHorizontal<HierarchyPointLink<Person>, HierarchyPointNode<Person>>()
    .x((d) => d.y)
    .y((d) => d.x);

  const width = y1 - y0 + personCellWidth * 2;
  const height = x1 - x0 + personCellHeight * 4;

  svg.attr("viewBox", [0, 0, width, height].toString());
  const g = svg
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr(
      "transform",
      `translate(${personCellWidth}, ${-x0 + personCellHeight / 2})`
    );

  // draw links between nodes
  g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linkFn);

  const node = g
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("svg:image")
    .attr("width", 16)
    .attr("height", 16)
    .attr("x", -8)
    .attr("y", -8)
    .attr("xlink:href", "lib/assets/person.png");

  node
    .append("text")
    .attr("dy", "0.0em")
    .attr("x", (d) => (d.children ? -8 : 8))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr("stroke", "white");

  node
    .append("text")
    .attr("dy", "1.0em")
    .attr("x", (d) => (d.children ? -8 : 8))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .attr("fill", "#888")
    .text((d) => d.data.title)
    .clone(true)
    .lower()
    .attr("stroke", "white");
}

export function getHorizontalBounds(
  root: HierarchyPointNode<Person>
): [number, number] {
  let x0 = Infinity;
  let x1 = -Infinity;
  root.each((d) => {
    if (d.x > x1) {
      x1 = d.x;
    }
    if (d.x < x0) {
      x0 = d.x;
    }
  });
  return [x0, x1];
}

export function getVerticalBounds(
  root: HierarchyPointNode<Person>
): [number, number] {
  let y0 = Infinity;
  let y1 = -Infinity;
  root.each((d) => {
    if (d.y > y1) {
      y1 = d.y;
    }
    if (d.y < y0) {
      y0 = d.y;
    }
  });
  return [y0, y1];
}

export function drawTable() {
  console.group("drawTable");
  var headers = ["date", "price", "product"];
  var data = [
    ["2013-01-01", 45, "chair"],
    ["2013-02-01", 50, "desk"],
  ];

  /**/
  console.log("headers: ", headers);
  console.log("data:    ", data);

  var table = d3.select("div.root").append("table");
  var thead = table.append("thead");
  var tbody = table.append("tbody");

  // append the header row
  thead
    .append("tr")
    .selectAll("th")
    .data(headers)
    .enter()
    .append("th")
    .text((header) => {
      return <string>header;
    });

  var rows = tbody.selectAll("tr").data(data).enter().append("tr");

  // create a cell in each row for each column
  var cells = rows
    .selectAll("td")
    .data((row: any) => {
      return row.map((cell: any) => {
        return cell;
      });
    })
    .enter()
    .append("td")
    .text((d: any) => d);
}

export function drawNestedTable() {
  var source = [
    {
      name: "William",
      age: 40,
      children: [
        { name: "Billy", age: 10 },
        { name: "Charles", age: 12 },
      ],
    },
    { name: "Nancy", age: 35, children: [{ name: "Sally", age: 8 }] },
  ];

  var tableWidth = 500,
    tableHeight = 1000,
    barHeight = 40,
    barWidth = tableWidth * 1,
    duration = 300;

  var tableSvg = d3
    .select("div.root")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .classed("table-svg", true)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + tableWidth + " " + tableHeight);

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

  tableData.forEach((d: any) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  });

  updateTable(tableData);

  function updateTable(source: any) {
    console.log("----------");
    var x0 = 0,
      y0 = 0,
      barHeight = 20,
      padding = 1,
      shownChildren: any[] = [];

    source.forEach((d: any) => {
      d.x = x0;
      d.y = y0;
      var parentX = x0,
        parentY = y0;
      y0 += barHeight + padding;
      if (d.children) {
        d.children.forEach(function (data: any) {
          data.x = x0;
          data.y = y0;
          data.parentX = parentX;
          data.parentY = parentY;
          y0 += barHeight + padding;
          shownChildren.push(data);
        });
      } else if (d._children) {
        d._children.forEach(function (data: any) {
          data.x = parentX;
          data.y = parentY;
          data.parentX = parentX;
          data.parentY = parentY;
          shownChildren.push(data);
        });
      }
    });

    tableSvg
      .transition()
      .duration(duration)
      .attr("viewBox", "0 0 " + tableWidth + " " + y0);

    d3.select(self.frameElement)
      .transition()
      .duration(duration)
      .style("height", tableHeight + "px");

    console.log(shownChildren);
    var childRow = tableSvg.selectAll(".children").data(shownChildren);

    var childEnter = childRow
      .enter()
      .append("g")
      .attr("class", ":first-child")
      .classed("children", true)
      .attr("transform", (d: any) => {
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
      .text((d: any) => {
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
      .attr("transform", (d: any) => {
        console.log("Child Enter Transition: " + d.name + "," + d.y);
        return "translate(" + d.x + "," + d.y + ")";
      })
      .style("opacity", 1);

    childRow
      .transition()
      .duration(duration)
      .attr("transform", (d: any) => {
        console.log("Child Row Transition: " + d.name + "," + d.y);
        return "translate(" + d.x + "," + d.y + ")";
      })
      .style("opacity", 1)
      .select("rect")
      .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    /*childRow.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.parentX + "," + d.parentY + ")";
    })
    .style("opacity", 1e-6)
    .remove();*/

    var tableRow = tableSvg.selectAll(".tableRow").data(source);

    var rowEnter = tableRow
      .enter()
      .append("g")
      .classed("tableRow", true)
      .attr("transform", (d: any) => {
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
      .text((d: any) => {
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
      .attr("transform", (d: any) => {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .style("opacity", 1);

    tableRow
      .transition()
      .duration(duration)
      .attr("transform", (d: any) => {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .style("opacity", 1)
      .select("rect")
      .style("fill", color);

    function click(d: any) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      updateTable(source);
    }

    function color(d: any) {
      return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }
  }
}

export function drawMatrix() {
  var matrix = [
    [1, 2, 2, 4],
    [5, 5, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  var tr = d3
    .select("body")
    .append("table")
    .selectAll("tr")
    .data(matrix)
    .enter()
    .append("tr");

  var td = tr
    .selectAll("td")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("td")
    .text(function (d) {
      return d;
    });
}
