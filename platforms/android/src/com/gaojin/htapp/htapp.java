/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.gaojin.htapp;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.content.res.Configuration;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

import org.apache.cordova.*;

import com.gaojin.htapp.util.NetWorkStatus;
import com.gaojin.htapp.util.UpdateManager;


public class htapp extends CordovaActivity 
{
	public static String phonenum;
    @SuppressWarnings("deprecation")
	@Override
    public void onCreate(Bundle savedInstanceState)
    {
    	super.setIntegerProperty("splashscreen", R.drawable.screen);
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
       
        //super.loadUrl("file:///android_asset/www/index.html");
        phonenum = getPhoneNumber();
        
        NetWorkStatus nw = new NetWorkStatus();
        if (nw.isNetworkConnected(htapp.this)) {
        	UpdateManager um = new UpdateManager(htapp.this);
        	try {
				um.checkUpdate();
			} catch (Exception e) {
				e.printStackTrace();
				Log.e("更新出错", e.toString());
			}
        	
		}else{
				new  AlertDialog.Builder(htapp.this)    
		         .setTitle("提示" )  
				 .setMessage("请连接网络否则程序无法使用!" )  
				 .setPositiveButton("确定" ,new OnClickListener() {
					@Override
					public void onClick(DialogInterface arg0, int arg1) {
						finish();
					}
				} )  
			     .show();  
		}
        
       
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
    	super.onConfigurationChanged(newConfig);
    }
    
    private String getPhoneNumber(){
        TelephonyManager mTelephonyMgr;
        mTelephonyMgr = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
        return mTelephonyMgr.getSubscriberId();   
    } 
}

