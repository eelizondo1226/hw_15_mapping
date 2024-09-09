let basemap =   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 1
});

basemap.addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data){
    // console.log('here')
    // console.log(data)
    // let min_depth = data.features[0].geometry.coordinates[2]
    // let max_depth = data.features[0].geometry.coordinates[2]
    // for (let i = 0; i < data.features.length; i++) {
    //     let current_depth = data.features[i].geometry.coordinates[2]
    //     if (current_depth < min_depth) {
    //         min_depth = current_depth
    //     }
    //     if (current_depth > max_depth) {
    //         max_depth = current_depth
    //     }
    // }
    // console.log(min_depth, max_depth)
    function depthColor(depth) {
        switch(true) {
            case depth > 500:
                return "MidnightBlue";
            case depth > 400:
                return "MediumBlue";
            case depth > 300:
                return "turquoise";
            case depth > 200:
                return "mediumturquoise";
            case depth > 100:
                return "steelblue";
            case depth > -10:
                return "paleturquoise";
        }
    }
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 2,
                color: depthColor(feature.geometry.coordinates[2]),
                weight: 0.5,
                opacity: 1,
                fillOpacity: 1,
                fillColor: depthColor(feature.geometry.coordinates[2])
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);
    // Define the depth ranges and corresponding colors
    let depths = [0, 100, 200, 300, 400, 500];
    let colors = ["paleturquoise", "steelblue", "mediumturquoise", "turquoise", "MediumBlue", "MidnightBlue"];

    // Create a legend
    let legend = L.control({ position: "topright" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend");
        let legendInfo = "<h4>Depth Legend</h4>";

        for (let i = 0; i < depths.length; i++) {
            let color = colors[i];
            let depthRange = depths[i] + (i < depths.length - 1 ? "-" + (depths[i + 1] - 1) : "+");
            legendInfo += "<i style='background: " + color + "'></i> " + depthRange + "<br>";
        }

        div.innerHTML = legendInfo;
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
    })
