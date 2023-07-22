// Use D3 library to read in samples.json

// Function to initialize the dashboard
function init() {
  // Read the samples.json data using D3
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // Extract the sample names for dropdown menu
    var names = data.names;
    // Populate the dropdown menu options
    var dropdownMenu = d3.select("#selDataset");
    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    // Display the default charts, metadata, and gauge
    updateCharts(names[0]);
    showMetadata(names[0]);
  });
}

// Function to update the charts and metadata
function updateCharts(sampleID) {
  // Read the samples.json data using D3
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // Filter data for the selected sample ID
    var sampleData = data.samples.filter((sample) => sample.id === sampleID)[0];

    // Create the horizontal bar chart
    var barTrace = {
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var barLayout = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { autorange: "reversed" }
    };

    Plotly.newPlot("bar", [barTrace], barLayout);

    // Create the bubble chart
    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    };

    var bubbleLayout = {
      title: "Microbe Frequency",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Create the gauge chart
    var metadata = data.metadata.filter((meta) => meta.id === parseInt(sampleID))[0];
    var washFrequency = metadata.wfreq;

    updateGaugeChart(washFrequency);
  });
}

// Function to display the sample metadata
function showMetadata(sampleID) {
  // Read the samples.json data using D3
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // Filter data for the selected sample ID
    var metadata = data.metadata.filter((meta) => meta.id === parseInt(sampleID))[0];

    // Get the metadata panel element
    var metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Append each key-value pair from metadata to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to update the gauge chart
function updateGaugeChart(washFrequency) {
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFrequency,
      title: { text: "Weekly Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 1], color: "rgb(248, 243, 236)" },
          { range: [1, 2], color: "rgb(244, 241, 229)" },
          { range: [2, 3], color: "rgb(233, 230, 202)" },
          { range: [3, 4], color: "rgb(229, 231, 179)" },
          { range: [4, 5], color: "rgb(213, 228, 157)" },
          { range: [5, 6], color: "rgb(183, 204, 146)" },
          { range: [6, 7], color: "rgb(140, 191, 136)" },
          { range: [7, 8], color: "rgb(138, 187, 143)" },
          { range: [8, 9], color: "rgb(133, 180, 138)" }
        ]
      }
    }
  ];

  var layout = {
    width: 400,
    height: 400,
    margin: { t: 0, b: 0 }
  };

  Plotly.newPlot("gauge", data, layout);
}

// Function to handle changes in the dropdown selection
function optionChanged(newSampleID) {
  updateCharts(newSampleID);
  showMetadata(newSampleID);
}

// Initialize the dashboard
init();