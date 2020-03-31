package com.nuuneoi.contacttracer.service;

import android.app.ActivityManager;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.widget.Toast;

import com.nuuneoi.contacttracer.R;
import com.nuuneoi.contacttracer.activity.MainActivity;
import com.nuuneoi.contacttracer.mock.User;
import com.nuuneoi.contacttracer.mock.UserMock;
import com.nuuneoi.contacttracer.receiver.BootCompletedReceiver;
import com.nuuneoi.contacttracer.utils.BluetoothUtils;
import com.nuuneoi.contacttracer.utils.ByteUtils;
import com.nuuneoi.contacttracer.utils.Constants;

import java.nio.ByteBuffer;
import java.util.Calendar;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

public class AdvertiserService extends Service {

    private static final int FOREGROUND_NOTIFICATION_ID = 20011;

    public static final String ADVERTISING_MESSAGE =
            "com.nuuneoi.contacttracer.advertiser_message";

    public static final String ADVERTISING_MESSAGE_EXTRA_MESSAGE = "message";

    // Bluetooth General
    private BluetoothAdapter bluetoothAdapter;

    // Bluetooth Advertiser
    private BluetoothLeAdvertiser bluetoothLeAdvertiser;
    SampleAdvertiseCallback advertiseCallback;

    // User
    User user;

    // Wake Lock
    PowerManager.WakeLock wakeLock;

    // Misc
    Handler handler;
    Runnable autoRefreshTimerRunnable;

    @Override
    public void onCreate() {
        super.onCreate();

        initInstances();

        initBluetoothInstances();

        if (bluetoothAdapter == null)
            exithWithToast(R.string.ble_not_supported);

        if (!BluetoothUtils.isMultipleAdvertisementSupported(bluetoothAdapter)) {
            exithWithToast(R.string.multiple_advertisement_required);
            return;
        }

        initBluetoothAdvertiser();

        initWakeLock();

        startAdvertising();
        startAdvertisingAutoRefresh();

        initAlarm();
    }

    @Override
    public void onDestroy() {
        releaseWakeLock();

        stopAdvertising();
        stopForeground(true);
        stopAdvertisingAutoRefresh();
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void exithWithToast(int string_resource_id) {
        Toast.makeText(this, string_resource_id, Toast.LENGTH_SHORT).show();
        stopSelf();
    }

    private void initInstances() {
        user = new UserMock(AdvertiserService.this);

        handler = new Handler();
        autoRefreshTimerRunnable = new Runnable() {
            @Override
            public void run() {
                refreshAdvertiser();
                startAdvertisingAutoRefresh();
            }
        };
    }

    /*************
     * Bluetooth *
     *************/

    private void initBluetoothInstances() {
        final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
    }

    /************************
     * Bluetooth Advertiser *
     ************************/

    private void initBluetoothAdvertiser() {
        if (bluetoothLeAdvertiser == null) {
            final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
            if (bluetoothManager != null) {
                bluetoothLeAdvertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
            } else {
                exithWithToast(R.string.ble_not_supported);
            }
        }
    }

    /**
     * Move service to the foreground, to avoid execution limits on background processes.
     * <p>
     * Callers should call stopForeground(true) when background work is complete.
     */
    private void goForeground() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
                notificationIntent, 0);

        String channelId = "";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            channelId = createNotificationChannel("my_service", "My Background Service");

        Notification n = new NotificationCompat.Builder(this, channelId)
                .setContentTitle("Advertising device via Bluetooth")
                .setContentText("This device is discoverable to others nearby.")
                .setSmallIcon(R.drawable.ic_launcher_background)
                .setContentIntent(pendingIntent)
                .build();

