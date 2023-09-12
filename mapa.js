let map;
let routingControl;
const pontoPartida = [-11.303361, -41.855833];

function initMap() {
    // Cria um mapa Leaflet no elemento 'map' com zoom máximo
    map = L.map('map').setView(pontoPartida, 19);

    setVagas(map)

    // Adiciona um provedor de mapa (neste caso, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Inicializa o controle de roteamento
    routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        show: false // Impede a exibição automática de pop-ups
    }).addTo(map);

    // Adiciona um manipulador de eventos para capturar informações de rota
    routingControl.on('routesfound', function (e) {
        const routes = e.routes;
        const primeiraRota = routes[0]; // Vamos pegar a primeira rota

        // Acesse informações como tempo e distância
        const tempo = primeiraRota.summary.totalTime;
        const distancia = primeiraRota.summary.totalDistance;

        // Exiba as informações na div 'info'
        const infoDiv_1 = document.getElementById('info_1');
        const infoDiv_2 = document.getElementById('info_2');
        const infoDiv_3 = document.getElementById('info_3');
        const infoDiv_4 = document.getElementById('info_4');
        infoDiv_1.innerHTML = `Distância:`;
        infoDiv_2.innerHTML = `Duração:`;
        infoDiv_3.innerHTML = `${distancia}m`;
        infoDiv_4.innerHTML = `${tempo / 60}min`;
        //faz a div com o conteúdo aparecer na tela
        var mostrarDivInfo = document.getElementById('info_divEstrutura');
        mostrarDivInfo.style.display = 'block';
    });
}

function calcularRota() {
    // Obter o endereço de destino do formulário
    const destino = document.getElementById('destino').value;

    // Geocodificar o endereço de destino
    geocodificarEndereco(destino, function (destinoCoords) {
        // Configurar os pontos de partida (estático) e destino para o controle de roteamento
        routingControl.setWaypoints([pontoPartida, destinoCoords]);

        // Calcular a rota
        routingControl.route();
    });
}

function geocodificarEndereco(endereco, callback) {
    // Montar a URL da API
    const api_key = 'pk.637c496315cae65646ec465d593bf88e';
    const url = `https://us1.locationiq.com/v1/search.php?key=${api_key}&q=${endereco}&format=json`;

    // Fazer a solicitação à API
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
                const dados = await response.json(); // Parse a resposta JSON
                return dados;
            } else {
                throw new Error("Erro no servidor");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Algo deu errado ao requistar as vagas!");
        }
    }

    try {
        const vagas = await getVagas();

        vagas.forEach(vaga => {
            const { latitude, longitude, id } = vaga; 
            console.log(latitude, longitude);
            const marker = L.marker([latitude, longitude]).addTo(map);
        
            marker.bindPopup(`ID da Vaga: ${id}`);
        });
    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
    }
}


// Inicializa o mapa quando a página carrega
window.onload = function () {
    initMap();
};
