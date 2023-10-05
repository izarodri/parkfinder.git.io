// route.js
let routingControl;

export function calcularRota() {
    const destino = document.getElementById('destino').value;
    geocodificarEndereco(destino, function (destinoCoords) {
        isInArea = false
        let vagaEscolhida

        if (areas != undefined) {  
            for (let index = 0; index < areas.length; index++) {
                const area = areas[index];
                isInArea = isCoordinateInsideCircle(destinoCoords[0], destinoCoords[1], area.latitude, area.longitude, area.raio);
                if (isInArea) {
                    if (vagas != undefined){
                        while (true) {
                            numeroAleatorioInteiro = Math.floor(Math.random() * vagas.length) + 1;
                            vagaEscolhida = vagas[numeroAleatorioInteiro]
                            if (vagaEscolhida.idArea == area.id){
                                break
                            }
                            
                        }
                        routingControl.setWaypoints([userPosition, [vagaEscolhida.latitude, vagaEscolhida.longitude]]);
                        routingControl.route()  
                    }
                }  
            }
        }   
        if (vagaEscolhida == undefined){
            routingControl.setWaypoints([userPosition, destinoCoords]);
            routingControl.route() 
            alert("Não encontramos nenhuma vaga perto da sua localização de destino!!")
            L.marker(destinoCoords).addTo(map);
        }

    });
}

export function isCoordinateInsideCircle(latitude, longitude, centroLatitude, centroLongitude, raio) {
    let coordenadaUsuario = L.latLng(latitude, longitude);
    let coordenadaCentro = L.latLng(centroLatitude, centroLongitude);
    let distance = coordenadaUsuario.distanceTo(coordenadaCentro);
    return distance <= raio;
}

export function geocodificarEndereco(endereco, callback) {
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
