// data.js
let vagas;
let areas;
const markers = [];

export async function setVagas(map) {
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
                marker.vaga=tipo
                marker.bindPopup(`ID da Vaga: ${id}`);
                markers.push(marker)
            
        });
    } catch (error) {
       
        console.error("Erro ao buscar vagas:", error);
    }
}

export async function setAreas(map) {
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

export function filtroPorTipo(tipo, desativado) {
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
