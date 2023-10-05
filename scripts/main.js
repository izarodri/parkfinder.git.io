// main.js
import { initMap, startGeolocationTracking, updateGeolocationTracking } from './map.js';
import { setVagas, setAreas, filtroPorTipo } from './data.js';
import { calcularRota, isCoordinateInsideCircle, geocodificarEndereco } from './route.js';
import { mudar, livre, paga, deficiente, voltarTop } from './ui.js';

document.addEventListener("DOMContentLoaded", function () {
    // ...

    initMap();
    startGeolocationTracking();
    updateGeolocationTracking();

    // Exemplo de uso de funções de outros módulos:
    document.getElementById('botaoMudar').addEventListener('click', mudar);
    document.getElementById('btnLivre').addEventListener('click', livre);
    document.getElementById('btnPaga').addEventListener('click', paga);
    document.getElementById('btnDeficiente').addEventListener('click', deficiente);
    document.getElementById('botaoVoltar').addEventListener('click', voltarTop);

    var options = {
    enableHighAccuracy: true, 
    maximumAge: 5000,          
    timeout: 10000};

    const destino = document.getElementById('destino');
destino.addEventListener("keydown", function(event) {
    
    if (event.keyCode === 13) {
        calcularRota();
    }});
});
