var testData = [
  //   w   w  w . d   e m    o2  s  .   c o  m
  ["a", "a", "a", "a"],
  ["b", "b", "b", "b"],
  ["c", "c", "c", "c"],
  ["d", "d", "d", "d"],
];
// set up the table
var table = d3.select("#container").append("table");
thead = table.append("thead").append("tr");
tbody = table.append("tbody");
// first create the table rows (3 needed)
var tr = tbody
  .selectAll("tr")
  .data(
    testData.filter(function (d, i) {
      if (i > 0) {
        // don't need the first row
        return d;
      }
    })
  )
  .enter()
  .append("tr");
// Now create the table cells
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
