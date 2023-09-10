document.addEventListener("DOMContentLoaded", function() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    var senha = document.getElementById("senha");
    var confsenha = document.getElementById("confsenha");
    const botao = document.getElementById("botaocad");
    const errorm = document.getElementById("error-message") 
    const msg = document.getElementById("mensagem")
   
    function cadastrar(dados) {
        fetch("http://localhost:8082/cliente", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(dados)
        })
        .then(function (res) {
            console.log(res);
            if (res.status === 200) {
                alert("Usuario cadastrado com sucesso")
                window.location.href = "mapa.html"
             
            } else {
                throw new Error("Erro no servidor");
            }
        })
        .catch(function (error) {
            console.error("Erro:", error);
            alert("Algo deu errado ao salvar os seus dados. Tente novamente!");
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
        
    } else {
        alert("Campos senha e confirmar senha diferentes!");
    }

}
    
});
