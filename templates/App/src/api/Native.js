import _dsbridge from 'dsbridge';
import { useEventDispatch } from '@zhengxy/use';
const native = (name, params, asyncCallback = false) => {
  if (_dsbridge.hasNativeMethod(name)) {
    if (asyncCallback) {
      return new Promise((resolve, reject) => {
        _dsbridge.call(name, params, resolve);
      });
    } else {
      return _dsbridge.call(name, params);
    }
  }
  return null;
};
// 1.	退出应用
// •	调用方法:
//  •	参数: params (可以为空)
// 	•	返回值: "true" (成功)
export const nativeSystemExit = (params) => {
  return native('system.exit', params);
};

// 2.	保存数据
// 	•	调用方法: native.call('system.setData', params)
// 	•	参数: params (JSON对象)，将数据存储在 SharedPreferences 中
// 	•	返回值: "true" (成功), "false" (失败)

export const nativeSetData = (params) => {
  return native('system.setData', params);
};
// 3.	获取数据
// 	•	调用方法: native.call('system.getData', params)
// 	•	参数: params (字符串)，键值，用于从 SharedPreferences 获取数据
// 	•	返回值: 字符串 (成功返回数据，失败返回空字符串)
export const nativeGetData = (params) => {
  return native('system.getData', params);
};
// 4.	获取当前环境
// 	•	调用方法: native.call('system.getEnv', params)
// 	•	参数: params (可以为空)
// 	•	返回值: 当前环境（字符串）
export const nativeGetEnv = (params) => {
  return native('system.getEnv', params);
};
// 	5.	获取Native版本
// 	•	调用方法: native.call('system.getNativeVersion', params)
// 	•	参数: params (可以为空)
// 	•	返回值: Native版本号（字符串）
export const nativeGetNativeVersion = (params) => {
  return native('system.getNativeVersion', params);
};
// 	6.	获取启动参数 (SchemeUrl)
// 	•	调用方法: native.call('system.getSchemeUrl', params)
// 	•	参数: params (可以为空)
// 	•	返回值: "true"
export const nativeGetSchemeUrl = (params) => {
  return native('system.getSchemeUrl', params);
};
// 7.	获取网络状态（舍弃）
// •	调用方法: native.call('system.networkStatus', params)
// 	•	参数: params (可以为空)
// 	•	返回值: 网络状态 (整数)
export const nativeGetNetworkStatus = (params) => {
  return native('system.networkStatus', params);
};
// 8.	获取系统信息
// 	•	调用方法: native.call('system.info', params)
// 	•	参数: params (可以为空)
// 	•	返回值: JSON对象 (包含设备信息)
export const nativeGetInfo = (params) => {
  return native('system.info', params);
};

// 9.	是否沉浸式
// 	•	调用方法: native.call('system.isImmersion', params)
// 	•	参数: params (字符串)，传递样式参数
// 	•	返回值: "true"
export const nativeIsImmersion = (params) => {
  return native('system.isImmersion', params);
};

