package com.thaialert.app.bridge;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.widget.Toast;

import com.thaialert.app.mock.User;
import com.thaialert.app.service.TracerService;
import com.thaialert.app.utils.BluetoothUtils;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.NonNull;

public class ContactTracerModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {

    private static int REQUEST_ENABLE_BT = 1001;
    Promise tryToTurnBluetoothOn;

    BluetoothAdapter bluetoothAdapter;
    User user;

    private BroadcastReceiver advertiserMessageReceiver;
    private BroadcastReceiver nearbyDeviceFoundReceiver;

    public ContactTracerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
//        reactContext.addLifecycleEventListener(this);

        user = new User(getReactApplicationContext());

        initBluetoothInstances();

        initAdvertiserReceiver();
        initScannerReceiver();

        IntentFilter advertiserMessageFilter = new IntentFilter(TracerService.ADVERTISING_MESSAGE);
        getReactApplicationContext().registerReceiver(advertiserMessageReceiver, advertiserMessageFilter);

        IntentFilter nearbyDeviceFoundFilter = new IntentFilter(TracerService.NEARBY_DEVICE_FOUND_MESSAGE);
        getReactApplicationContext().registerReceiver(nearbyDeviceFoundReceiver, nearbyDeviceFoundFilter);
    }

    @NonNull
    @Override
    public String getName() {
        return "ContactTracerModule";
    }

    private void initBluetoothInstances() {
        final BluetoothManager bluetoothManager = (BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
    }

    @ReactMethod
    public void initialize(final Promise promise) {
        promise.resolve(null);
    }

    @ReactMethod
    public void isBLEAvailable(final Promise promise) {
        boolean isBLEAvailable = BluetoothUtils.isBLEAvailable(getReactApplicationContext().getApplicationContext());
        promise.resolve(isBLEAvailable);
    }

    @ReactMethod
    public void isMultipleAdvertisementSupported(final Promise promise) {
        if (bluetoothAdapter == null) {
            promise.resolve(false);
            return;
        }
        boolean isMultipleAdvertisementSupported = BluetoothUtils.isMultipleAdvertisementSupported(bluetoothAdapter);
        promise.resolve(isMultipleAdvertisementSupported);
    }

    private boolean _isBluetoothTurnedOn() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled())
            return false;
        return true;
    }

    @ReactMethod
    public void isBluetoothTurnedOn(final Promise promise) {
        promise.resolve(_isBluetoothTurnedOn());
    }

    @ReactMethod
    public void tryToTurnBluetoothOn(final Promise promise) {
        tryToTurnBluetoothOn = promise;
        Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        getReactApplicationContext().getCurrentActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
    }

    // Activity Result

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_ENABLE_BT) {
            tryToTurnBluetoothOn.resolve(_isBluetoothTurnedOn());
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    // Background Service

    @ReactMethod
    public void setUserId(String userId, final Promise promise) {
        user.setUserId(userId);
        promise.resolve(userId);
    }

    @ReactMethod
    public void getUserId(final Promise promise) {
        promise.resolve(user.getUserId());
    }

    @ReactMethod
    public void isTracerServiceEnabled(final Promise promise) {
        boolean isEnabled = TracerService.isEnabled(getReactApplicationContext());
        promise.resolve(isEnabled);
    }

    @ReactMethod
    public void enableTracerService(final Promise promise) {
        TracerService.enable(getReactApplicationContext());
        _startTracerService(getReactApplicationContext());
        promise.resolve(null);
    }

    @ReactMethod
    public void disableTracerService(final Promise promise) {
        TracerService.disable(getReactApplicationContext());
        _stopTracerService(getReactApplicationContext());
        promise.resolve(null);
    }

    @ReactMethod
    public void refreshTracerServiceStatus(final Promise promise) {
        if (TracerService.isEnabled(getReactApplicationContext())) {
            _startTracerService(getReactApplicationContext());
            promise.resolve(true);
        } else {
            _stopTracerService(getReactApplicationContext());
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void stopTracerServiceService(final Promise promise) {
        _stopTracerService(getReactApplicationContext());
        promise.resolve(true);
    }

    private void _startTracerService(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            context.startForegroundService(new Intent(context, TracerService.class));
        else
            context.startService(new Intent(context, TracerService.class));
    }

    private void _stopTracerService(Context context) {
        context.stopService(new Intent(context, TracerService.class));
    }

    // Broadcast Receiver and Event Emitter


    private void initAdvertiserReceiver() {
        advertiserMessageReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String message = intent.getStringExtra(TracerService.ADVERTISING_MESSAGE_EXTRA_MESSAGE);

                WritableMap params = Arguments.createMap();
                params.putString("message", message);

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("AdvertiserMessage", params);
            }
        };
    }


    private void initScannerReceiver() {
        nearbyDeviceFoundReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String name = intent.getStringExtra(TracerService.NEARBY_DEVICE_FOUND_EXTRA_NAME);
                int rssi = intent.getIntExtra(TracerService.NEARBY_DEVICE_FOUND_EXTRA_RSSI, 0);

                WritableMap params = Arguments.createMap();
                params.putString("name", name);
                params.putInt("rssi", rssi);

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NearbyDeviceFound", params);
            }
        };
    }

    // Life Cycle

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        try {
            getReactApplicationContext().unregisterReceiver(advertiserMessageReceiver);
        } catch (IllegalArgumentException e) {

        }
        try {
            getReactApplicationContext().unregisterReceiver(nearbyDeviceFoundReceiver);
        } catch (IllegalArgumentException e) {

        }
    }
}
