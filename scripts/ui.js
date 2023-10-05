// ui.js

export function mudar() {
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


export function livre() {
    const botao = document.getElementById("btnLivre")
    
    if (botao.style.backgroundColor!=="rgb(88, 212, 67)" && botao.style.backgroundColor){ 
        botao.style.backgroundColor= "#58D443";
        filtroPorTipo("gratuita");
        
    } else {
        filtroPorTipo("gratuita");
        botao.style.backgroundColor= "#9D9D9D";
        
       
    }
}

export function paga() {
    const botao = document.getElementById("btnPaga")

    if (botao.style.backgroundColor!=="rgb(70, 67, 212)" && botao.style.backgroundColor){ 
        filtroPorTipo("paga");
        botao.style.backgroundColor= "#4643D4";
    } else {
        botao.style.backgroundColor= "#9D9D9D";
        filtroPorTipo("paga");
    }
}

export function deficiente() {
    const botao = document.getElementById("btnDeficiente")

    if (botao.style.backgroundColor!=="rgb(67, 186, 212)" && botao.style.backgroundColor){
        botao.style.backgroundColor= "#43BAD4"; 
        filtroPorTipo("pcd");
    } else {
        botao.style.backgroundColor= "#9D9D9D";
        filtroPorTipo("pcd");
    }
}

export function voltarTop() {
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
}
