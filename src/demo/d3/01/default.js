///////////////////////////////////////////
// UTILITY FUNCTIONS

// Make a key-value object
var make_key_value = function (k, v) {
  return { key: k, value: v };
};

// Join a key array with a data array.
// Return an array of key-value objects.
var merge = function (keys, values) {
  var l = keys.length;
  var d = [],
    v,
    k;
  for (var i = 0; i < l; i++) {
    v = values[i].slice();
    k = keys[i];
    d.push(make_key_value(k, v));
  }
  return d;
};

// Shuffles the input array.
function shuffle(array) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    (t = array[m]), (array[m] = array[i]), (array[i] = t);
  }
  return array;
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Resize the array, append random numbers if new_size is larger than array.
function update_array(a, new_size) {
  a = a || [];

  if (a.length > new_size) {
    return a.slice(0, new_size);
  }

  var delta = new_size - a.length;
  for (var i = 0; i < delta; i++) {
    a.push(get_random_int(0, 9));
  }

  return a;
}

////////////////////////////////////////////////////////////
// GENERATE DATA
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

var letter_to_data = {}; // store row data

var generate_data = () =>  {
  var i, j, a, l;
  var letters = shuffle(alphabet);
  var num_cols = get_random_int(3, 10);
  var num_rows = get_random_int(5, 15);

  var row_data = [];
  for (i = 0; i < num_rows; i++) {
    l = letters[i];
    a = update_array(letter_to_data[l], num_cols);
    letter_to_data[l] = a; // store data
    row_data.push(a);
  }

  for (i = num_rows; i < letters.length; i++) {
    delete letter_to_data[i];
  }

  letters = letters.slice(0, num_rows);

  return merge(letters, row_data);
};

var get_key = function (d) {
  return d && d.key;
};

var extract_row_data = function (d) {
  var values = d.value.slice();

  values.unshift(d.key);
  return values;
};

var ident = function (d) {
  return d;
};

/////////////////////////////////////////////
var table = d3.select("table");

var update = function (data) {
  var rows = table.selectAll("tr").data(data, get_key);

  var cells = rows.selectAll("td").data(extract_row_data);

  cells.attr("class", "update");

  // Cells enter selection
  cells
    .enter()
    .append("td")
    .style("opacity", 0.0)
    .attr("class", "enter")
    .transition()
    .delay(900)
    .duration(500)
    .style("opacity", 1.0);

  cells.text(ident);

  // Cells exit selection
  cells
    .exit()
    .attr("class", "exit")
    .transition()
    .delay(200)
    .duration(500)
    .style("opacity", 0.0)
    .remove();

  var cells_in_new_rows = rows
    .enter()
    .append("tr")
    .selectAll("td")
    .data(extract_row_data);

  cells_in_new_rows
    .enter()
    .append("td")
    .style("opacity", 0.0)
    .attr("class", "enter")
    .transition()
    .delay(900)
    .duration(500)
    .style("opacity", 1.0);

  cells_in_new_rows.text(ident);

  // Remove old rows
  rows
    .exit()
    .attr("class", "exit")
    .transition()
    .delay(200)
    .duration(500)
    .style("opacity", 0.0)
    .remove();

  table.selectAll("tr").select("td").classed("row-header", true);
};

update(generate_data());

/*
setInterval(function () {
  update(generate_data());
}, 3500);
*/