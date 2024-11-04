import { apiRefreshToken } from 'api/User.js';

export class TokenController {
  access_token = '';
  refresh_token = '';
  expires_in = 600;
  refresh_time = Date.now();
  RefreshTokenTimer = null;
  /**
   *
   * @type {{update: null | Function, error: null | Function}}
   */
  emitEvents = {
    error: null,
    update: null
  };
  /**
   * @param tokenInfo {{access_token:string,refresh_token?:string,expires_in:number}}
   */
  constructor(tokenInfo) {
    this.setToken(tokenInfo);
  }
  bootstrap() {
    return this._getToken().then((tokenInfo) => {
      this._startRefreshTokenTimer();
      return tokenInfo;
    });
  }
  /**
   * @param tokenInfo {{access_token:string,expires_in:number}}
   */
  setToken = (tokenInfo) => {
    const { access_token, refresh_token, expires_in } = tokenInfo;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expires_in = expires_in;
  };
  async _getToken() {
    const [error, res] = await apiRefreshToken({
      refresh_token: this.refresh_token
    });
    if (error) {
      this._emit('error', error);
      this.stopRefreshTokenTimer();
      throw error;
    } else {
      const { access_token } = res;
      const tokenInfo = { access_token };
      this.access_token = access_token;
      this._emit('update', tokenInfo);
      return tokenInfo;
    }
  }

  /**
   * @param name {'error' | 'update'}
   * @param callback
   */
  on(name, callback) {
    if (Object.prototype.hasOwnProperty.call(this.emitEvents, name)) {
      this.emitEvents[name] = callback;
    }
  }
  _emit(name, data) {
    this.emitEvents[name]?.(data);
  }
  //提前25秒刷新token
  _needRefreshToken() {
    return (
      this.refresh_time + this.expires_in * 60 * 1000 - Date.now() <= 25000
    );
  }
  stopRefreshTokenTimer() {
    clearInterval(this.RefreshTokenTimer);
  }
  _startRefreshTokenTimer() {
    this.stopRefreshTokenTimer();
    this.RefreshTokenTimer = setInterval(async () => {
      if (this._needRefreshToken()) {
        await this._getToken();
      }
    }, 60000);
  }
}
