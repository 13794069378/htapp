package com.gaojin.htapp.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import android.util.Log;

public class HttpUtil {
	/**
	 * 向服务器发发post请求
	 * @param url
	 * @param map
	 * @return
	 */
	public String requestURI(String url,Map<String, String> map){
		HttpClient httpClient = new DefaultHttpClient();
		HttpPost httpPost = new HttpPost(url);
		String result=null;
		try {
			// 为httpPost设置HttpEntity对象
			List<NameValuePair> parameters = new ArrayList<NameValuePair>();
			if (null!=map) {
				Iterator<String> itera=map.keySet().iterator();
				while (itera.hasNext()) {
					String key=itera.next();
					parameters.add(new BasicNameValuePair(key, map.get(key)));
				}
			}
			HttpEntity entity = new UrlEncodedFormEntity(parameters);
			httpPost.setEntity(entity);
			// httpClient执行httpPost表单提交
			HttpResponse response = httpClient.execute(httpPost);
			// 得到服务器响应实体对象
			HttpEntity responseEntity = response.getEntity();
			if (responseEntity != null) {
				result=EntityUtils.toString(responseEntity, "utf-8");
				System.out.println(result);
			} else {
				System.out.println("服务器无响应！");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 释放资源
			httpClient.getConnectionManager().shutdown();
		}
		return result;

	}

	
	public String  getRequest(String url) {
		Log.d("http", url);
		String result=null;
		// 1.得到HttpClient对象
		HttpClient httpClient = new DefaultHttpClient();
		// 2.实例化一个HttpGet对象
		HttpGet httpGet = new HttpGet(url);
		try {
			// 3.httpClient执行httpGet请求
			HttpResponse response = httpClient.execute(httpGet);
			HttpEntity entity = response.getEntity();
			if (entity != null) { // 如果有数据表示请求成功
				result= EntityUtils.toString(entity, "utf-8");
			} else {
				System.out.println("连接失败！");
			}
		} catch (Exception e) {
			Log.e("error", e.getMessage());
			e.printStackTrace();
		} finally {
			// 4.释放资源(Shuts down this connection manager and releases allocated
			// resources)
			httpClient.getConnectionManager().shutdown();
		}
		return result;
	}

}
