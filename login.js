document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById("email");
    var senha = document.getElementById("senha");
    const botao = document.getElementById("botaocad");
    const linkrec = document.getElementById("linkrec");
    const rec = document.getElementById("message")
    var check = false
    var id

   
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

    function checarEmail(emailParam) {
      
        fetch("http://localhost:8082/check-email", {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email: emailParam})
        })
        .then(function (res) {
            if (res.status === 200) {
                return res.text(); 
            } else {
                throw new Error("Erro no servidor");
            }
        })
        .then(function (data) {
            if (data !=="naoexiste") {
                rec.innerText = ""
                check = true
                id = data
            } else {
                rec.innerText = "Email não existe no banco de dados!"
            }
        })
        
        
    }
    

    
    
    botao.addEventListener("click", mostrar);
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { 
            mostrar(event);
        }
    });
    

    linkrec.addEventListener("click", function(event){
        const emailv = email.value;
        if (emailv!==""){
            if (check){
                event.preventDefault
                const emailz = email.value
                sessionStorage.setItem("email", emailz)
                sessionStorage.setItem("id", id)
                window.location.href ="recuperação.html"
            }
        }else{
            rec.innerText="Digite o email para recuperar"
            email.style.borderColor = "red"
        }   

    })
    email.addEventListener("focus", function(event){
        email.style.borderColor = "white"
        rec.innerText = ""
    })
    email.addEventListener("blur", function (event) {
        event.preventDefault();
        const emaila = email.value;
        if (emaila) { // Verifique se o campo de e-mail não está vazio
            checarEmail(emaila);
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
