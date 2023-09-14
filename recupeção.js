document.addEventListener("DOMContentLoaded", function () {
  const num1 = document.getElementById("num1");
  const num2 = document.getElementById("num2");
  const num3 = document.getElementById("num3");
  const num4 = document.getElementById("num4");
  const aviso = document.getElementById("aviso")
  var codigoreal;
  var codigodig;
  const botaoadd = document.getElementById("botao");
  const botaosend = document.getElementById("botao1");
  const tempoSegundos = 40; 
  let tempoRestante = tempoSegundos;

  botaoadd.disabled = "true";
  botaoadd.style.backgroundColor = "#a0a0a0"
  botaoadd.style.borderColor = "#a0a0a0"
  botaoadd.setAttribute("title", "Envie o email primeiro")

  teste()

  function teste(){
  botaoadd.addEventListener('click', function () {
    if (num1.value !== "" && num2.value !== "" && num3.value !== "" && num4.value !== "") {
      codigodig = num1.value + num2.value + num3.value + num4.value;
      num1.style.borderColor="black"
      num2.style.borderColor="black"
      num3.style.borderColor="black"
      num4.style.borderColor="black"
      if (codigodig === codigoreal) {
        window.location.href = "novasenha.html"
      }
    } else {
      num1.style.borderColor="red"
      num2.style.borderColor="red"
      num3.style.borderColor="red"
      num4.style.borderColor="red"
    }
  });
}

  botaosend.addEventListener("click", function () {
    desativarBotao();
    aviso.innerText="Enviamos o código no seu e-mail";
    mandar();
    atualizarTemporizador();

    const intervalo = setInterval(function () {
      tempoRestante--;
      atualizarTemporizador();

      if (tempoRestante === 0) {
        clearInterval(intervalo);
        reativarBotao();
        tempoRestante = 40
      }
    }, 1000);
  });

  function atualizarTemporizador() {
    botaosend.innerText = ` Espere ${tempoRestante} segundos `;
  }

  function desativarBotao() {
    botaosend.disabled = true;
    botaosend.style.borderColor = "#a0a0a0"
    botaosend.style.backgroundColor = "#a0a0a0"
    botaosend.setAttribute("title", "Espere o tempo")

  }

  function reativarBotao() {
    botaosend.disabled = false;
    botaosend.style.backgroundColor = "black"; 
    botaosend.style.borderColor = "black"; 
    botaosend.innerText = "Enviar Email"; 
    botaoadd.removeAttribute("title")
  }

  function mandar() {
    fetch("http://localhost:8082/recovery", {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ destino: sessionStorage.getItem('email') })
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
          botaoadd.disabled = false;
          botaoadd.style.backgroundColor = "black"
          botaoadd.style.borderColor = "black"
          botaoadd.removeAttribute("title")
          viewCode();
        } else {
          alert("Deu errado");
        }
      })
      .catch(function (error) {
        console.error("Erro:", error);
        alert("Email incorreto!");
      });
  }

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
        teste()
      })
      .catch(function (error) {
        console.error("Erro:", error);
        alert("Algo deu errado!");
      })
  }
});
