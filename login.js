document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById("email");
    var senha = document.getElementById("senha");
    const botao = document.getElementById("botaocad");

   
    function logar(dados) {
        fetch("http://localhost:8082/login", {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(dados)
        })
        .then(function (res) {
            if (res.status === 200) {
                return res.text(); 
            } else {
                throw new Error("Erro no servidor");
            }
        })
        .then(function (data) {

    

            if (data === "Login bem-sucedido") {
                window.location.href = "mapa.html";
            } else {
                alert(data);
            }
        })
        .catch(function (error) {
            console.error("Erro:", error);
            alert("Dados incorretos!");
        });
    }
    
    botao.addEventListener("click", mostrar);
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { 
            mostrar(event);
        }
    });

    

function mostrar(event) {
    event.preventDefault();

    if (email.value === "" || senha.value === "" ) {
        alert("Preencha todos os campos antes de prosseguir.");
        return;
    }else{

        const dados = {
            email: email.value,
            senha: senha.value
        }
        logar(dados)
        
    }

}
    
})
