class DataCache {
  constructor(fetchDataFunc, ttlMin = 60) {
    this.ttlMs = ttlMin * 60 * 1000;
    this.fetchDataFunc = fetchDataFunc;
    this.cache = null;
    this.getData = this.getData.bind(this);
    this.resetCache = this.resetCache.bind(this);
    this.isCacheExpired = this.isCacheExpired.bind(this);
    this.fetchDate = new Date(0);
  }

  isCacheExpired() {
    return this.fetchDate.getTime() + this.ttlMs < new Date().getTime();
  }

  getData(params) {
    if (!this.cache || this.isCacheExpired()) {
      return this.fetchDataFunc(params).then((data) => {
        this.cache = data;
        this.fetchDate = new Date();
        return data;
      });
    } else {
      console.log("cache hit");
      return Promise.resolve(this.cache);
    }
  }

  resetCache() {
    this.fetchDate = new Date(0);
  }
}

module.exports = DataCache;
