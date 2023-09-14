document.addEventListener("DOMContentLoaded", function () {
    const num1 = document.getElementById("num1");
    const num2 = document.getElementById("num2");
    const num3 = document.getElementById("num3");
    const num4 = document.getElementById("num4");
    var codigoreal;
    var codigodig;
    const botao = document.getElementById("botao");
    
    fetch("http://localhost:8082/recovery", {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ destino: sessionStorage.getItem('email') }) // Substitua 'sua_chave' pela chave correta
      
    })
      .then(function (res) {
        if (res.status === 200) {
          return res.text();
        } else {
          throw new Error("Erro no servidor");
        }
      })
      .then(function (data) {
        if (data === "enviado") {
          viewCode()
        } else {
          alert("Deu errado");
        }
      })
      .catch(function (error) {
        console.error("Erro:", error);
        alert("Email incorreto!");
      });
  
  function viewCode(){
      fetch("http://localhost:8082/retrieve")
        .then(function (res) {
          if (res.status === 200) {
            return res.text();
          } else {
            throw new Error("Erro no servidor");
          }
        })
        .then(function (data) {
          codigoreal = data;
          botao.addEventListener('click', function (event) {
            if (num1.value !== "" || num2.value !== "" || num3.value !== "" || num4.value !== "") {
              codigodig = num1.value + num2.value + num3.value + num4.value;
              if (codigodig === codigoreal) {
                window.location.href("")
              } else {
                alert("NOT OK");
              }
            }
          });
        })
        .catch(function (error) {
          console.error("Erro:", error);
          alert("Algo deu errado!");
        })
      }
        })