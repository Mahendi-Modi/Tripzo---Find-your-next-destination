mapboxgl.accessToken = mapToken;

const coords = listing.geometry.coordinates;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: coords,
  zoom: 9,
});

new mapboxgl.Marker({ color: "red" })
  .setLngLat(coords)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);

map.on("load", () => {
  map.addSource("circleArea", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coords,
      },
    },
  });

  map.addLayer({
    id: "circle-fill",
    type: "circle",
    source: "circleArea",
    paint: {
      "circle-radius": 80,
      "circle-color": "rgba(238, 104, 104, 0.36)",
      "circle-stroke-color": "red",
    },
  });
});