        startForeground(FOREGROUND_NOTIFICATION_ID, n);
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private String createNotificationChannel(String channelId, String channelName) {
        NotificationChannel chan = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_NONE);
        chan.setLightColor(Color.BLUE);
        chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        NotificationManager service = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        service.createNotificationChannel(chan);
        return channelId;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        return START_STICKY;
    }

    /**
     * Starts BLE Advertising.
     */
    private void startAdvertising() {
        goForeground();

        if (advertiseCallback == null) {
            sendSignalAndLog("Service: Starting Advertising");

            AdvertiseSettings settings = buildAdvertiseSettings();
            AdvertiseData data = buildAdvertiseData();
            advertiseCallback = new SampleAdvertiseCallback();
            if (bluetoothLeAdvertiser != null) {
                bluetoothLeAdvertiser.startAdvertising(settings, data,
                        advertiseCallback);
            }
        }
    }

    /**
     * Stops BLE Advertising.
     */
    private void stopAdvertising() {
        sendSignalAndLog("Service: Stopping Advertising");


        if (bluetoothLeAdvertiser != null) {
            bluetoothLeAdvertiser.stopAdvertising(advertiseCallback);
            advertiseCallback = null;
        }
    }

    /**
     * Refresh Advertising
     */
    private void refreshAdvertiser() {
        sendSignalAndLog("Refresh Advertiser");
        stopAdvertising();
        startAdvertising();
    }

    /**
     * Setup Timer to Auto Refresh Advertising
     */
    private void startAdvertisingAutoRefresh() {
        handler.postDelayed(autoRefreshTimerRunnable, 120000);
    }

    /**
     * Stop Advertising Auto Refresh Timer
     */
    private void stopAdvertisingAutoRefresh() {
        handler.removeCallbacks(autoRefreshTimerRunnable);
    }

    /**
     * Returns an AdvertiseData object which includes the Service UUID and Device Name.
     */
    private AdvertiseData buildAdvertiseData() {
        /**
         * Note: There is a strict limit of 31 Bytes on packets sent over BLE Advertisements.
         *  This includes everything put into AdvertiseData including UUIDs, device info, &
         *  arbitrary service or manufacturer data.
         *  Attempting to send packets over this limit will result in a failure with error code
         *  AdvertiseCallback.ADVERTISE_FAILED_DATA_TOO_LARGE. Catch this error in the
         *  onStartFailure() method of an AdvertiseCallback implementation.
         */
        String id = user.getUserNanoId();
        AdvertiseData.Builder dataBuilder = new AdvertiseData.Builder();
        dataBuilder.addServiceUuid(Constants.Service_UUID);
        //dataBuilder.setIncludeDeviceName(true);
        //dataBuilder.addServiceData(Constants.Service_UUID, ByteUtils.intToByteArray(id));
        dataBuilder.addServiceData(Constants.Service_UUID, id.getBytes());
        /* For example - this will cause advertising to fail (exceeds size limit) */
        // String failureData = "asdghkajsghalkxcjhfa;sghtalksjcfhalskfjhasldkjfhdskf";
        // dataBuilder.addServiceData(Constants.Service_UUID, failureData.getBytes());
        return dataBuilder.build();
    }

    /**
     * Returns an AdvertiseSettings object set to use low power (to help preserve battery life)
     * and disable the built-in timeout since this code uses its own timeout runnable.
     */

    private AdvertiseSettings buildAdvertiseSettings() {
        AdvertiseSettings.Builder settingsBuilder = new AdvertiseSettings.Builder();
        settingsBuilder.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_POWER);
        settingsBuilder.setTimeout(0);
        return settingsBuilder.build();
    }

    /**
     * Custom callback after Advertising succeeds or fails to start. Broadcasts the error code
     * in an Intent to be picked up by AdvertiserFragment and stops this Service.
     */
    private class SampleAdvertiseCallback extends AdvertiseCallback {
        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
            sendSignalAndLog("Advertising failed");
            stopSelf();
        }

        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);
            sendSignalAndLog("Advertising successfully started");
        }
    }

    private void sendSignalAndLog(CharSequence text) {
        Intent failureIntent = new Intent();
        failureIntent.setAction(ADVERTISING_MESSAGE);
        failureIntent.putExtra(ADVERTISING_MESSAGE_EXTRA_MESSAGE, text);
        sendBroadcast(failureIntent);
    }

    /**
     * Wake lock
     */
    private void initWakeLock() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK | PowerManager.ON_AFTER_RELEASE,
                "AdvertiserService::lock");
    }

    private void releaseWakeLock() {
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
        } catch (Exception e) {

        }
    }

    /**
     * Alarm for forever running
     */

    private void initAlarm() {
        Intent ll24 = new Intent(AdvertiserService.this, BootCompletedReceiver.class);
        PendingIntent recurringLl24 = PendingIntent.getBroadcast(AdvertiserService.this, 0, ll24, PendingIntent.FLAG_CANCEL_CURRENT);
        AlarmManager alarms = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        alarms.setRepeating(AlarmManager.RTC_WAKEUP, Calendar.getInstance().getTime().getTime(), AlarmManager.INTERVAL_FIFTEEN_MINUTES, recurringLl24);
    }

    /**
     * Helper
     */

    public static boolean isRunning(Context context) {
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (AdvertiserService.class.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isEnabled(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("Advertising", Context.MODE_PRIVATE);
        return prefs.getBoolean("service_enabled", false);
    }

    public static void enable(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("Advertising", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean("service_enabled", true);
        editor.apply();
    }

    public static void disable(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("Advertising", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean("service_enabled", false);
        editor.apply();
    }

}
