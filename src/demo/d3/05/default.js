/* UI */
fa_show = "\\2b";
fa_hide = "\\f068";

function newdata() {
  var n = [];
  var r = Math.ceil(Math.random() * 20);
  for (var i = 0; i < r; i++) {
    n.push({
      id: r,
      val: Math.random() * 10,
    });
  }
  return n;
}

var data = newdata();

// create table, etc.
var table = d3.select("#container").append("table");
var thead = table.append("thead");
var tbody = table.append("tbody");

// append the header row
thead
  .append("tr")
  .selectAll("th")
  .data(["id", "val", "svg"])
  .enter()
  .append("th")
  .text(function (col_names) {
    return col_names;
  });

/**
 *
 */
function update_table() {
  data = newdata();
  var rows = tbody.selectAll("tr").data(data);

  var rowsEnter = rows.enter().append("tr");

  rowsEnter
    .append("td")
    .attr("class", "idColumn")
    .text((d) => d.id);

  rowsEnter
    .append("td")
    .attr("class", "valColumn")
    .text((d) => d.val);

  var td = rowsEnter.append("td").attr("class", "col");

  td.append("svg")
    .attr("width", 20)
    .attr("height", 20)
    .append("circle")
    .attr("class", "svgCircle")
    .style("fill", "red");

  td.append("i").attr("class", "fa fa-plus");
  td.append("i").attr("class", "fa fa-minus");

  d3.selectAll(".svgCircle")
    .data(data)
    .attr("cx", 10)
    .attr("cy", 10)
    .transition()
    .duration(500)
    .attr("r", (d) => d.val)
    .style("fill", "red");

  rows.exit().remove();
}

update_table();

/**
 *
 */
var button = document.getElementById("update");
button.addEventListener("click", function (e) {
  update_table();
});
