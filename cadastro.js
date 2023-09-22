document.addEventListener("DOMContentLoaded", function() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    var senha = document.getElementById("senha");
    var confsenha = document.getElementById("confsenha");
    const botao = document.getElementById("botaocad");
    const errorm = document.getElementById("error-message") 
    var check = false;

    // Adiciona um evento de clique ao botão de cadastro
    botao.addEventListener("click", function(event) {
        event.preventDefault();

        // Limpa mensagens de erro anteriores
        errorm.innerText = '';

        // Verifica se os campos estão vazios e destaque o placeholder em vermelho
        let camposVazios = false;

        if (nome.value === "") {
            mostrarErro(nome, "", "error-nome");
            substituirPlaceholder(nome, "Campo obrigatório");
            camposVazios = true;
        }

        if (email.value === "") {
            mostrarErro(email, "", "error-email");
            substituirPlaceholder(email, "Campo obrigatório");
            camposVazios = true;
        }

        if (senha.value === "") {
            mostrarErro(senha, "", "error-senha");
            substituirPlaceholder(senha, "Campo obrigatório");
            camposVazios = true;
        }

        if (confsenha.value === "") {

            mostrarErro(confsenha, "", "error-confsenha");
            substituirPlaceholder(confsenha, "Campo obrigatório");
            camposVazios = true;
        }

        if (verificarSenha()) {
            const dados = {
                nome: nome.value,
                email: email.value,
                senha: senha.value,
                latitude: 0,
                longitude: 0
            };
            
        } else {
            mostrarErro(senha, "", "error-senha");
            substituirPlaceholder(senha, "Campo senha e confirmar senha estão diferentes!");
            mostrarErro(confsenha, "", "error-confsenha");
            substituirPlaceholder(confsenha, "Campo senha e confirmar senha estão diferentes!");
            
        }
    })

                // Adiciona um ouvinte de evento de entrada para cada campo
        nome.addEventListener("input", function () {
        alterarCorBorda(nome);
        });
    
        email.addEventListener("input", function () {
        alterarCorBorda(email);
        });
    
        senha.addEventListener("input", function () {
        alterarCorBorda(senha);
        });
    
        confsenha.addEventListener("input", function () {
        alterarCorBorda(confsenha);
        });
    
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            mostrar(event);
        }
    });
   

    function cadastrar(dados) {

        if (nome.value === "" || email.value === "" || senha.value === "" || confsenha.value === "") {
            return;
        }
        event.preventDefault();
        fetch("http://localhost:8082/salvar-cliente", {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: "POST",
            
            body: JSON.stringify(dados)
        })
        // Resto do código...
        
        .then(function (res) {
            if (res.status === 200) {
                return res.text(); 
            } else {
                throw new Error("Erro no servidor");
            }
        })
        .then(function (data) {

            if (data === "ok") {
                check = true
                window.location.href = "login.html";
               
            } 
        })
                .catch(function (error) {
            console.error("Erro:", error);
            mostrarErro(email, "O email digitado já está cadastrado!", "error-email");
            substituirPlaceholder(email, "Digite outro endereço de email!");   
        });
    }

    botao.addEventListener("click", mostrar);

    confsenha.addEventListener("input", verificarSenha);

    function verificarSenha(){
        const senhaValue = senha.value;
        const confsenhaValue = confsenha.value;

        if (senhaValue !== confsenhaValue && confsenhaValue!==""  && senhaValue!=="") {
            errorm.innerText = "Campo senha e confirmar senha são diferentes!"
            
    }
         else{
            errorm.innerText = "";
            return true
            
         }
}
    function mostrar(event) {
    event.preventDefault();
  
    if (verificarSenha()) {
        const dados = {
            nome: nome.value,
            email: email.value,
            senha: senha.value,
            latitude: 0,
            longitude: 0
        };
        cadastrar(dados);
     
    } else {
        mostrarErro(confsenha, "", "error-confsenha");
    }

}

    function mostrarErro(campo, mensagem, erroId) {
    campo.style.border = '2px solid red';
    campo.classList.add("placeholder-red");
    var errorDiv = document.getElementById(erroId);
    errorDiv.innerHTML = mensagem;

    errorDiv.style.fontSize = '12px'; // Define o tamanho da fonte
    errorDiv.style.color = 'red';
    }

    // Função para alterar a cor da borda
    function alterarCorBorda(campo) {
    if (campo.value == "") {
        campo.style.borderColor = "red"; 
    } else {
        campo.style.borderColor = "black"; 
    }
}

    function substituirPlaceholder(campo, novoPlaceholder){
        campo.setAttribute('placeholder', novoPlaceholder)
    }
});