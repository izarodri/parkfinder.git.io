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
            console.log(e.routes[0])
            const routes = e.routes;
            const primeiraRota = routes[0]; // Vamos pegar a primeira rota

            // Acesse informações como tempo e distância
            const tempo = primeiraRota.summary.totalTime;
            const distancia = (primeiraRota.summary.totalDistance)

            // Exiba as informações na div 'info'
            const infoDiv_1 = document.getElementById('info_1');
            const infoDiv_2 = document.getElementById('info_2');
            const tempo1 = (tempo / 60).toFixed(2)
            infoDiv_1.innerHTML = `${distancia}m`;
            infoDiv_2.innerHTML = `${tempo1}min`;
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
            routingControl.setWaypoints([userPosition, destinoCoords]);

            // Calcular a rota
            setTimeout(routingControl.route(), 10);
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
                    console.log(latitude, longitude)
                    console.log(resultado)
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
                const { latitude, longitude, id, tipo} = vaga; 

                var urlIcon;
                if(tipo==="gratuita"){ //relativo ao tipo de vaga, terá determinada cor, neste caso é gratuita

                    urlIcon = 'imagens/pinolivre.png'

                }else if(tipo==="paga"){

                    urlIcon = 'imagens/pinopaga.png.png'

                }else if(tipo==="PCD"){

                    urlIcon = 'imagens/vagadeficiente.png'

                }else if (tipo === "PCD")
                var customIcon = L.icon({
                    iconUrl: urlIcon, 
                    iconSize: [32, 52], 
                    iconAnchor: [16, 32] 
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

    function mudar(){
        const botoes = document.getElementsByClassName("botoes");
        const botao = document.getElementById("bntfiltro");
        const imagem = botao.querySelector("img");
        if (botao.style.backgroundColor!="white"){
            botao.style.backgroundColor= "white";
            imagem.src="Imagens/filtropreto.png";
            botoes.style.visibility = "visible";
        }else{
            botao.style.backgroundColor= "black";
            imagem.src="Imagens/filtro branco.png"
            botoes.style.visibility = "hidden"
        } 
    }
    
    function livre() {
        
        const botao = document.getElementById("btnLivre")
        if (botao.style.backgroundColor!="rgb(157, 157, 157)"){ 
            botao.style.backgroundColor= "#9D9D9D";
        }else {
            botao.style.backgroundColor= "#58D443";
        }
    }
    
    function paga() {
        
        const botao = document.getElementById("btnPaga")
        if (botao.style.backgroundColor!="rgb(70, 67, 212)"){ 
            botao.style.backgroundColor= "#4643D4";
        }else {
            botao.style.backgroundColor= "#9D9D9D";
        }
    }
    function deficiente(){
        const botao = document.getElementById("btnDeficiente")
        if (botao.style.backgroundColor!="rgb(67, 186, 212)"){ 
            botao.style.backgroundColor= "#43BAD4";
        }else {
            botao.style.backgroundColor= "#9D9D9D";
        }
    }
    function startGeolocationTracking(position){
        if (userMarker) {
             map.removeLayer(userMarker); // Remove o marcador anterior, se existir
        }
        map.setView(position);
        userMarker = L.marker(position).addTo(map);
    }
    function startGeolocationTrackingReturn() {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(function (position) {
                userPosition = [position.coords.latitude, position.coords.longitude];
                startGeolocationTracking(userPosition);
            }, function (error) {
                console.error('Erro na geolocalização:', error);
                alert('Não foi possível obter a localização do usuário.');
            });
        } else {
            alert('Geolocalização não suportada neste navegador.');
        }
    }
        initMap();
        startGeolocationTrackingReturn();  
