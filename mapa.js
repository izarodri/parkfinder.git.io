        let map;
        let routingControl;
        const pontoPartida = [-11.303361, -41.855833];
        
        function initMap() {
            // Cria um mapa Leaflet no elemento 'map' com zoom máximo
            map = L.map('map').setView(pontoPartida, 19);

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
                infoDiv_1.innerHTML = `Distância: ${distancia}m<br>Duração: ${tempo}min`;
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

        // Inicializa o mapa quando a página carrega
        window.onload = function () {
            initMap();
        };