var json_data = ["one,two,three", "red,green,blue"];

var table = d3.select("#demo31").append("table");
var rows = table.selectAll("tr").data(json_data).enter().append("tr");
rows
  .selectAll("td")
  .data(function (d) {
    return d.split(",");
  })
  .enter()
  .append("td")
  .text(function (d) {
    return d;
  });

var json_data = [
  ["one", "two", "three"],
  ["red", "green", "blue"],
];
var table = d3.select("#demo32").append("table");
var rows = table.selectAll("tr").data(json_data).enter().append("tr");
rows
  .selectAll("td")
  .data(function (d) {
    return d;
  })
  .enter()
  .append("td")
  .text(function (d) {
    return d;
  });
