package com.gaojin.htapp.plugs;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.app.PendingIntent;
import android.app.PendingIntent.CanceledException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.DialogInterface.OnClickListener;
import android.location.LocationManager;
import android.net.Uri;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.location.LocationClientOption.LocationMode;

/**
 * 百度基站定位错误返回码
 */
// 61 ： GPS定位结果
// 62 ： 扫描整合定位依据失败。此时定位结果无效。
// 63 ： 网络异常，没有成功向服务器发起请求。此时定位结果无效。
// 65 ： 定位缓存的结果。
// 66 ： 离线定位结果。通过requestOfflineLocaiton调用时对应的返回结果
// 67 ： 离线定位失败。通过requestOfflineLocaiton调用时对应的返回结果
// 68 ： 网络连接失败时，查找本地离线定位时对应的返回结果
// 161： 表示网络定位结果
// 162~167： 服务端定位失败
// 502：KEY参数错误
// 505：KEY不存在或者非法
// 601：KEY服务被开发者自己禁用
// 602: KEY Mcode不匹配,意思就是您的ak配置过程中安全码设置有问题，请确保： sha1正确，“;”分号是英文状态；且包名是您当前运行应用的包名
// 501-700：KEY验证失败
/**
 * 
 * @author 陈国祥
 *@date 2014-09-15
 *百度定位插件
 */
public class BaiduLocation_GPS extends CordovaPlugin{

	private LocationClient mLocationClient = null;
	 private BDLocationListener myListener = new MyLocationListener();
	 public CallbackContext callbackContext;
	 public static Context thisContext;
	 
	 @Override
     public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		 setCallbackContext(callbackContext);
		 //定位
         if (action.equals("getCurrentPosition")) {
        	 thisContext = this.cordova.getActivity();
        	 if (!isOPen(thisContext)) {
        		 new  AlertDialog.Builder(this.cordova.getActivity())    
		         .setTitle("提示" )  
				 .setMessage("请开启GPS否则定位无法使用!" )  
				 .setPositiveButton("确定" ,new OnClickListener() {
					@Override
					public void onClick(DialogInterface arg0, int arg1) {
						openGPS(thisContext);
					}
				} )  
			     .show();
        	 }
        	 
        	 cordova.getActivity().runOnUiThread(new Runnable() {
 				@Override
 				public void run() {
 					mLocationClient= new LocationClient(cordova.getActivity());
 					mLocationClient.registerLocationListener(myListener); // 注册监听函数
 			        setLocationOption();
 			        mLocationClient.start();// 开始定位
 				}

 			});
             return true;
         }else if (action.equals("stop")) {
        	 mLocationClient.stop();
        	 callbackContext.success("定位已关闭");
		}
         return false;
     }
	
	    /**
	     * 设置相关参数
	     */
	    private void setLocationOption() {
	        LocationClientOption option = new LocationClientOption();
	        option.setOpenGps(true);
	        option.setIsNeedAddress(true);// 返回的定位结果包含地址信息
	        option.setLocationMode(LocationMode.Device_Sensors);//设置定位模式
	        option.setCoorType("bd09ll");//返回的定位结果是百度经纬度,默认值gcj02
	        option.setScanSpan(5000);//设置发起定位请求的间隔时间为5000ms
	        option.setIsNeedAddress(true);//返回的定位结果包含地址信息
	        option.setNeedDeviceDirect(true);//返回的定位结果包含手机机头的方向
	        mLocationClient.setLocOption(option);
	    }
	 
	    public class MyLocationListener implements BDLocationListener {
	        public void onReceivePoi(BDLocation poiLocation) throws JSONException {
	            // 将在下个版本中去除poi功能
	            if (poiLocation == null) {
	                return;
	            }
	            JSONObject json = new JSONObject();
	            json.put("type", poiLocation.getLocType());
	            json.put("latitude", poiLocation.getLatitude());//纬度
	            json.put("lontitude", poiLocation.getLongitude());//经度
	            if (poiLocation.getLocType() == BDLocation.TypeNetWorkLocation) {
	               json.put("addr", poiLocation.getAddrStr());
	            }else{
	            	json.put("addr", "");
	            }
	          
	        }
	        
			@Override
			public void onReceiveLocation(BDLocation location) {
				try {
					 if (location == null) return;
					 JSONObject json = new JSONObject();
			            json.put("type", location.getLocType());
			            json.put("latitude", location.getLatitude());//纬度
			            json.put("lontitude", location.getLongitude());//经度
			            if (location.getLocType() == BDLocation.TypeNetWorkLocation) {
			            	json.put("addr", location.getAddrStr());
			            }
			            mLocationClient.stop();
			           /* StringBuffer sb = new StringBuffer(256);
			            sb.append("当前时间 : ");
			            sb.append(location.getTime());
			            sb.append("\n错误码 : ");
			            sb.append(location.getLocType());
			            sb.append("\n纬度 : ");
			            sb.append(location.getLatitude());
			            sb.append("\n经度 : ");
			            sb.append(location.getLongitude());
			            sb.append("\n半径 : ");
			            sb.append(location.getRadius());
			            if (location.getLocType() == BDLocation.TypeGpsLocation) {
			                sb.append("\n速度 : ");
			                sb.append(location.getSpeed());
			                sb.append("\n卫星数 : ");
			                sb.append(location.getSatelliteNumber());
			            } else if (location.getLocType() == BDLocation.TypeNetWorkLocation) {
			                sb.append("\n地址 : ");
			                sb.append(location.getAddrStr());
			            }
			            callbackContext.success(sb.toString());*/
			           /* new  AlertDialog.Builder(getContext()).setTitle("标题" ).setMessage(sb.toString()).setPositiveButton("确定" ,  null ).show();
			            Log.d(TAG, "onReceiveLocation " + sb.toString());	*/
			            callbackContext.success(json);
				} catch (Exception e) {
					e.printStackTrace();
					callbackContext.error(e.toString());
				}
			}
	    }
	    
	    @Override
		public void onDestroy() {
			if (mLocationClient != null && mLocationClient.isStarted()) {
				mLocationClient.stop();
				mLocationClient = null;
			}
			super.onDestroy();
		}

		public CallbackContext getCallbackContext() {
			return callbackContext;
		}

		public void setCallbackContext(CallbackContext callbackContext) {
			this.callbackContext = callbackContext;
		}
	    
		/**
	     * 强制帮用户打开GPS
	     * @param context
	     */ 
	    public static final void openGPS(Context context) { 
	        Intent GPSIntent = new Intent(); 
	        GPSIntent.setClassName("com.android.settings", 
	                "com.android.settings.widget.SettingsAppWidgetProvider"); 
	        GPSIntent.addCategory("android.intent.category.ALTERNATIVE"); 
	        GPSIntent.setData(Uri.parse("custom:3")); 
	        try { 
	            PendingIntent.getBroadcast(context, 0, GPSIntent, 0).send(); 
	        } catch (CanceledException e) { 
	            e.printStackTrace(); 
	        } 
	    }
	    
	    /**
	     * 判断GPS是否开启，GPS或者AGPS开启一个就认为是开启的
	     * @param context
	     * @return true 表示开启
	     */ 
	    public static final boolean isOPen(final Context context) { 
	        LocationManager locationManager  
	                                 = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE); 
	        // 通过GPS卫星定位，定位级别可以精确到街（通过24颗卫星定位，在室外和空旷的地方定位准确、速度快） 
	        boolean gps = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER); 
	        // 通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位） 
	        boolean network = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER); 
	        if (gps || network) { 
	            return true; 
	        } 
	   
	        return false; 
	    }
	    
}
