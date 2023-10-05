// map.js
import { setVagas, setAreas } from './data.js';
let map;
let routingControl;
let userMarker = null;
let userPosition = null;
const pontoPartida = [-11.303361, -41.855833];

export function initMap() {
    map = L.map('map').setView(pontoPartida, 19);
    setVagas(map)
    setAreas(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        
        
    }).addTo(map);
    
    routingControl = L.Routing.control({
        waypoints: [],
        language: "pt-BR",
       
            routeWhileDragging: false,
            draggableWaypoints: false,
            show: false,
            
            
            createMarker: function(i, waypoint, n) {
                return null;
            },
            lineOptions: {
                styles: [
                    {color: 'black', weight: 4}
                ]
            }
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
      
        const routes = e.routes;
        const primeiraRota = routes[0];
        const tempo = primeiraRota.summary.totalTime;
        const distancia = (primeiraRota.summary.totalDistance)
        const infoDiv_1 = document.getElementById('info_1');
        const infoDiv_2 = document.getElementById('info_2');
        const tempo1 = (tempo / 60).toFixed(2)
        infoDiv_1.innerHTML = `${distancia}m`;
        infoDiv_2.innerHTML = `${tempo1}min`;
        let mostrarDivInfo = document.getElementById('info_divEstrutura');
        mostrarDivInfo.style.display = 'block';

        const topbar = document.querySelector(".top-bar")
        const mapa =document.querySelector("#map")
        topbar.style.visibility="hidden"
        mapa.style.margin = "0";
        mapa.style.height = "100vh";
        const zoomKeys = document.querySelector(".leaflet-control-zoom")
        const routeOption = document.querySelector(".leaflet-routing-container")
        const sairRota = document.getElementById("botaox")
        zoomKeys.style.visibility="hidden"
       /* routeOption.style.visibility = "visible"*/
        sairRota.style.visibility ="visible"
        sairRota.addEventListener("click", voltarTop)
       /* routeOption.style.visibility = "visible"*/ 
    });

}

var options = {
    enableHighAccuracy: true,  // Ativar alta precisão
    maximumAge: 5000,          // Idade máxima de 5 segundos para a posição
    timeout: 10000             // Tempo limite de 10 segundos para obter a posição
};

export function startGeolocationTracking() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        userPosition = [lat, lng];
        map.setView(userPosition, 19);
        updateUserMarkerPosition(userPosition);
    }, null, options);
}

export function updateGeolocationTracking() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            userPosition = [lat, lng];

            if (routingControl.getWaypoints()[0].latLng !== null) {
                routingControl.setWaypoints([userPosition, destinoCoords]);
                routingControl.route();
            }

            updateUserMarkerPosition(userPosition);
        }, null, options);
    } else {
        console.log("Geolocalização não suportada pelo navegador.");
    }
}
export function updateUserMarkerPosition(userPosition) {
    if (userMarker) {
        userMarker.setLatLng(userPosition);
    } else {
        urlIcon = 'Imagens/lozalização.usuariograndepng.png'
        let customIcon = L.icon({
            iconUrl: urlIcon, 
            iconSize: [32, 32], 
            iconAnchor: [16, 16] 
        });
        userMarker = L.marker(userPosition, { icon: customIcon }).addTo(map);
    }
}

