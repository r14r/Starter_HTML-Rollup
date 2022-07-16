var data = [
  {
    //   w  w w    .d  e  m  o    2  s.    c o m
    Year: 2014,
    Month: "Dec",
    Team: "T1",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Jan",
    Team: "T1",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Jan",
    Team: 'T2"',
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Feb",
    Team: "T1",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Feb",
    Team: 'T2"',
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Apr",
    Team: "T1",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Apr",
    Team: "T2",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Mar",
    Team: "T1",
    Sales: 123,
  },
  {
    Year: 2015,
    Month: "Mar",
    Team: "T2",
    Sales: 123,
  },
];
var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50,
  },
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;
//make a table
var table = d3
    .select("#container")
    .append("table")
    .attr("style", "margin-left: 250px")
    .attr("border", "1"),
  thead = table.append("thead"),
  tbody = table.append("tbody");
thead
  .append("tr")
  .selectAll("th")
  .data(["Year", "Month", "T1", "Sales"])
  .enter()
  .append("th")
  .text(function (column) {
    return column;
  });
//this will group my data into key:year and all its yearly data
var nested_data = d3
  .nest()
  .key(function (d) {
    return d.Year;
  })
  .entries(data);
nested_data.forEach(function (d) {
  var rowspan = d.values.length;
  d.values.forEach(function (val, index) {
    var tr = thead.append("tr");
    if (index == 0) {
      tr.append("td").attr("rowspan", rowspan).text(val.Year);
    }
    tr.append("td").text(val.Month);
    tr.append("td").text(val.Team);
    tr.append("td").text(val.Sales);
  });
});
