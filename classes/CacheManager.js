class CacheManager {
  constructor(userName) {
    this.userName = userName;
    this.cache = require(`./../Users/${this.userName}/cache/cache.json`)
  }

  getCacheField(field) {
    return this.cache[field];
  }

}

module.exports = CacheManager;


