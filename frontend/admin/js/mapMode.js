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


function updateMarkerList() {
    const markerList = document.getElementById('markers');
    markerList.innerHTML = '';

    markers.forEach((marker, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = marker.name;
        markerList.appendChild(listItem);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            marker.marker.remove();
            markers.splice(index, 1);
            updateMarkerList();
        });
        listItem.appendChild(deleteButton);
    });
}


document.getElementById('polygon-file').addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length === 0) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        geojson = JSON.parse(event.target.result);
        map.addSource('polygon', {
            'type': 'geojson',
            'data': geojson
        });
        map.addLayer({
            'id': 'polygon-layer',
            'type': 'fill',
            'source': 'polygon',
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.4
            }
        });
        const bounds = new mapboxgl.LngLatBounds();
        geojson.features[0].geometry.coordinates[0].forEach((coord) => {
            bounds.extend(coord);
        });
        map.fitBounds(bounds, { padding: 50 });
    };
    reader.readAsText(files[0]);
});


const markers = [];

let markerCounter = 0;

function createMarker(type, team) {
    const markerEl = document.createElement('div');
    markerEl.className = `marker ${type}`;
    if (type === 'hq' && team === 0) {
        markerEl.style.backgroundColor = 'red';
    } else if (team === 0) {
        markerEl.style.backgroundColor = 'red';
    } else if (team === 1) {
        markerEl.style.backgroundColor = 'green';
    } else if (team === 2) {
        markerEl.style.backgroundColor = 'yellow';
    }

    const markerName = `${team}${type} No. ${markerCounter}`;
    markerCounter++;

    const marker = new mapboxgl.Marker(markerEl);
    marker.setLngLat(map.getCenter()).addTo(map);

    markers.push({ name: markerName, type, team, lng: marker.getLngLat().lng, lat: marker.getLngLat().lat, marker });

    updateMarkerList();

    return markerEl;
}

document.getElementById('create-marker').addEventListener('click', () => {
    const type = document.getElementById('marker-type').value;
    const team = parseInt(document.getElementById('marker-team').value);
    const markerEl = createMarker(type, team);

    const marker = new mapboxgl.Marker(markerEl);
    marker.setLngLat(map.getCenter()).addTo(map);



    updateMarkerList();
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-markers').addEventListener('click', function () {
        const data = JSON.stringify(markers);
        const a = document.createElement('a');
        const file = new Blob([data], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        a.download = 'markers.json';
        a.click();
        console.log('Save markers clicked');
    });
});

function centerMap() {
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    if (!isNaN(latitude) && !isNaN(longitude)) {
        map.setCenter([longitude, latitude]);
    } else {
        alert('Please enter valid coordinates.');
    }
}

/*button toggle*/
var toggleButton = document.getElementById('toggle-button');
var overlay = document.getElementById('search-box');

toggleButton.addEventListener('click', function () {
    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
    }
});
