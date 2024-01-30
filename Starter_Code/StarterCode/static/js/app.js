// funct that pops metadata
function demoInfo(sample)
{
    //console.log(sample)

    d3.json("samples.json").then((data) => {
         // grab all metadata
        let metaData = data.metadata;
            
        // filter based on the value of the sample (returns one result in array)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);

        // clear the metadata
        d3.select("#sample-metadata").html("")

        // use Object.entries to get value key pairs
        Object.entries(resultData).forEach(([key, value])=> {
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });

    });
}

// funct that builds graphs
function buildGraph(sample)
{
    //console.log(sample);
    //let data = d3.json("samples.json");
    //console.log(data);

    d3.json("samples.json").then((data) => {
        // grab all sample data
       let sampleData = data.samples;
           
       // filter based on the value of the sample (returns one result in array)
       let result = sampleData.filter(sampleResult => sampleResult.id == sample);

       // access index 0 from array
       let resultData = result[0];

        // get otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the chart
        // get yticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        //console.log(yticks);
        let xValues = sample_values.slice(0, 10);
        //console.log(xValues);
        let textLabels = otu_labels.slice(0, 10);
        //console.log(textLabels);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }
        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };
        Plotly.newPlot("bar", [barChart], layout);
   });
}

//funct that builds bubble chart
function buildBubbleChart(sample){
d3.json("samples.json").then((data) => {
    // grab all sample data
    let sampleData = data.samples;
           
    // filter based on the value of the sample (returns one result in array)
    let result = sampleData.filter(sampleResult => sampleResult.id == sample);

    // access index 0 from array
    let resultData = result[0];

     // get otu_ids
     let otu_ids = resultData.otu_ids;
     let otu_labels = resultData.otu_labels;
     let sample_values = resultData.sample_values;

     // build the bubble chart

     let bubbleChart = {
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        mode: "markers",
        marker: {
           size: sample_values,
           color: otu_ids,
           colorscale:"Earth"
        }
     }
     let layout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
     };
     Plotly.newPlot("bubble", [bubbleChart], layout);
    });
};


// funct to init. dashboard
function initialize()
{
    //let data = d3.json("samples.json");
    //console.log(data);

    // access the dropdown selector from index
    var select = d3.select("#selDataset")

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;  // array of just names
        //console.log(sampleNames);

        // use a foreach in order to create options for each sample in the selector
        sampleNames.forEach((sample) => {
            select.append("option")
            .text(sample)
            .property("value", sample);

        });
            // when init. pass in the info for the first sample
        let firstSample = sampleNames[0];

        // call funtion to build metadata
        demoInfo(firstSample);

        // call funtion to build graph
        buildGraph(firstSample);

        // call function to build bubble chart
        buildBubbleChart(firstSample);
    });
}

// funct that updates dashboard
function optionChanged(item)
{
    //call update to metadata
    demoInfo(item);
    // call funtion to build graph
    buildGraph(item);
    // call function to build bubble chart
    buildBubbleChart(item);
}

// call on init. function
initialize();