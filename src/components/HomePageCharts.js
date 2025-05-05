import ActualizeHomePage from "./ActualizeHomePage.js";

class HomePageCharts extends ActualizeHomePage {
  constructor() {
    super();
    this._categorys = ["crypto", "stocks", "forex", "index", "others"];

    this.waitForWalletUpdate().then(() => {
      this.categoryTotalChart();
      this.highestTotalChart();
    });
  }

  totalAndCost(wallet) {
    const results = {};

    for (const category of this._categorys) {
      if (wallet[category] && wallet[category].length > 0) {
        const lastItem = wallet[category][wallet[category].length - 1];
        results[category] = {
          total: lastItem.value || 0,
          cost: lastItem.cost || 0,
        };
      } else {
        results[category] = { total: 0, cost: 0 };
      }
    }

    return results;
  }
  categoryTotalChart() {
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

    const totalsData = chartDataItems.map((item) => {
      const categoryData = data[item.key];
      return categoryData ? categoryData.total : 0;
    });
    const costsData = chartDataItems.map((item) => {
      const categoryData = data[item.key];
      return categoryData ? categoryData.cost : 0;
    });

    const ctx = document.getElementById("categories-chart").getContext("2d");
    const Graph = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Cost",
            data: costsData,
            backgroundColor: "rgba(0, 200, 255, 0.8)",
            borderColor: "rgba(0, 200, 255, 1)",
            borderWidth: 1,
          },
          {
            label: "Value",
            data: totalsData,
            backgroundColor: "rgba(100, 200, 255, 0.8)",
            borderColor: "rgba(100, 200, 255, 1)",
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
              text: "Value",
            },
          },
          x: {
            title: {
              display: true,
              text: "Category",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Total for category",
            fontSize: 16,
          },
          legend: {
            display: true,
          },
        },
      },
    });
  }

  findCategoryWithHighestTotal(wallet) {
    let highestTotal = -Infinity;
    let categoryWithHighestTotal = null;

    if (!wallet) {
      console.warn(
        "Wallet object is null or undefined in findCategoryWithHighestTotal."
      );
      return { categoryName: null, investments: [], totalValue: 0 };
    }

    for (const category of this._categorys) {
      const items = wallet[category];

      if (items && items.length > 0) {
        const lastItem = items[items.length - 1];

        const currentCategoryTotal =
          lastItem.value == null ? 0 : lastItem.value;

        if (currentCategoryTotal > highestTotal) {
          highestTotal = currentCategoryTotal;
          categoryWithHighestTotal = category;
        }
      }
    }

    const investmentsInHighestCategory = categoryWithHighestTotal
      ? wallet[categoryWithHighestTotal] || []
      : [];

    return {
      categoryName: categoryWithHighestTotal,
      totalValue: categoryWithHighestTotal ? highestTotal : 0,
      investments: investmentsInHighestCategory,
    };
  }

  highestTotalChart() {
    const highestCategoryData = this.findCategoryWithHighestTotal(this._wallet);

    const investmentsInHighestCategory = highestCategoryData.investments;
    const highestCategoryName = highestCategoryData.categoryName;
    const investmentsToChart = investmentsInHighestCategory.slice(0, -1);

    if (
      investmentsToChart.length > 0 &&
      investmentsInHighestCategory.length > 0
    ) {
      const itemLabels = investmentsToChart.map(
        (item) => item.symbol || "Unknown Item"
      );

      const itemTotalsData = investmentsToChart.map((item) =>
        item.total == null ? 0 : item.total
      );

      const itemCostsData = investmentsToChart.map(
        (item) => (item.value = this.actualValue(item.units, item.symbol))
      );

      const ctx = document.getElementById("wallet-chart").getContext("2d");

      if (highestCategoryName === "others") {
        const investmentsChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: itemLabels,
            datasets: [
              {
                label: "Cost",
                data: itemTotalsData,
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgba(75, 192, 192, 1)",
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
                  text: "Value",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Investment Ticker",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: `Investments in ${
                  highestCategoryName
                    ? highestCategoryName.charAt(0).toUpperCase() +
                      highestCategoryName.slice(1).toLowerCase()
                    : "Highest Value"
                }`,
                fontSize: 16,
              },
              legend: {
                display: true,
              },
            },
          },
        });
      } else {
        const investmentsChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: itemLabels,
            datasets: [
              {
                label: "Cost",
                data: itemTotalsData,
                backgroundColor: "rgba(0, 200, 255, 0.8)",
                borderColor: "rgba(0, 200, 255, 1)",
                borderWidth: 1,
              },
              {
                label: "Value",
                data: itemCostsData,
                backgroundColor: "rgba(100, 200, 255, 0.8)",
                borderColor: "rgba(100, 200, 255, 1)",
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
                  text: "Value",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Investment Ticker",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: `Investments in ${
                  highestCategoryName
                    ? highestCategoryName.charAt(0).toUpperCase() +
                      highestCategoryName.slice(1).toLowerCase()
                    : "Highest Value"
                }`,
                fontSize: 16,
              },
              legend: {
                display: true,
              },
            },
          },
        });
      }
    }
  }
}

export default HomePageCharts;
