import CurrencyService from "./CurrencyService.js";
import AddOrder from "./AddOrder.js";

class ActualizeWallet extends AddOrder {
  constructor() {
    super();
    this._wallet = {
      crypto: [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 61000,
          units: 3,
          total: 183000,
        },
        {
          symbol: "ETH",
          name: "Etherum",
          price: 1500,
          units: 1,
          total: 1500,
        },
      ],
      stocks: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 100,
          units: 2,
          total: 200,
        },
      ],
      forex: [
        {
          symbol: "EUR/USD",
          name: "Euro Dolar",
          price: 0.96,
          units: 1100,
          total: 1145,
        },
      ],
      index: [
        {
          symbol: "SPY",
          name: "S&P 500",
          price: 470,
          units: 1,
          total: 470,
        },
      ],
      others: [],
      total: [],
    };

    this._wallet = JSON.parse(localStorage.getItem("wallet")) || this._wallet;
    this._orders = JSON.parse(localStorage.getItem("orders")) || this._orders;

    this.loadCurrencies();

    this._type.addEventListener("change", this.sellSelectedDatalist.bind(this));
    this._ticker.addEventListener("change", this.newCurrencie.bind(this));
    this._newCurrencieSubmit.addEventListener(
      "click",
      this.newCurrencieLock.bind(this)
    );

    this._price.addEventListener("input", this.actualizeGP.bind(this));
    this._units.addEventListener("input", this.actualizeGP.bind(this));
  }

  actualizeGP() {
    const ticker = this.searchSymbolWallet();

    if (ticker) {
      if (this._units.value > ticker.units) {
        return;
      }
      const gp =
        this._units.value * this._price.value -
        this._units.value * ticker.price;
      const gpPercentage = gp / (this._units.value * ticker.price);

      this._gp.textContent = "$ " + this.formatNumber(gp);
      this._profit.textContent = this.limitNumber(gpPercentage * 100) + " %";

      if (this._units.value === "0") {
        this._profit.textContent = this.formatNumber(gp) + " %";
      }
    }

    this.actualizeTotal();
  }

  async loadCurrencies() {
    this._currencies = await CurrencyService.getCurrencies();
    if (this._currencies) {
      this.actualValueWallet();
    } else {
      console.error("Error: The data could not be loaded.");
    }
  }

  isOnWallet() {
    this._units.setAttribute("max", Infinity);

    if (!this.actualizeModalToSell()) {
      return;
    }
    this.submitOrder();
    const lastOrder = this._orders[this._orders.length - 1];
    this.verifySymbol(lastOrder);
    this.sellSelectedDatalist();
  }

  sellSelectedDatalist() {
    if (this.sellSelected()) {
      CurrencyService.addDataList(this._wallet);
      this.actualizeModalToSell();
    } else if (!this.sellSelected()) {
      if (!this._orders.length > 0) {
        CurrencyService.addDataList(this._currencies);
      } else {
        this._wallet.others.splice(-1, 1);
        let others = this._wallet.others;
        let newCurrencies = this._currencies;
        newCurrencies.others = others;
        CurrencyService.addDataList(newCurrencies);
      }
    }
  }

  actualizeModalToSell() {
    if (this._type.value === "Sell") {
      if (this._ticker.value !== "") {
        if (this.searchSymbolWallet()) {
          return true;
        } else {
          window.alert("The investment selected doesn't exist");
          return false;
        }
      }
    } else {
      return true;
    }
  }

  searchSymbolWallet() {
    let result = null;
    let data = this._wallet;

    for (let category in data) {
      result = data[category].find(
        (item) => item.symbol === this._ticker.value
      );

      if (result && this._type.value === "Sell") {
        this._units.setAttribute("max", result.units);
        if (this._editMode) {
          const max = result.units + this._orders[this._idOrder].units;
          this._units.setAttribute("max", max);
        }
        return true, result;
      }
    }
  }

  verifySymbol(lastOrder) {
    for (const crypto of this._wallet.crypto) {
      if (crypto.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "crypto");
        return true;
      }
    }

    for (const stock of this._wallet.stocks) {
      if (stock.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "stocks");
        return true;
      }
    }

    for (const index of this._wallet.index) {
      if (index.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "index");
        return true;
      }
    }

    for (const forex of this._wallet.forex) {
      if (forex.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "forex");
        return true;
      }
    }

    for (const others of this._wallet.others) {
      if (others.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "others");
        return true;
      }
    }

    this.addNewItem(lastOrder);
    return false;
  }

  actualizeEditMode(editOrder, category, editMode, deleteMode) {
    if (editMode) {
      const index = this._wallet[category].findIndex(
        (item) => item.symbol === editOrder.ticker
      );

      if (index !== -1) {
        if (editOrder.type === "Buy") {
          this._wallet[category][index].units -= editOrder.units;
          this._wallet[category][index].total -= editOrder.total;
          this._wallet[category][index].price = this.midPrice(
            editOrder.ticker,
            this._wallet[category][index].units
          );
          if (deleteMode) {
            this._wallet[category][index].price =
              this.midPrice(
                editOrder.ticker,
                this._wallet[category][index].units
              ) / 100;
          }
        } else if (editOrder.type === "Sell") {
          this._wallet[category][index].units += editOrder.units;
          this._wallet[category][index].total +=
            editOrder.units * this._wallet[category][index].price;
        }
        if (this._wallet[category][index].units === 0) {
          this._wallet[category][index].total = 0;
          this._wallet[category][index].price = 0;
          this._wallet[category].splice(index, 1);
        }
        localStorage.setItem("wallet", JSON.stringify(this._wallet));
      }
    }
  }

  actualizingItem(lastOrder, type) {
    const index = this._wallet[type].findIndex(
      (item) => item.symbol === lastOrder.ticker
    );

    if (index !== -1) {
      if (this._orders[this._orders.length - 1].type === "Buy") {
        this._wallet[type][index].units += lastOrder.units;
        this._wallet[type][index].total += lastOrder.total;
        this._wallet[type][index].price =
          this._wallet[type][index].total / this._wallet[type][index].units;
      } else if (this._orders[this._orders.length - 1].type === "Sell") {
        this._wallet[type][index].units -= lastOrder.units;
        this._wallet[type][index].total -=
          lastOrder.units * this._wallet[type][index].price;
      }
      if (this._wallet[type][index].units === 0) {
        this._wallet[type][index].total = 0;
        this._wallet[type][index].price = 0;
        this._wallet[type].splice(index, 1);
      }
      localStorage.setItem("wallet", JSON.stringify(this._wallet));
    }

    this.actualValueWallet();
  }

  addNewItem(lastOrder) {
    let foundElement = null;
    for (const type in this._currencies) {
      if (Array.isArray(this._currencies[type])) {
        foundElement = this._currencies[type].find(
          (element) => element.symbol === lastOrder.ticker
        );
        if (foundElement) {
          break;
        }
      }
    }

    if (foundElement) {
      const newItem = {
        symbol: lastOrder.ticker,
        name: foundElement.name,
        units: lastOrder.units,
        price: lastOrder.price,
        total: lastOrder.units * lastOrder.price,
      };
      for (const type in this._currencies) {
        if (
          Array.isArray(this._currencies[type]) &&
          this._currencies[type].some(
            (element) => element.symbol === lastOrder.ticker
          )
        ) {
          this._wallet[type].push(newItem);
          localStorage.setItem("wallet", JSON.stringify(this._wallet));
          break;
        }
      }
    } else {
      const newItem = {
        symbol: lastOrder.ticker,
        name: lastOrder.ticker,
        units: lastOrder.units,
        price: lastOrder.price,
        total: lastOrder.units * lastOrder.price,
      };

      this._wallet["others"].push(newItem);
      localStorage.setItem("wallet", JSON.stringify(this._wallet));
    }

    this.actualValueWallet();
  }

  searchSymbolJSON(value) {
    const data = this._currencies;
    for (let category in data) {
      let result = data[category].find((item) => item.symbol === value);
      if (result) {
        return result;
      }
    }
    return null;
  }

  newCurrencie() {
    if (this._ticker.value === "") {
      this._newCurrencieForm.classList.add("hidden");
      return;
    }
    if (
      this.searchSymbolJSON(this._ticker.value) ||
      this._type.value !== "Buy"
    ) {
      this._newCurrencieForm.classList.add("hidden");
      return;
    }
    this._newCurrencieForm.classList.remove("hidden");
  }

  newCurrencieLock() {
    let newCurrencie = {};
    if (this._newCurrencieName.value === "") {
      event.preventDefault();
      window.alert("Add a name to the new currencie");
      return;
    } else {
      event.preventDefault();

      newCurrencie.name =
        this._newCurrencieName.value.charAt(0).toUpperCase() +
        this._newCurrencieName.value.slice(1);
      newCurrencie.symbol = this._ticker.value.toUpperCase();
      this._newCurrencieForm.classList.toggle("hidden");
    }
    this._newCurrencieName.value = "";
  }

  actualValueWallet() {
    this._totalValue = 0;
    this._totalCost = 0;

    Object.keys(this._wallet).forEach((category) => {
      this._wallet[category] = this._wallet[category].filter(
        (item) =>
          !(
            item &&
            typeof item === "object" &&
            item.value !== undefined &&
            item.cost !== undefined
          )
      );

      let categoryValue = 0;
      let categoryCost = 0;

      if (category === "others") {
        this._wallet[category].forEach((element) => {
          categoryCost += element.total;
          categoryValue += element.units * element.price;
        });
      } else if (Array.isArray(this._wallet[category])) {
        this._wallet[category].forEach((element) => {
          const asset = this._currencies[category]?.find(
            (a) => a.symbol === element.symbol
          );

          if (asset) {
            categoryCost += element.total;
            categoryValue += element.units * asset.price;
          } else {
            categoryCost += element.total;
            categoryValue += element.units * element.price;
          }
        });
      }

      this._wallet[category].push({
        value: categoryValue,
        cost: categoryCost,
      });

      this._totalCost += categoryCost;
      this._totalValue += categoryValue;
    });

    this._wallet.total = [
      {
        cost: this._totalCost,
        value: this._totalValue,
      },
    ];

    localStorage.setItem("wallet", JSON.stringify(this._wallet));
  }

  midPrice(ticker, units) {
    const orders = this._orders.filter(
      (order) => order.ticker === ticker && order.type === "Buy"
    );

    if (orders.length > 0) {
      const sumOfPrices = orders.reduce(
        (accumulator, order) => accumulator + order.total,

        0
      );
      const sumOfUnits = orders.reduce(
        (accumulator, order) => accumulator + order.units,
        0
      );
      const averagePrice = (sumOfPrices / sumOfUnits) * units;

      return averagePrice;
    } else {
      return Error;
    }
  }
}

export default ActualizeWallet;
