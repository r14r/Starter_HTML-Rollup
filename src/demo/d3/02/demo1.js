var matrix = [
  { name: "Lee Gai Fun", age: 42, sex: "M" },
  { name: "Laia Hamidullah", age: 27, sex: "F" },
  { name: "Abraham Mdulla", age: 33, sex: "M" },
];

var target = d3.select("#demo1");
console.log("1: target=", target);

var tr = target.selectAll("tr").data(matrix).enter().append("tr");

var td = tr
  .selectAll("td")
  .data(function (d, i) {
    return Object.values(d);
  })
  .enter()
  .append("td")
  .text(function (d) {
    return d;
  });
  