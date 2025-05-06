import ActualizeWalletPage from "./ActualizeWalletPage.js";

class WalletPageCharts extends ActualizeWalletPage {
  constructor() {
    super();

    this.waitForWalletUpdate().then(() => {
      this._clearWalletBtn.addEventListener(
        "click",
        this.actualizeWalletPage.bind(this)
      );
      this.firstChartWallet();
      this.secondChartWallet();
      this.actualizeListWallet();
    });
  }

  firstChartWallet() {
    const data = this.totalAndCost(this._wallet);
    const chartDataItems = Object.keys(data)
      .filter((category) => {
        const values = data[category];
        const isTotalZeroOrNull = values.total == null || values.total === 0;
        const isCostZeroOrNull = values.cost == null || values.cost === 0;
        return !(isTotalZeroOrNull && isCostZeroOrNull);
      })
      .map((categoryName) => {
        let label = "";
        if (categoryName.length > 0) {
          label =
            categoryName.charAt(0).toUpperCase() +
            categoryName.slice(1).toLowerCase();
        }
        return {
          key: categoryName,
          label: label,
        };
      });

    const labels = chartDataItems.map((item) => item.label);

    const perData = chartDataItems.map((item) => {
      const categoryData = data[item.key];
      const rest = this.formatNumber(
        (categoryData.cost / this._wallet.total[0].cost) * 100
      );

      return categoryData ? rest : 0;
    });

    const ctx = document.getElementById("dounut-wallet-chart").getContext("2d");
    const Graph = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: perData,
            borderWidth: 1,
            backgroundColor: [
              "rgba(0, 200, 255, 0.8)",
              "rgba(175, 125, 255, 0.8)",
              "rgba(100, 175, 255, 0.8)",
              "rgba(150, 150, 255, 0.8)",
              "rgba(220, 200, 255, 0.8)",
            ],
            hoverOffset: 30,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              filter: function (legendItem, data) {
                return false;
              },
            },
            title: {
              display: true,
              text: "Asset Allocation (%)",
              font: {
                size: 16,
              },
            },
            legend: {
              display: true,
            },
          },
        },
      },
    });
  }

  secondChartWallet() {
    const data = this.getAllItems(this._wallet);

    const ctx = document.getElementById("pie-wallet-chart").getContext("2d");
    const Graph = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((i) => i.symbol),
        datasets: [
          {
            data: data.map((i) => i.total),
            borderWidth: 1,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              filter: function (legendItem, data) {
                return false;
              },
            },
            title: {
              display: true,
              text: "Portfolio Summary ($)",
              font: {
                size: 16,
              },
            },
          },
        },
      },
    });
  }
}

export default WalletPageCharts;
