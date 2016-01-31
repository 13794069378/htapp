package com.gaojin.htapp.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import org.json.JSONObject;
import com.gaojin.htapp.R;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.DialogInterface.OnClickListener;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

/**
 * 
 * @author 陈国祥
 * @date 2014- 9 -26
 */

public class UpdateManager {
	/* 下载中 */
	private static final int DOWNLOAD = 1;
	/* 下载结束 */
	private static final int DOWNLOAD_FINISH = 2;
	private String downurl;// apk下载地址
	private String downname;// 下载的文件名
	private String downupdate;
	/* 下载保存路径 */
	private String mSavePath;
	/* 记录进度条数量 */
	private int progress;
	/* 是否取消更新 */
	private boolean cancelUpdate = false;

	private Activity mContext;
	/* 更新进度条 */
	private ProgressBar mProgress;
	private Dialog mDownloadDialog;

	@SuppressLint("HandlerLeak")
	private Handler mHandler = new Handler() {
		public void handleMessage(Message msg) {
			switch (msg.what) {
			// 正在下载
			case DOWNLOAD:
				// 设置进度条位置
				mProgress.setProgress(progress);
				break;
			case DOWNLOAD_FINISH:
				// 安装文件
				installApk();
				break;
			default:
				break;
			}
		};
	};

	public UpdateManager(Activity context) {
		this.mContext = context;
	}

	/**
	 * 检测软件更新
	 */
	public void checkUpdate() throws Exception {
		new Thread(new Runnable() {

			@Override
			public void run() {
				try {
					Looper.prepare();// 创建该线程的Looper对象，用于接收消息,在非主线程中是没有looper的所以在创建handler前一定要使用prepare()创建一个Looper
					HttpUtil http = new HttpUtil();
					String response = http.getRequest(mContext
							.getString(R.string.updateurl));
					Log.e("更新接口", response);
					if (null != response) {
						JSONObject json = new JSONObject(response);
						double version = json.getDouble("version");
						downname = json.getString("name");
						downurl = json.getString("url").replace(
								"61.142.172.204:8188", "hip.haday.cn:8288");
						downupdate = json.getString("isUpdate");
						Log.e("更新地址", downurl);
						if (isUpdate(version)) {
							// 显示提示对话框
							showNoticeDialog();
						} else {
							Toast.makeText(mContext, R.string.soft_update_no,
									Toast.LENGTH_LONG).show();
						}
					}
					Looper.myLooper();
					Looper.loop();// 建立一个消息循环，该线程不会退出
				} catch (Exception e) {
					Log.e("更新出错", e.toString());
					new AlertDialog.Builder(mContext).setTitle("提示")
							.setMessage("更新失败:" + e.toString())
							.setPositiveButton("确定", null).show();
				}

			}
		}).start();
	}

	/**
	 * 检查软件是否有更新版本
	 * 
	 * @return
	 */
	private boolean isUpdate(double version) {
		// 获取当前软件版本
		//double versionCode = Double.valueOf(mContext.getString(R.string.version));
		double versionCode = Double.valueOf(readVersion());
		//服务器版本
		double serviceCode = version;
		// 版本判断
		if (serviceCode > versionCode) {
			return true;
		}
		return false;
	}
	
	private String readVersion() {
		try { 
            InputStream is = mContext.getResources().getAssets().open("www/js/config.js");  
            int size = is.available();
            byte[] buffer = new byte[size];  
            is.read(buffer);  
            is.close();  
            String text = new String(buffer, "UTF-8");
            int beginVersion = text.indexOf("version = \"");
            int endVersion = text.lastIndexOf("\";");
            return text.substring(beginVersion + 11, endVersion);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } 
	}

	/**
	 * 显示软件更新对话框
	 */
	private void showNoticeDialog() {
		// 构造对话框
		AlertDialog.Builder builder = new Builder(mContext);
		builder.setTitle(R.string.soft_update_title);
		builder.setMessage(R.string.soft_update_info);
		// 更新
		builder.setPositiveButton(R.string.soft_update_updatebtn,
				new OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
						// 显示下载对话框
						showDownloadDialog();
					}
				});
		// 稍后更新
		builder.setNegativeButton(R.string.soft_update_later,
				new OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
						if (downupdate.equals("1")) {
							mContext.finish();
						}
					}
				});
		Dialog noticeDialog = builder.create();
		noticeDialog.setCancelable(false);
		noticeDialog.show();
	}

	/**
	 * 显示软件下载对话框
	 */
	private void showDownloadDialog() {
		// 构造软件下载对话框
		AlertDialog.Builder builder = new Builder(mContext);
		builder.setTitle(R.string.soft_updating);
		// 给下载对话框增加进度条
		final LayoutInflater inflater = LayoutInflater.from(mContext);
		View v = inflater.inflate(R.layout.softupdate_progress, null);
		mProgress = (ProgressBar) v.findViewById(R.id.update_progress);
		builder.setView(v);
		// 取消更新
		builder.setNegativeButton(R.string.soft_update_cancel,
				new OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
						// 设置取消状态
						cancelUpdate = true;
						if (downupdate.equals("1")) {
							mContext.finish();
						}
					}
				});
		mDownloadDialog = builder.create();
		mDownloadDialog.setCancelable(false);
		mDownloadDialog.show();
		// 现在文件
		downloadApk();
	}

	/**
	 * 下载apk文件
	 */
	private void downloadApk() {
		// 启动新线程下载软件
		new downloadApkThread().start();
	}

	/**
	 * 下载文件线程
	 * 
	 * @author Administrator
	 * 
	 */
	private class downloadApkThread extends Thread {
		@Override
		public void run() {
			try {
				// 判断SD卡是否存在，并且是否具有读写权限
				if (Environment.getExternalStorageState().equals(
						Environment.MEDIA_MOUNTED)) {
					// 获得存储卡的路径
					String sdpath = Environment.getExternalStorageDirectory()
							+ "/";
					mSavePath = sdpath + "download";
					URL url = new URL(downurl);
					// 创建连接
					HttpURLConnection conn = (HttpURLConnection) url
							.openConnection();
					conn.connect();
					// 获取文件大小
					int length = conn.getContentLength();
					// 创建输入流
					InputStream is = conn.getInputStream();

					File file = new File(mSavePath);
					// 判断文件目录是否存在
					if (!file.exists()) {
						file.mkdir();
					}
					File apkFile = new File(mSavePath, downname);
					FileOutputStream fos = new FileOutputStream(apkFile);
					int count = 0;
					// 缓存
					byte buf[] = new byte[1024];
					// 写入到文件中
					do {
						int numread = is.read(buf);
						count += numread;
						// 计算进度条位置
						progress = (int) (((float) count / length) * 100);
						// 更新进度
						mHandler.sendEmptyMessage(DOWNLOAD);
						if (numread <= 0) {
							// 下载完成
							mHandler.sendEmptyMessage(DOWNLOAD_FINISH);
							break;
						}
						// 写入文件
						fos.write(buf, 0, numread);
					} while (!cancelUpdate);// 点击取消就停止下载.
					fos.close();
					is.close();
				}
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			// 取消下载对话框显示
			mDownloadDialog.dismiss();
			mContext.finish();
		}
	};

	/**
	 * 安装APK文件
	 */
	private void installApk() {
		File apkfile = new File(mSavePath, downname);
		if (!apkfile.exists()) {
			return;
		}
		// 通过Intent安装APK文件
		Intent i = new Intent(Intent.ACTION_VIEW);
		i.setDataAndType(Uri.parse("file://" + apkfile.toString()),
				"application/vnd.android.package-archive");
		mContext.startActivity(i);
	}

}
