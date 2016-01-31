package com.gaojin.htapp.plugs;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.provider.Settings;
import android.util.Log;
import android.view.View;

import com.tencent.map.geolocation.TencentLocation;
import com.tencent.map.geolocation.TencentLocationListener;
import com.tencent.map.geolocation.TencentLocationManager;
import com.tencent.map.geolocation.TencentLocationRequest;

/**
 * @author 邵剑泳
 * @date 2015-04-22 腾讯定位插件
 */
public class TXLocation extends CordovaPlugin implements
		TencentLocationListener {
	public CallbackContext callbackContext;
	public static Context thisContext;
	private TencentLocationManager mLocationManager;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		setCallbackContext(callbackContext);
		// 定位
		if (action.equals("getCurrentPosition")) {
			thisContext = this.cordova.getActivity();
			mLocationManager = TencentLocationManager.getInstance(thisContext);
			// 设置坐标系为 gcj-02, 缺省坐标为 gcj-02, 所以通常不必进行如下调用
			mLocationManager
					.setCoordinateType(TencentLocationManager.COORDINATE_TYPE_GCJ02);
			// 创建定位请求
			final TencentLocationRequest request = TencentLocationRequest
					.create();
			// 修改定位请求参数, 定位周期 3000 ms
			request.setInterval(3000).setAllowCache(true);
			cordova.getActivity().runOnUiThread(new Runnable() {
				@Override
				public void run() {
					mLocationManager.requestLocationUpdates(request,
							TXLocation.this);
				}
			});
			return true;
		} else if (action.equals("stop")) {
			onDestroy();
		}
		return false;
	}

	@Override
	public void onStatusUpdate(String name, int status, String desc) {
		// do your work
	}

	@Override
	public void onLocationChanged(TencentLocation location, int error,
			String reason) {
		try {
			if (error == TencentLocation.ERROR_OK) {
				Log.e("腾讯定位", location.toString());
				JSONObject json = new JSONObject();
				json.put("accuracy", location.getAccuracy());// 精度
				json.put("latitude", location.getLatitude());// 纬度
				json.put("lontitude", location.getLongitude());// 经度
				json.put("addr", location.getAddress());
				onDestroy();
				callbackContext.success(json);
			} else {
				onDestroy();
				// 定位失败
				callbackContext.error(reason);
			}
		} catch (Exception e) {
			onDestroy();
			e.printStackTrace();
			callbackContext.error(e.toString());
		}
	}

	@Override
	public void onDestroy() {
		/**
		 * 注意, 本示例中 requestLocationUpdates 和 removeUpdates 都可能被多次重复调用.
		 * <p>
		 * 重复调用 requestLocationUpdates, 将忽略之前的 reqest 并自动取消之前的 listener, 并使用最新的
		 * request 和 listener 继续定位
		 * <p>
		 * 重复调用 removeUpdates, 将定位停止
		 */

		// 退出 activity 前一定要停止定位!
		stopLocation(null);
	}

	// ====== view listener
	// 响应点击"停止"
	public void stopLocation(View view) {
		mLocationManager.removeUpdates(this);
	}

	public CallbackContext getCallbackContext() {
		return callbackContext;
	}

	public void setCallbackContext(CallbackContext callbackContext) {
		this.callbackContext = callbackContext;
	}

	public boolean openGPS(Activity context) {
		LocationManager locationManager = (LocationManager) context
				.getSystemService(Context.LOCATION_SERVICE);
		if (locationManager
				.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)
				|| locationManager
						.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER)) {
			return true;
		}

		Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		context.startActivity(intent);
		return false;
	}

	public boolean isOpenGPS(Activity context) {
		LocationManager locationManager = (LocationManager) context
				.getSystemService(Context.LOCATION_SERVICE);
		if (locationManager
				.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)
				|| locationManager
						.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER)) {
			return true;
		} else {
			return false;
		}
	}
}
