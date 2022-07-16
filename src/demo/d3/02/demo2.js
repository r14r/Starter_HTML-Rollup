/**
 *
 *
 */
var sessions = [
  { name: "1", year: 2014 },
  { name: "2", year: 1970 },
  { name: "3", year: 1892 },
  { name: "4", year: 1941 },
  { name: "5", year: 1953 },
];

console.log("sessions", sessions);

var target = d3.select("#demo2");
console.log("2: target=", target);

var tbody = target.append("table").append("tbody");

tbody
  .selectAll("tr")
  .data(sessions)
  .enter()
  .append("tr")
  .selectAll("td")
  .data(function (d) {
    return d3.values(d);
  })
  .enter()
  .append("td")
  .text(function (d) {
    return d;
  });

d3.selectAll("tr").classed("grey", function (d, i) {
  return i % 2 == 0;
});
