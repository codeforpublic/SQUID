package com.thaialert.app.utils;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.pm.PackageManager;

public class BluetoothUtils {

    public static boolean isBLEAvailable(Context context) {
        // Use this check to determine whether BLE is supported on the device. Then
        // you can selectively disable BLE-related features.
        return context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE);
    }

    public static boolean isMultipleAdvertisementSupported(BluetoothAdapter bluetoothAdapter) {
        return bluetoothAdapter.isMultipleAdvertisementSupported();
    }


}
