window.addEventListener('load', onload);

function onload(event) {
  const database = firebase.database();
  const select = document.getElementById("select-id");
  let chartD, chartT;

  function updateCharts(id) {
    if (!id) {
      console.log("Selecione um nó válido");
      return;
    }

    database.ref(id).on("value", (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const { data, hora, capacidade, disponivel } = userData;

        // Obter último valor de disponível
        const disponivelValue = disponivel[Object.keys(disponivel).pop()];
        if (disponivelValue < 1) {
          console.log("Não há dados suficientes para criar o gráfico");
          return;
        }

        // Calcular proporção de disponível em relação a capacidade
        const disponivelRatio = disponivelValue / capacidade;

        // calcula data de abastecimento de acordo com o disponivel
        let abastecer = disponivelRatio * 100;
        console.log(abastecer);

        document.getElementById("ultimo").textContent = data[Object.keys(data).pop()];
        if (abastecer >= 90) {
          const ultimoAbastecimento = moment(data[Object.keys(data).pop()], "DD-MM-YYYY");
          const dataProximo = ultimoAbastecimento.add(8, "days").format("DD-MM-YYYY");
          document.getElementById("proximo").textContent = dataProximo;
          console.log("Acima de 90");
        }
        else if (abastecer >= 70 && abastecer < 90) {
          const ultimoAbastecimento = moment(data[Object.keys(data).pop()], "DD-MM-YYYY");
          const dataProximo = ultimoAbastecimento.add(6, "days").format("DD-MM-YYYY");
          document.getElementById("proximo").textContent = dataProximo;
          console.log("entre 70 e 90");
        }
        else if (abastecer >= 50 && abastecer < 70) {
          const ultimoAbastecimento = moment(data[Object.keys(data).pop()], "DD-MM-YYYY");
          const dataProximo = ultimoAbastecimento.add(4, "days").format("DD-MM-YYYY");
          document.getElementById("proximo").textContent = dataProximo;
          console.log("entre 50 e 70");
        }
        else if (abastecer >= 30 && abastecer < 50) {
          const ultimoAbastecimento = moment(data[Object.keys(data).pop()], "DD-MM-YYYY");
          const dataProximo = ultimoAbastecimento.add(2, "days").format("DD-MM-YYYY");
          document.getElementById("proximo").textContent = dataProximo;
          console.log("entre 30 e 50");
        }
        else if (abastecer > 20 && abastecer < 30) {
          const ultimoAbastecimento = moment(data[Object.keys(data).pop()], "DD-MM-YYYY");
          const dataProximo = ultimoAbastecimento.add(1, "days").format("DD-MM-YYYY");
          document.getElementById("proximo").textContent = dataProximo;
          console.log("entre 20 e 30");
        }
        else if (abastecer <= 20) {
          document.getElementById("proximo").textContent = "URGENTE";
          console.log("menor do que 20");
        } else {
          console.log("erro");
        }

        // Destruir gráfico anterior, se existir
        if (chartD) {
          chartD.destroy();
        }

        // Criar gráfico de doughnut com as proporções

        chartD = new Chart(document.getElementById("chart-disponivel-disco"), {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [disponivelValue, capacidade - disponivelValue],
              backgroundColor: [
                'rgb(90, 214, 90)', // Verde para disponível
                'rgba(255, 130, 57, 30)' // Laranja para capacidade
              ],
              hoverOffset: 4
            }]
          },
          options: {
            cutoutPercentage: 70,
            animation: {
              animateScale: true
            },
            tooltips: {
              enabled: false
            },
            plugins: {
              doughnutlabel: {
                labels: [{
                  text: (disponivelRatio * 100).toFixed(0) + '%',
                  font: {
                    size: '12'
                  }
                }]
              }
            },
            responsive: true
          }
        });
        console.log("disponivelRatio", disponivelRatio);

        // Obter últimos 24 valores de disponível
        const disponivelArray = Object.values(disponivel);
        const last30Disponivel = disponivelArray.slice(-24);

        // Obter últimas 24 valores de hora
        const horaArray = Object.values(hora);
        const last30Hora = horaArray.slice(-24);


        if (last30Disponivel.length < 2) {
          console.log("Não há dados suficientes para criar o gráfico");
          return;
        }

        // Destruir gráfico anterior, se existir
        if (chartT) {
          chartT.destroy();
        }

        // Criar gráfico com os últimos 24 valores de disponível
        chartT = createConsumoDiario(last30Disponivel, last30Hora);

        console.log("Dados carregados com sucesso");
      } else {
        console.log("Dados não encontrados");
      }
    });
  }

  select.addEventListener("change", (event) => {
    const id = event.target.value;
    updateCharts(id);
  });
}

// Create Consumption Chart
function createConsumoDiario(last30Disponivel, last30Hora) {
  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'chart-disponivel',
      type: 'spline'
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: last30Hora
    },
    yAxis: {
      title: {
        text: 'Litros'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    series: [{
      name: 'ÚLTIMAS 24h',
      data: last30Disponivel
    }],
    plotOptions: {
      line: {
        marker: {
          enabled: false
        }
      }
    }
  });

  return chart;
}
