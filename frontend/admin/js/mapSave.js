function downloadGeoJSON(geojson) {
  const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "polygon.geojson";
  link.click();
  URL.revokeObjectURL(link.href);
}

var GeoJSONmap;

function savePolygon() {
  const data = draw.getAll();
  GeoJSONmap = draw.getAll();
  if (data.features.length > 0) {
    downloadGeoJSON(data);
  } else {
    alert("Draw a polygon first.");
  }
}

function centerMap() {
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);
  if (!isNaN(latitude) && !isNaN(longitude)) {
    map.setCenter([longitude, latitude]);
  } else {
    alert("Please enter valid coordinates.");
  }
}

mapboxgl.accessToken = "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11?optimize=true",
  center: [0, 0],
  zoom: 2,
  performanceMetricsCollection: false,
});

map.addControl(new mapboxgl.NavigationControl());

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  })
);

const draw = new MapboxDraw({
  displayControlsDefault: false,
  // Select which mapbox-gl-draw control buttons to add to the map.
  controls: {
    polygon: true,
    trash: true,
  },
  // Set mapbox-gl-draw to draw by default.
  // The user does not have to click the polygon control button first.
  defaultMode: "draw_polygon",
});
map.addControl(draw);

map.on("draw.create", updateArea);
map.on("draw.delete", updateArea);
map.on("draw.update", updateArea);

function updateArea(e) {
  const data = draw.getAll();
  const answer = document.getElementById("calculated-area");
  if (data.features.length > 0) {
    const area = turf.area(data);
    // Restrict the area to 2 decimal points.
    const rounded_area = Math.round(area * 100) / 100;
    answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
  } else {
    answer.innerHTML = "";
    if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
  }
}

/*button toggle*/
var toggleButton = document.getElementById("toggle-button");
var overlay = document.getElementById("search-box");

toggleButton.addEventListener("click", function () {
  if (overlay.style.display === "block") {
    overlay.style.display = "none";
  } else {
    overlay.style.display = "block";
  }
});
