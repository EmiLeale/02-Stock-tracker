function extraerTotalYCost(wallet) {
  const resultados = {};
  const categorias = ["crypto", "stocks", "forex", "index", "others"];

  for (const categoria of categorias) {
    if (wallet.hasOwnProperty(categoria) && Array.isArray(wallet[categoria])) {
      resultados[categoria] = wallet[categoria]
        .map((item) => {
          return {
            total:
              item.total !== undefined
                ? item.total
                : item.value !== undefined
                ? item.value
                : null,
            cost: item.cost !== undefined ? item.cost : null,
          };
        })
        .filter((item) => item.total !== null || item.cost !== null);
    } else {
      resultados[categoria] = [];
    }
  }
  return resultados;
}

const miWallet = JSON.parse(localStorage.getItem("wallet"));

const datosTotalYCost = extraerTotalYCost(miWallet);

// Filtrar las categorías donde tanto el total como el costo son cero
const categoriasFiltradas = Object.keys(datosTotalYCost).filter((categoria) => {
  const valores = datosTotalYCost[categoria];
  // Verificar si todos los objetos en la categoría tienen total y costo igual a cero
  return !valores.every(
    (item) =>
      (item.total === 0 || item.total === null) &&
      (item.cost === 0 || item.cost === null)
  );
});

// Preparar los datos para Chart.js con las categorías filtradas
const labels = categoriasFiltradas;
const totalesData = labels.map((categoria) => {
  const valores = datosTotalYCost[categoria]
    .map((item) => item.total)
    .filter((value) => value !== null);
  return valores.length > 0 ? valores[0] : 0;
});
const costosData = labels.map((categoria) => {
  const valores = datosTotalYCost[categoria]
    .map((item) => item.cost)
    .filter((value) => value !== null);
  return valores.length > 0 ? valores[0] : 0;
});

const ctx = document.getElementById("myChart").getContext("2d");
const miGrafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Total",
        data: totalesData,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Costo",
        data: costosData,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Valor (€)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Categoría",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Comparación de Total y Costo por Categoría",
        fontSize: 16,
      },
    },
  },
});
