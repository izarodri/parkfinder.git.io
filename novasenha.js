document.addEventListener("DOMContentLoaded", function() {
    const senha = document.getElementById("senha");
    const confsenha = document.getElementById("confsenha");
    const botao = document.querySelector(".center-button");
    const mensagem =  document.getElementById("error-message")

    confsenha.addEventListener("input", verificarSenha);

    function verificarSenha(){
        const senhaValue = senha.value;
        const confsenhaValue = confsenha.value;

        if (senhaValue !== confsenhaValue && confsenhaValue!==""  && senhaValue!=="") {
            mensagem.innerText = "Campo senha e confirmar senha são diferentes!"
            senha.style.borderColor="red"
            confsenha.style.borderColor="red"
            
    }
         else{
            mensagem.innerText = "";
            return true
            
         }
    }


    function mostrar(event) {
        event.preventDefault
    
        if (senha.value === "" || confsenha.value === "") {
            
            return;
        }else{
            senha.style.borderColor="white"
            confsenha.style.borderColor="white"
    
            if (verificarSenha()) {
                const senhadados = {
                    id: sessionStorage.getItem("id"),
                    senha: senha.value
                };

                atualizarSenha(senhadados);
                
            
            } else {
                senha.style.borderColor="red"
                confsenha.style.borderColor="red"
        }
        }
    }
    function atualizarSenha(senha) {
      
        fetch("http://localhost:8082/update-password", {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(senha)
        })
        .then(function (res) {
            if (res.status === 200) {
                return res.text(); 
            } else {
                throw new Error("Erro no servidor");
            }
        })
        .then(function (data) {
            if (data ==="atualizada") {
                alert("Senha atualizada com sucesso!")
                window.location.href =  "login.html"
                
            } else {
                alert("Algo deu errado ao salvar sua senha!")
            }
        })
        
        
    }

    senha.addEventListener("focus", function(event){
        event.preventDefault()
        if (verificarSenha){
            senha.style.borderColor="white"
            confsenha.style.borderColor="white"
        }
    })
    confsenha.addEventListener("input", verificarSenha)
    botao.addEventListener("click", mostrar)
        

})