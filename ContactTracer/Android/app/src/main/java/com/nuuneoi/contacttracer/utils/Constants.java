package com.nuuneoi.contacttracer.utils;

import android.os.ParcelUuid;

public class Constants {
    // Custom UUID for our service
    // It is needed to be in 0000XXXX-0000-1000-8000-00805f9b34fb format
    public static ParcelUuid Service_UUID = ParcelUuid.fromString("000086e1-0000-1000-8000-00805f9b34fb");

    // Bluetooth max scan time in milliseconds
    public static final long SCAN_PERIOD = 15000;

    // Bluetooth scan interval time in milliseconds
    public static final long SCAN_INTERVAL = 60000;

    // Interval for Advertiser service refreshing
    public static final long ADVERTISER_REFRESH_INTERVAL = 120000;
}
