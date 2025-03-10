class CurrencyService {
  constructor() {
    this._currencies = null;
    this._loadingPromise = this.initializeCurrencies();
  }

  async initializeCurrencies() {
    try {
      const response = await fetch("currencies.json");
      if (!response.ok) {
        throw new Error("Error loading currency data");
      }
      this._currencies = await response.json();
    } catch (error) {
      console.error("Error initializing currencies:", error);
    }
  }

  async getCurrencies() {
    if (this._loadingPromise) {
      await this._loadingPromise;
    }
    return this._currencies;
  }
}

const currencyService = new CurrencyService();
export default currencyService;
