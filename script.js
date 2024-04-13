// Ajout d'une couche de tuiles Open Topo Map
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Ajout d'une couche de tuiles Open Street Map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

// Création de la carte avec une vue initiale centrée sur le monde
var map = L.map('map', {
    layers: [OpenTopoMap], // Fond de carte par défaut
    center: [0, 0],
    zoom: 2
});

// Création d'une variable pour l'icône des séismes
var myIcon = L.icon({
    iconUrl: '/Images/icons8-tremblements-de-terre-100.png',
    iconSize: [15, 15], 
})

// Ajout de la couche linéaire pour les failles
var trench2 = L.geoJSON(trench, {
    style: function (feature) {
        return { color: 'blue', weight: 1};
    }
}).addTo(map);

// Ajout de la couche polygonale pour les plaques tectoniques
var plaques2 = L.geoJSON(plaques, {
    style: function (feature) {
        return { color: 'red', weight: 2, fill: false};
    }
}).addTo(map);

// Ajout de la couche ponctuelle pour les séismes provenant de l'API de l'USGS
var seismes;
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson')
    .then(response => response.json())
    .then(data => {
        seismes = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: myIcon // Utilisation de l'icône personnalisée
                });
            }
        }).addTo(map);

// Ajout d'une légende et ajustement de ses propriétés
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i class="icon" style="background-image: url(\'/Images/icons8-tremblements-de-terre-100.png\'); background-repeat: no-repeat;"></i><span>Séisme</span><br>';
    div.innerHTML += '<svg height="15" width="40"><line x1="0" y1="8" x2="20" y2="8" style="stroke:blue;stroke-width:1" /></svg><span>Faille</span><br>';
    div.innerHTML += '<svg height="15" width="40"><line x1="0" y1="8" x2="20" y2="8" style="stroke:red;stroke-width:2" /></svg><span>Limite plaque</span><br>';
    return div;
};
legend.addTo(map);

// Création de la variable pour les fonds de carte
var baseMaps = {
    "Open Topo Map": OpenTopoMap,
    "Open Street Map": osm           
};

// Création de la variable pour les couches fonctionnelles
var overlays = {
    "Séismes": seismes,
    "Plaques tectoniques": plaques2,
    "Failles": trench2    
};

// Ajout d'un outil pour l'affichage des couches
var layerControl = L.control.layers(baseMaps, overlays);
layerControl.addTo(map);
// Ajout d'un id pour gérer le style dans le css
layerControl.getContainer().id = 'custom-layer-control';
});

// Ajout d'un titre directement sur la carte
var titleControl = L.control();
titleControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'title-control');
    div.innerHTML = '<h2>Séismes de magnitude 4.5 et plus de la dernière journée</h2>'; 
    return div;
};
titleControl.addTo(map);

// Ajout d'un titre directement sur la carte
L.control.scale().addTo(map);