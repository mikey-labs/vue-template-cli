import { apiRefreshToken } from 'api/Token.js';
import { USER_TOKEN } from '@/constant/Constant.js';
import { useUserStore } from '@/store/useUserStore.js';
import { useStorage } from '@zhengxy/use';
const userStore = useUserStore();
const Storage = useStorage();

export class TokenController {
  access_token = '';
  refresh_token = '';
  expires_in = 600; //秒
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
   * 设置token
   * @param tokenInfo {{access_token:string,expires_in:number}}
   */
  setToken = (tokenInfo) => {
    const { access_token, refresh_token, expires_in } = tokenInfo;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expires_in = expires_in;
  };

  /**
   * 获取token
   * @return {Promise<{access_token: *}>}
   * @private
   */
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

  /**
   * 冒泡事件
   * @param name
   * @param data
   * @private
   */
  _emit(name, data) {
    this.emitEvents[name]?.(data);
  }

  /**
   * 提前25秒刷新token
   * @return {boolean}
   * @private
   */
  _needRefreshToken() {
    return (
      this.refresh_time + this.expires_in * 60 * 1000 - Date.now() <= 25000
    );
  }
  stopRefreshTokenTimer() {
    clearInterval(this.RefreshTokenTimer);
  }

  /**
   * 60秒刷新一次token
   * @private
   */
  _startRefreshTokenTimer() {
    this.stopRefreshTokenTimer();
    this.RefreshTokenTimer = setInterval(async () => {
      if (this._needRefreshToken()) {
        await this._getToken();
      }
    }, 60000);
  }
}
//第二次登录
export const autoLogin = async () => {
  const token = Storage.getLocal(USER_TOKEN);
  if (token) {
    //只设置rt
    userStore.setTokenInfo({ refresh_token: token.refresh_token });
    const controller = new TokenController(token);
    //如果token刷新异常则跳转到登录
    controller.on('error', async (err) => {
      console.log('token refresh:', err);
      userStore.clear();
      await router.push('/login');
    });
    //更新成功设置token
    controller.on('update', async (tokenInfo) => {
      console.log('update refresh success');
      userStore.setTokenInfo(tokenInfo, true);
    });
    //开始刷新token，并且启动timer
    return controller
      .bootstrap()
      .then(async () => {
        //获取用户信息 如果需要
        // const [err, user] = await apiGetSettingInfo();
        // //失败返回false，交给router处理
        // if (err) {
        //   controller.stopRefreshTokenTimer();
        //   userStore.clear();
        //   return false;
        // }
        //成功设置user信息
        // if (user) {
        //   userStore.setUser(user);
        // }
        return true;
      })
      .catch((error) => {
        return false;
      });
  } else {
    return false;
  }
};
let isCheckAutoLogin = false;
export const autoLoginHandler = async () => {
  if (!isCheckAutoLogin) {
    isCheckAutoLogin = true;
    return autoLogin();
  }
  return true;
};
