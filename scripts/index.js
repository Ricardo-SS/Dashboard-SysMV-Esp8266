const loginElement = document.querySelector('#login-form');
//const menuElement = document.querySelector('#navbar');
const menuElement = document.querySelector('#navbar');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");
const dispositivoElement = document.querySelector("#card-dispositivo");

// gerenciar login/logut interface do usuário
const setupUI = (user) => {
    if (user) {
        // alternar elementos da interface do usuário
        loginElement.style.display = 'none';
        menuElement.style.display = 'block';
        contentElement.style.display = 'block';
        authBarElement.style.display = 'block';
        userDetailsElement.style.display = 'block';
        dispositivoElement.style.display = 'block';
        userDetailsElement.innerHTML = user.email;

        // obter UID do usuário para obter dados do banco de dados
        var uid = user.uid;
        console.log(uid);


        // codigo responsavel por carregar os nós no select id
        const selectElement = document.getElementById("select-id");
        const database = firebase.database();

        function atualizarSelect(snapshot) {
            const data = snapshot.val();

            // Limpa todos os itens do select exceto o primeiro
            while (selectElement.options.length > 1) {
                selectElement.remove(1);
            }

            // Adiciona uma opção para cada nó encontrado no Firebase
            for (let key in data) {
                const option = document.createElement("option");
                option.value = key;
                option.text = key;
                selectElement.add(option);
            }
        }

        // Escuta por mudanças no nó "raiz" do Firebase
        database.ref().on("value", atualizarSelect);
        // fim da carga de nós -----------------------------------------------

        //lendo dados do firebase de acordo com o id selecionado ----------------------------
        //const database = firebase.database();
        const select = document.getElementById("select-id");

        select.addEventListener("change", () => {
            const idSelecionado = select.value;
            database.ref(idSelecionado).on("value", (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const { data, hora, capacidade, disponivel, ip } = userData;
                    document.getElementById("disponivel").textContent = disponivel[Object.keys(disponivel).pop()].toFixed(2);
                    document.getElementById("capacidade").textContent = capacidade.toFixed(2);
                    document.getElementById("data").textContent = data[Object.keys(data).pop()];
                    document.getElementById("hora").textContent = hora[Object.keys(hora).pop()];
                    //document.getElementById("id_chip").textContent = id_chip;
                    document.getElementById("ip").textContent = ip;
                    //document.getElementById("latitude").textContent = latitude;
                    //document.getElementById("longitude").textContent = longitude;

                    // Cálculo da média diária dos últimos 24 valores de disponível
                    const disponivelArray = Object.values(disponivel);
                    const last30Disponivel = disponivelArray.slice(-24);
                    // const somaDisponivel = last30Disponivel.reduce((acc, val) => acc + val, 0);
                    // const mediaDiaria = somaDisponivel / 24;
                    // document.getElementById("media-diaria").textContent = mediaDiaria.toFixed(2);

                    let consumoDiario = [];
                    let consumoMensal = {};
                    
                    function verificarConsumo(consumoArrayDia) {
                      if (consumoArrayDia.length > 1) {
                        let i = 1;
                        while (i < consumoArrayDia.length) {
                          if (consumoArrayDia[i] < consumoArrayDia[i - 1]) {
                            consumoDiario.push(consumoArrayDia[i - 1] - consumoArrayDia[i]);
                          }
                          i++;
                        }
                        console.log("entrou", consumoDiario);
                      }
                    
                      let somaConsumoDiario = 0;
                      // Se a variável consumoDiario já tiver recebido 24 valores, calcula a média e adiciona ao consumoMensal com a data atual como chave
                      somaConsumoDiario = consumoDiario.reduce((acc, val) => acc + val, 0);
                      if (consumoDiario.length === 24) {
                        const dataAtual = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                        consumoMensal[dataAtual] = somaConsumoDiario;
                        consumoDiario = [];
                      }
                    
                      // Atualiza o texto do elemento HTML com o valor da soma do consumo diário
                      document.getElementById("consumoDiario").textContent = somaConsumoDiario.toFixed(2);
                    
                      // Código para agendar a execução da função à meia-noite
                      const agora = new Date();
                      const proximaMeiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
                      proximaMeiaNoite.setHours(0, 0, 0, 0);
                      const tempoAteMeiaNoite = proximaMeiaNoite.getTime() - agora.getTime();
                      setTimeout(() => verificarConsumo(last30Disponivel), tempoAteMeiaNoite);
                    
                      console.log('array dia criado');
                    }
                    
                    verificarConsumo(last30Disponivel);
                } else {
                    console.log("Dados não encontrados");
                }
            });
        });

        // Atualiza com os dados do primeiro id selecionado
        const idSelecionado = select.value;
        database.ref(idSelecionado).once("value", (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                const { data, hora, latitude, longitude, capacidade, disponivel, id_chip, ip } = userData;
                document.getElementById("disponivel").textContent = disponivel[Object.keys(disponivel).pop()].toFixed(2);
                document.getElementById("capacidade").textContent = capacidade.toFixed(2);
                document.getElementById("data").textContent = data[Object.keys(data).pop()];
                document.getElementById("hora").textContent = hora[Object.keys(hora).pop()];
                //document.getElementById("id_chip").textContent = id_chip;
                document.getElementById("ip").textContent = ip;
                //document.getElementById("latitude").textContent = latitude;
                //document.getElementById("longitude").textContent = longitude;

            } else {
                console.log("Dados não encontrados");
            }
        });
        //lendo dados do firebase de acordo com o id selecionado ----------------------

    } else {
        // alternar elementos da interface do usuário
        loginElement.style.display = 'block';
        dispositivoElement.style.display = 'none';
        menuElement.style.display = 'none';
        authBarElement.style.display = 'none';
        userDetailsElement.style.display = 'none';
        contentElement.style.display = 'none';
    }
}


