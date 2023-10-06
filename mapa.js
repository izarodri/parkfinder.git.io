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
let destinoMarker = null;
let userPosition = null;
let vaga;
let areas;
const markers = [];
let destinoCoords;

//gg
function initMap() {
    
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
        const botoes = document.querySelector("#botoes");
        const mapa = document.querySelector("#map")
        mudar()
        topbar.style.visibility="hidden"
        botoes.style.visibility = 'hidden'
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

function voltarTop(){
    const topbar = document.querySelector(".top-bar")
    const mapa =document.querySelector("#map")
    topbar.style.visibility="visible"
    mapa.style.marginTop = "70px";
    mapa.style.height = "calc(100vh - 70px)";
    const zoomKeys = document.querySelector(".leaflet-control-zoom")
    const routeOption = document.querySelector(".leaflet-routing-container")
    const sairRota = document.getElementById("botaox")
    zoomKeys.style.visibility="visible"
    sairRota.style.visibility ="hidden"

    const infoDiv_1 = document.getElementById('info_1');
    const infoDiv_2 = document.getElementById('info_2');

    let mostrarDivInfo = document.getElementById('info_divEstrutura');
    mostrarDivInfo.style.display = 'none';
    routingControl.setWaypoints([])
    if (destinoMarker){
        map.removeLayer(destinoMarker);
    }
}

function calcularRota() {
    const destino = document.getElementById('destino').value;
    geocodificarEndereco(destino, function (destinoCoords) {
        isInArea = false
        let vagaEscolhida;

        if (areas != undefined) {  
            for (let index = 0; index < areas.length; index++) {
                const area = areas[index];
                isInArea = isCoordinateInsideCircle(destinoCoords[0], destinoCoords[1], area.latitude, area.longitude, area.raio);
                let counter = 0;
                if (isInArea) {
                    if (vagas != undefined){
                        while (true) {
                            numeroAleatorioInteiro = Math.floor(Math.random() * vagas.length);
                            vagaEscolhida = vagas[numeroAleatorioInteiro]
                            counter++
                            if (vagaEscolhida.idArea == area.id ){
                                break
                            }else if(counter == vagas.length){
                                vagaEscolhida = undefined
                                break
                            }
                            
                            
                        }
                        if (vagaEscolhida != undefined) {
                            routingControl.setWaypoints([userPosition, [vagaEscolhida.latitude, vagaEscolhida.longitude]]);
                            routingControl.route()  
                        }
                        
                    }
                }  
            }
        }   
        if (vagaEscolhida == undefined){
            routingControl.setWaypoints([userPosition, destinoCoords]);
            routingControl.route() 
            alert("Não encontramos nenhuma vaga perto da sua localização de destino!!")
            destinoMarker = L.marker(destinoCoords).addTo(map);
            console.log(destinoCoords)
        }

    });
}
//gg
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
//gg
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

            if(tipo === "normal"){
                urlIcon = 'Imagens/pinolivre.png'
            } else if(tipo === "paga"){
                urlIcon = 'Imagens/pinopaga.png'
            } else if(tipo === "pcd"){
                urlIcon = 'Imagens/vagadeficiente.png'
            } 

            let customIcon = L.icon({
                iconUrl: urlIcon, 
                iconSize: [pinoWidth, pinoHeight], 
                iconAnchor: [pinoWidth/2, pinoHeight] 
            });
            const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            marker.vaga=tipo
            marker.bindPopup(`ID da Vaga: ${id}`);
            markers.push(marker)
            
        });
    } catch (error) {
       
        console.error("Erro ao buscar vagas:", error);
    }
}
function conectarWebSocket() {
    const socket = new WebSocket('ws://seuservidor.com/websocket-endpoint');

    socket.addEventListener('open', (event) => {
        console.log('Conexão WebSocket estabelecida.');
    });

    socket.addEventListener('message', (event) => {
        const dadosAtualizados = JSON.parse(event.data);
        // Processar os dados atualizados (por exemplo, atualizar o mapa com as vagas).
        // Aqui, você pode adicionar lógica para atualizar o mapa com base nas atualizações recebidas.
    });

    socket.addEventListener('close', (event) => {
        console.log('Conexão WebSocket fechada.');
    });

    socket.addEventListener('error', (event) => {
        console.error('Erro na conexão WebSocket:', event);
    });
}

