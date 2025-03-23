class CurrencyService {
  constructor() {
    this._currencies = null;
    this._datalistSuggest = document.getElementById("order-suggests");
    this._loadingPromise = this.initializeCurrencies();
  }

  async initializeCurrencies() {
    try {
      const response = await fetch("/src/data/currencies.json");
      if (!response.ok) {
        throw new Error("Error loading currency data");
      }
      this._currencies = await response.json();
      this.addBaseDataToDOM();
    } catch (error) {
      console.error("Error initializing currencies:", error);
    }
  }

  async getCurrencies() {
    await this._loadingPromise;
    return this._currencies;
  }

  addBaseDataToDOM() {
    if (!this._currencies) {
      console.error("Currencies data is not available yet.");
      return;
    }

    this.addDataList(this._currencies);
  }

  addDataList(obj) {
    this._datalistSuggest.innerHTML = "";

    Object.values(obj).forEach((category) => {
      category
        .filter((item) => "name" in item && "symbol" in item)
        .forEach((item) => {
          let option = document.createElement("option");
          option.value = item.symbol;
          option.innerText = `- ${item.name}`;

          this._datalistSuggest.appendChild(option);
        });
    });
  }
}

const currencyService = new CurrencyService();
export default currencyService;
