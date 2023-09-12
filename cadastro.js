document.addEventListener("DOMContentLoaded", function() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    var senha = document.getElementById("senha");
    var confsenha = document.getElementById("confsenha");
    const botao = document.getElementById("botaocad");
    const errorm = document.getElementById("error-message") 
    var check = false;
    
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            mostrar(event);
        }
    });
   
    function cadastrar(dados) {
        event.preventDefault();
        fetch("http://localhost:8082/cliente", {
            headers: {
                'Accept': 'application/json',
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


            if (data === "ok") {
                check = true
                alert("Usuario cadastrado com sucesso")
                window.location.href = "login.html";
               
            } 
        })
        .catch(function (error) {
            console.error("Erro:", error);
            alert("Email digitado já está cadastrado!");
        });
    }

    botao.addEventListener("click", mostrar);

    confsenha.addEventListener("input", verificarSenha);

    function verificarSenha(){
        const senhaValue = senha.value;
        const confsenhaValue = confsenha.value;

        if (senhaValue !== confsenhaValue && confsenhaValue!==""  && senhaValue!="") {
            errorm.innerText = "Campo senha e confirmar senha são diferentes!"
            
    }
         else{
            errorm.innerText = "";
            return true
            
         }
}
function mostrar(event) {
    event.preventDefault();
  

    if (nome.value === "" || email.value === "" || senha.value === "" || confsenha.value === "") {
        alert("Preencha todos os campos antes de prosseguir.");
        return;
    }

    if (verificarSenha()) {
        const dados = {
            nome: nome.value,
            email: email.value,
            senha: senha.value,
            latitude: 0,
            longitude: 0
        };
        cadastrar(dados);
        if(check){
        const dados = {
            nome: nome.value,
            email: email.value,
            senha: senha.value,
            latitude: 0,
            longitude: 0
        };
        cadastrar(dados);
    }
    } else {
        alert("Campos senha e confirmar senha diferentes!");
    }

}
    
});
