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
          units: 2,
          total: 3000,
        },
      ],
      stocks: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 115,
          units: 1,
          total: 115,
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
    localStorage.setItem("wallet", JSON.stringify(this._wallet));
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
    if (!this.actualizeModalToSell()) {
      return;
    }
    this.submitOrder();
    const lastOrder = this._orders[this._orders.length - 1];
    this.verifySymbol(lastOrder);
    this.sellSelectedDatalist();
  }

  sellSelectedDatalist() {
    // this.actualizeModalToSell();
    if (this.sellSelected()) {
      CurrencyService.addDataList(this._wallet);
      this.actualizeModalToSell();
    } else {
      CurrencyService.addDataList(this._currencies);
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
      if (result) {
        this._units.setAttribute("max", result.units);

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
        const data = this.searchSymbolJSON(lastOrder.ticker);
        data.price = lastOrder.price;
        this.actualizingItem(lastOrder, "others");
        return true;
      }
    }

    this.addNewItem(lastOrder);
    return false;
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
        this._wallet[type][index].total -= lastOrder.total;
        this._wallet[type][index].price =
          this._wallet[type][index].total / this._wallet[type][index].units;
      }
      if (this._wallet[type][index].units === 0) {
        this._wallet[type][index].total = 0;
        this._wallet[type][index].price = 0;
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
    if (
      (this.searchSymbolJSON(this._ticker.value) ||
        this._ticker.value === "") &&
      this._type.value !== "Buy"
    ) {
      this._newCurrencieForm.classList.add("hidden");
      return;
    } else if (
      this.searchSymbolJSON(this._ticker.value) ||
      this._type.value !== "Buy"
    ) {
      this._newCurrencieForm.classList.add("hidden");
      return;
    }
    this._newCurrencieForm.classList.toggle("hidden");
  }

  newCurrencieLock() {
    let newCurrencie = {};
    if (this._newCurrencieName.value === "") {
      event.preventDefault();
      window.alert("Add a name to the new currencie");
      return;
    } else {
      event.preventDefault();
      newCurrencie.name = this._newCurrencieName.value;
      newCurrencie.symbol = this._ticker.value.toUpperCase();
      this._newCurrencieForm.classList.toggle("hidden");
    }
    this._currencies.others.push(newCurrencie);
    this._newCurrencieName.value = "";
    CurrencyService.addDataList(this._currencies);
    this.actualValueWallet();
  }

  actualValueWallet() {
    this._totalValue = 0;
    this._totalCost = 0;
    Object.keys(this._wallet).forEach((category) => {
      this._wallet[category] = this._wallet[category].filter(
        (item) => !(item.value !== undefined && item.cost !== undefined)
      );

      this._value = 0;
      this._cost = 0;

      this._wallet[category].forEach((element) => {
        this._currencies[category].forEach((asset) => {
          if (element.symbol === asset.symbol) {
            this._cost += element.total;
            let value = element.units * asset.price;
            this._value += value;
          }
        });
      });

      this._wallet[category].push({
        value: this._value,
        cost: this._cost,
      });

      this._totalCost += this._cost;
      this._totalValue += this._value;
    });
    this._wallet.total = [
      {
        cost: this._totalCost,
        value: this._totalValue,
      },
    ];
    localStorage.setItem("wallet", JSON.stringify(this._wallet));
  }
}

export default ActualizeWallet;