// 10.	获取状态栏高度
// 	•	调用方法: native.call('system.getStatusBarHeight', params)
// 	•	参数: params (可以为空)
// 	•	返回值: 状态栏高度 (整数)
export const nativeGetStatusBarHeight = (params) => {
  return native('system.getStatusBarHeight', params);
};
// 11.	设置状态栏样式
// 	•	调用方法: native.call('system.setStatusBarStyle', params)
// 	•	参数: params (字符串)，传递样式参数—“light”or“dark”
// •	返回值: "true"
export const nativeSetStatusBarStyle = (params) => {
  return native('system.setStatusBarStyle', params);
};
// 12.	判断缓存文件是否存在
// 	•	调用方法: native.call('system.existsFileInCache', params)
// 	•	参数: params (字符串)，文件名
// 	•	返回值: true (文件存在)，false (文件不存在)
export const nativeExistsFileInCache = (params) => {
  return native('system.existsFileInCache', params);
};
// 13.	写入剪切板
// 	•	调用方法: native.call('system.writePasteboard', params)
// 	•	参数: params (字符串)，要写入剪切板的内容
// 	•	返回值: "true"
export const nativeWritePasteboard = (params) => {
  return native('system.writePasteboard', params);
};
// 14.	读取剪切板
// 	•	调用方法: native.call('system.readPasteboard', params)
// 	•	参数: params (可以为空)
// 	•	返回值: 剪切板的内容 (字符串)
//
export const nativeReadPasteboard = (params) => {
  return native('system.readPasteboard', params);
};
// 异步方法
//
// 1.	获取缓存大小
// 	•	调用方法: native.call('system.getCacheDirSize', params, (data) => { console.log(data); })
// 	•	参数: params (可以为空)
// 	•	返回值: 缓存大小 (字符串)
export const nativeGetCacheDirSize = (params) => {
  return native('system.getCacheDirSize', params, true);
};
// 2.	清除缓存
// 	•	调用方法: native.call('system.clearCacheDir', params, (data) => { console.log(data); })
// 	•	参数: params (可以为空)
// 	•	返回值: "true" (成功)
export const nativeClearCacheDir = (params) => {
  return native('system.clearCacheDir', params, true);
};
// 3.	保存文件到缓存
// 	•	调用方法: native.call('system.saveFileToCache', params, (data) => { console.log(data); })
// 	•	参数: params (JSON对象)，包含文件信息
// 	•	返回值: "true" (成功)，"false" (失败)
export const nativeSaveFileToCache = (params) => {
  return native('system.saveFileToCache', params, true);
};
// 4.	从缓存读取文件
// 	•	调用方法: native.call('system.takeFileFromCache', params, (data) => { console.log(data); })
// 	•	参数: params (字符串)，文件名
// 	•	返回值: 文件内容 (Base64编码的字符串)，"false" (文件不存在)
export const nativeTakeFileFromCache = (params) => {
  return native('system.takeFileFromCache', params, true);
};
// 5.	从相册选择单张图片
// 	•	调用方法: native.call('system.takePhotoFromAlbum', params, (data) => { console.log(data); })
// 	•	参数: params (可以为空)
// 	•	返回值: 图片内容 (Base64编码的字符串)
// 选取文件都用takePhotoFromAlbum这一个接口，参数你传json字符串给我。
// {
//   "type":"1",
//   "min":"1",
//   "max":"9",
//   "isCrop":true
// }
//
// "type":"1"表示图片，"type":"2"表示视频
// "min":"1",固定为1
// "max":"9",最大选取文件个数
// "isCrop":true，是否需要裁剪

export const nativeGetMediaFile = (params) => {
  return native('system.getMediaFile', params, true);
};

// 7.	从相机拍照
// 	•	调用方法: native.call('system.takePhotoFromCamera', params, (data) => { console.log(data); })
// 	•	参数: params (可以为空)
// 	•	返回值: 图片内容 (Base64编码的字符串)
export const nativeTakePhotoFromCamera = (params) => {
  return native('system.takePhotoFromCamera', params, true);
};
// 8.	保存图片到相册 (通过URL)
// 	•	调用方法: native.call('system.savePhotoToAlbumByUrl', params, (data) => { console.log(data); })
// 	•	参数: params (字符串)，图片的URL
// 	•	返回值: "true" (成功)，"false" (失败)
export const nativeSavePhotoToAlbumByUrl = (params) => {
  return native('system.savePhotoToAlbumByUrl', params, true);
};
// 9.	保存图片到相册 (通过Base64)
// 	•	调用方法: native.call('system.savePhotoToAlbum', params, (data) => { console.log(data); })
// 	•	参数: params (Base64编码的字符串)，图片数据
// 	•	返回值: "true" (成功)，"false" (失败)
export const nativeSavePhotoToAlbum = (params) => {
  return native('system.savePhotoToAlbum', params, true);
};
// 10.	分享内容
// 	•	调用方法: native.call('system.share', params, (data) => { console.log(data); })
// 	•	参数: params (JSON对象)，包含分享的文字和图片
// 	•	返回值: "data" (分享完成后返回)
export const nativeShare = (params) => {
  return native('system.share', params);
};
export const nativeGetNavBarHeight = (params) => {
  return native('system.getNavBarHeight', params, false);
};
export const nativePaypalPayment = (params) => {
  return native('system.payment', params);
};
export const nativeOpenSystemBrowser = (params) => {
  return native('system.browser', params);
};
_dsbridge.register('paypalPayCallback', (data) => {
  useEventDispatch('paypalPayCallback', data);
});
_dsbridge.register('paypalBindCallback', (data) => {
  useEventDispatch('paypalBindCallback', data);
});
