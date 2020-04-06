const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x}, ${cent.y})`);
// translate the graph group to the middle of the svg container

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);
// the value we are evaluating to create the pie angles

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const color = d3.scaleOrdinal(d3["schemeSet3"]);

// legend setup
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);

const legend = d3
  .legendColor()
  .shape("path", d3.symbol().type(d3.symbolCircle)())
  .shapePadding(10)
  .scale(color);

const tip = d3
  .tip()
  .attr("class", "tip")
  .html((d) => {
    let content = `<div class="name">${d.data.name}</div>`;
    content += `<div class="cost">${d.data.cost}</div>`;
    content += `<div class="delete">Click slice to delete</div>`;
    return content;
  });

graph.call(tip);

// update function
const update = (data) => {
  // update color scale domiain
  color.domain(data.map((d) => d.name));

  // update and call legend
  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("fill", "white");

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // remove unwanted shapes from the exit selection
  paths.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();
  /// handle the current DOM path updates
  paths
    .attr("d", arcPath)
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  // append the enter selection to the dome
  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (d) => color(d.data.name))
    .each(function (d) {
      this._current = d;
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);

  // add events
  graph
    .selectAll("path")
    // when mover over it shows the tip
    .on("mouseover", (d, i, n) => {
      tip.show(d, n[i]);
      handleMouseOver(d, i, n);
    })
    // When move out it hids the tip
    .on("mouseout", (d, i, n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    })
    .on("click", handleClick);
};

// data from CSV
let US_state_data = [];
d3.csv(
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-04-2020.csv"
).then(function (d) {
  // Loop through array
  for (var i = 0; i < d.length; i++) {
    if (d[i].Country_Region == "US") {
      US__state_data.push({
        Province_State: d[i].Province_State,
        Confirmed: d[i].Confirmed,
        Deaths: d[i].Deaths,
      });
    } else {
    }
  }
});

//on first load make transition animation
const arcTweenEnter = (d) => {
  var i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

//on delete make transition animation
const arcTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// use function keyword to allow use of 'this'
function arcTweenUpdate(d) {
  // interpolate between the two objects
  var i = d3.interpolate(this._current, d);
  // update the current prop with new updated data
  this._current = i(1);
  return function (t) {
    return arcPath(i(t));
  };
}

// event handlers
const handleMouseOver = (d, i, n) => {
  //console.log(n[i]);
  d3.select(n[i])
    // does not stop after reloading. make sure that it fills
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", "#fff");
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", color(d.data.name));
};

const handleClick = (d) => {
  const id = d.data.id;
  db.collection("expenses").doc(id).delete();
};
