function buildMetadata(sample) {

  var metaselector = d3.select("#sample-metadata")
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/"+sample).then((metadata) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(metadata)
    // Use `.html("") to clear any existing metadata
    metaselector.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach(([key, value]) => {
      console.log(`Key: ${key} and Value ${value}`);
      metaselector.append("p").text(`${key}: ${value}`)

    buildGauge(metadata.WFREQ);

    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then((sampledata) => {
    // @TODO: Build a Bubble Chart using the sample data
    var bubbletrace = {
      x: sampledata.otu_ids,
      y: sampledata.sample_values,
      text: sampledata.otu_labels,
      mode: 'markers',
      marker: {
        color: sampledata.otu_ids,
        size: sampledata.sample_values,
        sizemode:'area',
        sizeref:1.*d3.max(sampledata.sample_values)/(40.**2),
        sizemin:4
      }
    };
    var bubbledata = [bubbletrace]
    var bubblelayout = {
      title: 'Sample Data Bubble Chart'
      // showlegend: false,
      // height: 600,
      // width: 600
    };
    var BUBBLE = document.getElementById("bubble");
    Plotly.newPlot(BUBBLE, bubbledata, bubblelayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pietrace = {
      values: sampledata.sample_values.slice(0,10),
      labels: sampledata.otu_ids.slice(0,10),
      type: "pie",
      textinfo: sampledata.otu_labels.slice(0,10)
    };
    var piedata = [pietrace];
    var pielayout = {title:"Sample Data top 10"};
    var PIE = document.getElementById("pie");
    Plotly.newPlot(PIE, piedata, pielayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
