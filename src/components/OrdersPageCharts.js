import ActualizeOrdersPage from "./ActualizeOrdersPage.js";

class OrdersPageCharts extends ActualizeOrdersPage {
  constructor() {
    super();
    this.waitForWalletUpdate().then(() => {
      this.actualizeListOrders();
      this.ordersCharts();

      this._clearWalletBtn.addEventListener(
        "click",
        this.actualizeOrdersPage.bind(this)
      );
      this._editButtons = document.querySelectorAll('button[id^="edit-"]');
      this._editButtons.forEach((button) => {
        button.addEventListener("click", this.editOrder.bind(this));
      });
      this._deleteButtons = document.querySelectorAll('button[id^="delete-"]');
      this._deleteButtons.forEach((button) => {
        button.addEventListener("click", this.deleteOrder.bind(this));
      });
    });
  }

  ordersCharts() {
    const { buyOrders, sellOrders } = this.separateOrdersByType(this._orders);
    const allDates = [
      ...buyOrders.map((order) => order.date),
      ...sellOrders.map((order) => order.date),
    ];

    const uniqueSortedDates = Array.from(new Set(allDates)).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
    });

    const dailyBuyTotals = {};
    buyOrders.forEach((order) => {
      const total =
        typeof order.total === "string"
          ? parseFloat(order.total.replace(/[^0-9.-]+/g, ""))
          : order.total;

      const orderDate = order.date;
      if (!dailyBuyTotals[orderDate]) {
        dailyBuyTotals[orderDate] = 0;
      }
      dailyBuyTotals[orderDate] += total;
    });

    const dailySellTotals = {};
    sellOrders.forEach((order) => {
      const totalSell =
        typeof order.total === "string"
          ? parseFloat(order.total.replace(/[^0-9.-]+/g, ""))
          : order.total;

      const orderDate = order.date;
      if (!dailySellTotals[orderDate]) {
        dailySellTotals[orderDate] = 0;
      }
      dailySellTotals[orderDate] += totalSell;
    });

    const chartLabels = uniqueSortedDates;
    const buyDataForChart = uniqueSortedDates.map(
      (date) => dailyBuyTotals[date] || 0
    );
    const sellDataForChart = uniqueSortedDates.map(
      (date) => dailySellTotals[date] || 0
    );
    const sellDates = (sellOrders || []).map((order) => order.date);
    const uniqueSortedSellDates = Array.from(new Set(sellDates)).sort(
      (a, b) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number);
        const [dayB, monthB, yearB] = b.split("/").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
      }
    );
    const dailySellPLTotals = {};
    const dailySellPLCounts = {};
    (sellOrders || []).forEach((order) => {
      const pl =
        typeof order.pl === "string"
          ? parseFloat(order.pl.replace(/[^0-9.-]+/g, ""))
          : order.pl;

      const orderDate = order.date;

      if (!dailySellPLTotals[orderDate]) {
        dailySellPLTotals[orderDate] = 0;
      }
      if (!dailySellPLCounts[orderDate]) {
        dailySellPLCounts[orderDate] = 0;
      }

      dailySellPLTotals[orderDate] += pl;
      dailySellPLCounts[orderDate]++;
    });
    const dailySellPLData = uniqueSortedSellDates.map((date) => {
      const totalPL = dailySellPLTotals[date] || 0;
      const count = dailySellPLCounts[date] || 0;
      return count > 0 ? totalPL / count : 0;
    });

    if (
      this.transactionVolumeChartInstance ||
      this.transactionVolumeChartInstance
    ) {
      this.transactionVolumeChartInstance.destroy();
      this.transactionVolumeChartInstance.destroy();
    }

    this.transactionVolumeChart = new Chart(
      document.getElementById("transaction-volume-chart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: "Daily Buy Volume",
              data: buyDataForChart,
              backgroundColor: "rgba(0, 200, 255, 0.8)",
            },
            {
              label: "Daily Sell Volume",
              data: sellDataForChart,
              backgroundColor: "rgba(200, 100, 255, 0.8)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Daily Buys and Sells",
              font: {
                size: 16,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
              stacked: true,
              type: "category",
              labels: chartLabels,
            },
            y: {
              title: {
                display: true,
                text: "Value ($)",
              },
              beginAtZero: true,
              stacked: true,
            },
          },
        },
      }
    );
    this.transactionVolumeChartInstance = new Chart(
      document.getElementById("profit-line-chart").getContext("2d"),
      {
        type: "line",
        data: {
          labels: uniqueSortedSellDates,
          datasets: [
            {
              label: "Daily P / L %",
              data: dailySellPLData,
              borderColor: "rgba(0, 200, 255, 0.8)",
              backgroundColor: "rgba(0, 200, 255, 1)",
              fill: false,
              tension: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Daily Profit and Losses",
              font: {
                size: 16,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: {
              display: true,
              labels: {
                filter: function (legendItem, data) {
                  return false;
                },
              },
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
              type: "category",
              labels: uniqueSortedSellDates,
            },
            y: {
              title: {
                display: true,
                text: "P / L (%)",
              },
              beginAtZero: true,
            },
          },
        },
      }
    );
  }
}

export default OrdersPageCharts;
