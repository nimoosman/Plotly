  // Build metadata panel

function buildMetadata(sample) {
//d3.json, object.enteries
  var metadataURL = `/metadata/${sample}`;
    d3.json(metadataURL).then(function(sample){
      var sampleData = d3.select(`#sample-metadata`);
      sampleData.html("");
      Object.entries(sample).forEach(function([key,value]){
        var row = sampleData.append("p");
        row.text(`${key}:${value}`)
      })
    });
}

function buildCharts(sample) {
  // Pulling sample data for the plots
  var plotData = `/samples/${sample}`;

  // Bubble Chart
  //Axis  and labels 
  d3.json(plotData).then(function(data){
    var x_axis = data.otu_ids;
    var y_axis = data.sample_values;
    var size = data.sample_values;
    var color = data.otu_ids;
    var texts = data.otu_labels;
  
    var bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    //Pie Chart
    d3.json(plotData).then(function(data){
      var values = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);

      var pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot("pie", data, layout);
    });
  });
};


function init() {
  console.log('Log');
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();

//Run plotly_env anaconda // Lenovo7 // Deploy second neemz Heroku app
