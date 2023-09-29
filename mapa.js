/*
document.addEventListener("DOMContentLoaded", function () {
    // Realize a solicitação para obter o perfil do cliente
    fetch("http://localhost:8082/perfil-cliente", {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")  // Substitua seuTokenAqui pelo token JWT
        },
        method: "GET"
    })
    .then(function (res) {
        if (res.status === 200) {
            return res.json(); // Retorna o perfil do cliente como um objeto JSON
        } else {
            throw new Error("Erro no servidor ou token inválido");
           
        }
    })
    .then(function (cliente) {
        carregarPaginaDoMapa();
    
    })
    .catch(function (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar perfil do cliente ou token inválido!");
        window.location.href = "login.html";
    });
});
*/

let map;
let routingControl;
const pontoPartida = [-11.303361, -41.855833];
let userMarker = null;
let userPosition = null;
let vagas = [];
let areas = [];


function initMap() {
    
    map = L.map('map').setView(pontoPartida, 19);
    setVagas(map)
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
   
    adicionarAreas();
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
        zoomKeys.style.visibility="hidden"
       /* routeOption.style.visibility = "visible"*/
    });
}

function calcularRota() {

    const destino = document.getElementById('destino').value;
    geocodificarEndereco(destino, function (destinoCoords) {
        isInArea = false
        console.log(areas)
        for (let index = 0; index < areas.length; index++) {
            const area = areas[index];
            const latArea = area.getLatLng().lat;
            const lngArea = area.getLatLng().lng;
            const raio = area.getRadius();
            isInArea = isCoordinateInsideCircle(destinoCoords[0], destinoCoords[1], latArea, lngArea, raio);
            if (isInArea) {
                let menorDistancia;
                let indexVagaMenorDistancia;
                for (let index = 0; index < vagas.length; index++) {
                    const vaga = vagas[index];
                    if (index == 0) {
                        menorDistancia = vaga.getLatLng().distanceTo(destinoCoords);

                    } else {
                        let distanciaVaga = vaga.getLatLng().distanceTo(destinoCoords);
                        if (distanciaVaga < menorDistancia){
                            menorDistancia = distanciaVaga
                            indexVagaMenorDistancia = index
                        }
                                     
                    }
                
                }
                let vagaEscolhida = vagas[indexVagaMenorDistancia]
                routingControl.setWaypoints([userPosition, vagaEscolhida.getLatLng()]);
                routingControl.route() 
            }  
        }

        if (!isInArea){
            routingControl.setWaypoints([userPosition, destinoCoords]);
            routingControl.route() 
            alert("Não encontramos nenhuma vaga perto da sua localização de destino!!")
            L.marker(destinoCoords).addTo(map);
        }

    });
}

function isCoordinateInsideCircle(latitude, longitude, centroLatitude, centroLongitude, raio) {
    let coordenadaUsuario = L.latLng(latitude, longitude);
    let coordenadaCentro = L.latLng(centroLatitude, centroLongitude);
    let distance = coordenadaUsuario.distanceTo(coordenadaCentro);
    return distance <= raio;
}

function geocodificarEndereco(endereco, callback) {
    const api_key = 'pk.637c496315cae65646ec465d593bf88e';
    const url = `https://us1.locationiq.com/v1/search.php?key=${api_key}&q=${endereco}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const resultado = data[0];
                const latitude = resultado.lat;
                const longitude = resultado.lon;
               
                callback([latitude, longitude]);

            } else {
                alert('Nenhum resultado encontrado para o endereço de destino: ' + endereco);
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

async function setVagas(map) {
    async function getVagas() {
        try {
            const response = await fetch("http://localhost:8082/vaga", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "GET",
            });

            if (response.status === 200) {
                const dados = await response.json();
                return dados;
                
            } else {
                throw new Error("Erro no servidor");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Algo deu errado ao requisitar as vagas!");
        }
    }
    
    

    try {
        vagas = await getVagas();

        vagas.forEach(vaga => {
            const { latitude, longitude, id, tipo} = vaga; 
           

            let pinoWidth = 26;
            let pinoHeight = (585/398) * pinoWidth;
            let urlIcon;

            if(tipo==="gratuita"){
                urlIcon = 'Imagens/pinolivre.png'
            } else if(tipo==="paga"){
                urlIcon = 'Imagens/pinopaga.png'
            } else if(tipo==="pcd"){
                urlIcon = 'Imagens/vagadeficiente.png'
            } 
            
            let customIcon = L.icon({
                iconUrl: urlIcon, 
                iconSize: [pinoWidth, pinoHeight], 
                iconAnchor: [pinoWidth/2, pinoHeight] 
            });
            const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            marker.bindPopup(`ID da Vaga: ${id}`);
            
        });
    } catch (error) {
       
        console.error("Erro ao buscar vagas:", error);
    }
}

const destino = document.getElementById('destino');
destino.addEventListener("keydown", function(event) {
    
    if (event.keyCode === 13) {
        calcularRota();
    }
});

function adicionarAreas(){
    const circleIfba = L.circle([-11.327659, -41.864420], {
        color: '#26462029',
        fillColor: '#9D9D9D3B',
        radius: 150
    }).addTo(map);
    const circleIgreja = L.circle([-11.303299, -41.857089], {
        color: '#26462029',
        fillColor: '#9D9D9D3B',
        radius: 180
    }).addTo(map);
    const circleCentro = L.circle([-11.303210, -41.853551], {
        color: '#26462029',
        fillColor: '#9D9D9D3B',
        radius: 200
    }).addTo(map);

    areas = [circleCentro, circleIfba, circleIgreja]
}
function mudar(){
    const botoes = document.querySelector("#botoes");
    const botao = document.getElementById("bntfiltro");
    const imagem = botao.querySelector("img");

    if (botao.style.backgroundColor!="white"){
        botao.style.backgroundColor= "white";
        imagem.src="Imagens/filtropreto.png";
        botoes.style.visibility = "visible"
    ''
    } else {
        botao.style.backgroundColor= "black";
        imagem.src="Imagens/filtro branco.png"
        botoes.style.visibility = "hidden";
    } 
}

function livre() {
    const botao = document.getElementById("btnLivre")

    if (botao.style.backgroundColor!="rgb(157, 157, 157)"){ 
        botao.style.backgroundColor= "#9D9D9D";
    } else {
        botao.style.backgroundColor= "#58D443";
    }
}

function paga() {
    const botao = document.getElementById("btnPaga")
    if (botao.style.backgroundColor!="rgb(70, 67, 212)"){ 
        botao.style.backgroundColor= "#4643D4";
    } else {
        botao.style.backgroundColor= "#9D9D9D";
    }
}
function deficiente(){
    const botao = document.getElementById("btnDeficiente")
    if (botao.style.backgroundColor!="rgb(67, 186, 212)"){ 
        botao.style.backgroundColor= "#43BAD4";
    } else {
        botao.style.backgroundColor= "#9D9D9D";
    }
}

function updateUserMarkerPosition(userPosition) {
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

function updateGeolocationTracking(){
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            userPosition = [lat, lng]
            if(routingControl.getWaypoints()[0].latLng != null){
                routingControl.setWaypoints([userPosition, destinoCoords])
                routingControl.route()
            }
            updateUserMarkerPosition(userPosition);
        });
    } else {
        console.log("Geolocalização não suportada pelo navegador.");
    }
}

function startGeolocationTracking() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        userPosition = [lat, lng]
        map.setView(userPosition, 19)
        updateUserMarkerPosition(userPosition);
    });
}

initMap();
startGeolocationTracking()
updateGeolocationTracking()
