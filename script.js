
// COLOR PALETTE and ORDER


const speciesOrder = [
  "London planetree","honeylocust","Callery pear","pin oak",
  "Norway maple","littleleaf linden","cherry","Japanese zelkova",
  "ginkgo","Sophora","red maple","green ash","American linden",
  "silver maple","sweetgum","northern red oak","silver linden",
  "American elm","maple","purple-leaf plum"
];

const speciesColors = [
  "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd",
  "#8c564b","#e377c2","#2f2f2fff","#bcbd22","#17becf",
  "#aec7e8","#ffbb78","#98df8a","#ff9896","#c5b0d5",
  "#c49c94","#f7b6d2","#c7c7c7","#dbdb8d","#9edae5"
];


// FULL DASHBOARD SPEC


const embeddingSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "url": "embeddings_full_top20.csv" },

  "resolve": { "scale": { "x": "independent", "y": "independent" } },

  "config": {
    "concat": { "spacing": 40 },
    "hconcat": { "spacing": 100 }
  },

  "vconcat": [


    // MAIN SCATTERPLOT 

    {
      "title": {
        "text": "Tree Embedding Scatterplot",
        "anchor": "start",
        "fontSize": 18,
        "fontWeight": "bold"
      },

      "params": [
        {
          "name": "zoom",
          "select": { "type": "interval", "encodings": ["x", "y"] },
          "bind": "scales"
        }
      ],

      "selection": {
        
        // Brush Feature

        "brush": {
          "type": "interval",
          "encodings": ["x","y"],
          "empty": "none",
          "mark": {
            "fill": "#333",
            "fillOpacity": 0.1,
            "stroke": "white",
            "strokeWidth": 1,
            "clip": false
          }
        },

        "pt": {
          "type": "point",
          "fields": ["tree_id"],
          "on": "click",
          "empty": "none"
        },

        "speciesSelect": {
          "type": "point",
          "fields": ["species_reduced"],
          "on": "click"
        }
      },

      // Scatterplot size 

      "width": 1600,
      "height": 500,

      "mark": { "type": "circle", "size": 28, "opacity": 0.1 },
 
      // Encoding for scatterplot

      "encoding": {
        "x": {
          "field": "x",
          "type": "quantitative",
          "axis": { "title": "Tree Similarity X axis" }
        },

        "y": {
          "field": "y",
          "type": "quantitative",
          "axis": { "title": "Tree Similarity Y axis" }
        },

        // Color of dots

        "color": {
          "field": "species_reduced",
          "type": "nominal",
          "title": "Top 20 Species",
          "scale": {
            "domain": speciesOrder,
            "range": speciesColors
          }
        },

        // opacity of points

        "opacity": {
          "condition": [
            { "selection": "pt", "value": 1 },
            { "selection": "speciesSelect", "value": 1 },
            { "selection": "brush", "value": 0.9 }
          ],
          "value": 0.1
        },

        "stroke": {
          "condition": { "selection": "pt", "value": "black" },
          "value": null
        },

        "strokeWidth": {
          "condition": { "selection": "pt", "value": 2.5 },
          "value": 0
        },

        // Tooltip on scatterplot points

        "tooltip": [
          { "field": "tree_id", "title": "Tree ID" },
          { "field": "species_reduced", "title": "Species" },
          { "field": "tree_dbh", "title": "DBH" },
          { "field": "borough", "title": "Borough" },
          { "field": "health", "title": "Health" },
          { "field": "status", "title": "Status" },
          { "field": "curb_loc", "title": "Curb Type" },
          { "field": "x", "title": "Embedding X" },
          { "field": "y", "title": "Embedding Y" }
        ]
      }
    },

    // BAR CHART and SPATIAL MAP

    {
      "hconcat": [


        // BAR CHART on to the left

        {
          "title": {
            "text": "Top 20 Species shown in Brushed Region",
            "anchor": "start",
            "fontSize": 18,
            "fontWeight": "bold"
          },

          "transform": [
            { "filter": { "param": "brush" } }
          ],

          "selection": {
            "speciesSelect": { "type": "point", "fields": ["species_reduced"], "on": "click" }
          },

          // Bar chart size

          "width": 700,
          "height": 500,

          "mark": "bar",

          // Encoding for bar chart

          "encoding": {
            "x": {
              "field": "species_reduced",
              "type": "nominal",
              "sort": speciesOrder,
              "axis": { "labelAngle": -45, "title": "Species" }
            },

            "y": {
              "aggregate": "count",
              "type": "quantitative",
              "axis": { "title": "Tree Count" }
            },

            "color": {
              "field": "species_reduced",
              "type": "nominal",
              "scale": {
                "domain": speciesOrder,
                "range": speciesColors
              }
            },

            // Opacity of bars

            "opacity": {
              "condition": { "selection": "speciesSelect", "value": 1 },
              "value": 0.4
            },

            // tooltip for bars

            "tooltip": [
              { "field": "species_reduced", "title": "Species" },
              { "aggregate": "count", "title": "Count" }
            ]
          }
        },

  
        // SPATIAL MAP WITH NYC OUTLINE
     
        {
          "title": {
            "text": "NYC Spatial Map of Trees",
            "anchor": "start",
            "fontSize": 18,
            "fontWeight": "bold"
          },

          "layer": [

            // NYC OUTLINE MAP
            {
              "data": {
                "url": "borough.geojson",
                "format": { "type": "json" }
              },
              "mark": {
                "type": "geoshape",
                "stroke": "#555",
                "strokeWidth": 1.2,
                "fill": "#f2f2f2",
                "opacity": 1
              },
              "projection": {
                "type": "identity",
                "reflectY": true
              }
            },

            // tree points layer

            {
              "transform": [
                { "filter": { "param": "brush" } }
              ],

              "mark": { "type": "circle", "size": 10, "opacity": 1 },

              // Encoding for spatial map points

              "encoding": {
                "x": {
                  "field": "x_sp",
                  "type": "quantitative",
                  "scale": { "zero": false },
                  "axis": { "title": "Longitude (x_sp)" }
                },

                "y": {
                  "field": "y_sp",
                  "type": "quantitative",
                  "scale": { "zero": false },
                  "axis": { "title": "Latitude (y_sp)" }
                },

                "color": {
                  "field": "species_reduced",
                  "type": "nominal",
                  "scale": {
                    "domain": speciesOrder,
                    "range": speciesColors
                  }
                },

                // Opacity of points on map
                 
                "opacity": {
                  "condition": [
                    { "selection": "pt", "value": 1 },
                    { "selection": "speciesSelect", "value": 1 }
                  ],
                  "value": 0.1
                },

                "stroke": {
                  "condition": { "selection": "pt", "value": "black" },
                  "value": null
                },

                "strokeWidth": {
                  "condition": { "selection": "pt", "value": 2.5 },
                  "value": 0
                },

                // Tooltip on map points

                "tooltip": [
                  { "field": "tree_id", "title": "Tree ID" },
                  { "field": "species_reduced", "title": "Species" },
                  { "field": "borough", "title": "Borough" }
                ]
              }
            }
          ],

          // Spatial Map size

          "width": 700,
          "height": 500
        }
      ]
    }
  ]
};


// RENDERING THE DASHBOARD

vegaEmbed("#app", embeddingSpec);

