package com.contacttracerreact.bridge;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.contacttracerreact.MainActivity;
import com.contacttracerreact.utils.BluetoothUtils;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import androidx.annotation.NonNull;

public class ContactTracerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static int REQUEST_ENABLE_BT = 1001;
    Promise tryToTurnBluetoothOn;

    BluetoothAdapter bluetoothAdapter;

    public ContactTracerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);

        initBluetoothInstances();
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
    private void isBluetoothTurnedOn(final Promise promise) {
        promise.resolve(_isBluetoothTurnedOn());
    }

    @ReactMethod
    private void tryToTurnBluetoothOn(final Promise promise) {
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
}