async function setAreas(map) {
    async function getAreas() {
        try {
            const response = await fetch("http://localhost:8082/area", {
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
            alert("Algo deu errado ao requisitar as Areas!");
        }
    }
    try {
        areas = await getAreas();

        areas.forEach(area => {
           const { latitude, longitude, raio} = area;
           L.circle([latitude, longitude], {
                color: '#26462029',
                fillColor: '#9D9D9D3B',
                radius: raio
            }).addTo(map);
        });
    } catch (error) {
        console.error("Erro ao buscar Areas:", error);
    }
}

const destino = document.getElementById('destino');
destino.addEventListener("keydown", function(event) {
    
    if (event.keyCode === 13) {
        calcularRota();
    }
});
//gg
function mudar(){
    const botoes = document.querySelector("#botoes");
    const botao = document.getElementById("bntfiltro");
    const imagem = botao.querySelector("img");

    if (botao.style.backgroundColor!="white"){
        botao.style.backgroundColor= "white";
        imagem.src="Imagens/filtropreto.png";
        botoes.style.visibility = "visible"
    } else {
        botao.style.backgroundColor= "black";
        imagem.src="Imagens/filtro branco.png"
        botoes.style.visibility = "hidden";
    } 
}
//gg
function filtroPorTipo(tipo, desativado) {
    markers.forEach(marker => {
        const vagaTipo = marker.vaga; // Obtém o tipo da vaga do marcador
       
        
        // Verifica se o tipo da vaga corresponde ao tipo desejado
        if (vagaTipo === tipo) {
           
            if (map.hasLayer(marker)) {
                map.removeLayer(marker); // Remove o marcador se estiver visível
            }else {
            
            
                if (!map.hasLayer(marker)) {
                    
                    marker.addTo(map); // Adiciona o marcador se estiver oculto
                }
            }
        } 
    });
}


function livre() {
    const botao = document.getElementById("btnLivre")
    
    if (botao.style.backgroundColor!=="rgb(88, 212, 67)" && botao.style.backgroundColor){ 
        botao.style.backgroundColor= "#58D443";
        filtroPorTipo("normal");
        
    } else {
        filtroPorTipo("normal");
        botao.style.backgroundColor= "#9D9D9D";
        
       
    }
}

function paga() {
    const botao = document.getElementById("btnPaga")

    if (botao.style.backgroundColor!=="rgb(70, 67, 212)" && botao.style.backgroundColor){ 
        filtroPorTipo("paga");
        botao.style.backgroundColor= "#4643D4";
    } else {
        botao.style.backgroundColor= "#9D9D9D";
        filtroPorTipo("paga");
    }
}
function deficiente(){
    const botao = document.getElementById("btnDeficiente")

    if (botao.style.backgroundColor!=="rgb(67, 186, 212)" && botao.style.backgroundColor){
        botao.style.backgroundColor= "#43BAD4"; 
        filtroPorTipo("pcd");
    } else {
        botao.style.backgroundColor= "#9D9D9D";
        filtroPorTipo("pcd");
    }
}
//gg
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

var options = {
    enableHighAccuracy: true, 
    maximumAge: 5000,          
    timeout: 10000             
};
//gg
function updateGeolocationTracking() {
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

function startGeolocationTracking() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        userPosition = [lat, lng];
        map.setView(userPosition, 19);
        updateUserMarkerPosition(userPosition);
    }, null, options);
}


initMap();
startGeolocationTracking()
updateGeolocationTracking()
//conectarWebSocket();