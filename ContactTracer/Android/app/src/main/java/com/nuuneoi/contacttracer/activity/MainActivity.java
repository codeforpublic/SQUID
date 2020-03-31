package com.nuuneoi.contacttracer.activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.ParcelUuid;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.webkit.PermissionRequest;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import com.nuuneoi.contacttracer.R;
import com.nuuneoi.contacttracer.mock.User;
import com.nuuneoi.contacttracer.mock.UserMock;
import com.nuuneoi.contacttracer.service.AdvertiserService;
import com.nuuneoi.contacttracer.utils.BluetoothUtils;
import com.nuuneoi.contacttracer.utils.ByteUtils;
import com.nuuneoi.contacttracer.utils.Constants;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity implements View.OnClickListener, CompoundButton.OnCheckedChangeListener {

    private static final String TAG = "MainActivity";

    private static final int PERMISSIONS_REQUEST_LOCATION = 1001;

    // Bluetooth General
    private BluetoothAdapter bluetoothAdapter;

    // Bluetooth Advertiser Service
    private BroadcastReceiver advertiserMessageReceiver;

    // Bluetooth Scanner
    private BluetoothLeScanner bluetoothLeScanner;
    private SampleScanCallback scanCallback;
    private Handler handler;

    // for bluetooth turning on request
    private static int REQUEST_ENABLE_BT = 1001;

    // Bluetooth max scan time in milliseconds
    private static final long SCAN_PERIOD = 30000;

    // Instances
    Button btnStartScanning;
    TextView tvStatus;
    CheckBox cbServiceOn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (!BluetoothUtils.isBLEAvailable(MainActivity.this)) {
            exithWithToast(R.string.ble_not_supported);
            return;
        }

        User user = new UserMock(MainActivity.this);
        String userId = user.getUserNanoId();
        setTitle("Contact Tracer (User ID: " + userId + ")");

        initInstances();
        initAdvertiserReceiver();

        if (!isLocationPermissionGranted()) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION)) {
                new AlertDialog.Builder(MainActivity.this)
                        .setMessage(R.string.location_permission_needed_dialog_content)
                        .setTitle(R.string.location_permission_needed_dialog_header)
                        .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                // No explanation needed; request the permission
                                ActivityCompat.requestPermissions(MainActivity.this,
                                        new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                                        PERMISSIONS_REQUEST_LOCATION);
                            }
                        })
                        .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {        //idea calling showMessage funtion again
                                exithWithToast(R.string.location_permission_needed);
                            }
                        })
                        .create()
                        .show();
            } else {
                // No explanation needed; request the permission
                ActivityCompat.requestPermissions(MainActivity.this,
                        new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                        PERMISSIONS_REQUEST_LOCATION);
            }
            return;
        }

        initializeFullSteps();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected void onResume() {
        super.onResume();

        IntentFilter failureFilter = new IntentFilter(AdvertiserService.ADVERTISING_MESSAGE);
        registerReceiver(advertiserMessageReceiver, failureFilter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(advertiserMessageReceiver);
    }

    private void initInstances() {
        tvStatus = (TextView) findViewById(R.id.tvStatus);

        btnStartScanning = (Button) findViewById(R.id.btnStartScanning);
        btnStartScanning.setOnClickListener(this);

        cbServiceOn = (CheckBox) findViewById(R.id.cbServiceOn);
        cbServiceOn.setOnCheckedChangeListener(this);

        handler = new Handler();
    }

    private void initializeFullSteps() {
        if (!initializeStep1())
            return;

        initializeStep2();
    }

    private boolean initializeStep1() {
        initBluetoothInstances();

        if (bluetoothAdapter == null)
            exithWithToast(R.string.ble_not_supported);

        if (!isBluetoothTurnedOn()) {
            tryToTurnBluetoothOn();
            return false;
        }

        return true;
    }

    private void initializeStep2() {
        if (AdvertiserService.isRunning(MainActivity.this))
            appendStatusText("Service is already running");

        boolean serviceEnabled = AdvertiserService.isEnabled(MainActivity.this);
        cbServiceOn.setChecked(serviceEnabled);
        if (serviceEnabled) {
            startAdvertiserService();
        } else {
            stopAdvertiserService();
        }

        initBluetoothScanner();
    }

    private void exithWithToast(int string_resource_id) {
        Toast.makeText(this, string_resource_id, Toast.LENGTH_SHORT).show();
        finish();
    }

    /*************
     * Bluetooth *
     *************/

    private void initBluetoothInstances() {
        final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
    }

    private boolean isBluetoothTurnedOn() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled())
            return false;
        return true;
    }

    private void tryToTurnBluetoothOn() {
        Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
    }

    /************************
     * Bluetooth Advertiser *
     ************************/

    private void initAdvertiserReceiver() {
        advertiserMessageReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String message = intent.getStringExtra(AdvertiserService.ADVERTISING_MESSAGE_EXTRA_MESSAGE);
                appendStatusText(message);
            }
        };
    }

    private void startAdvertiserService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            startForegroundService(new Intent(MainActivity.this, AdvertiserService.class));
        else
            startService(new Intent(MainActivity.this, AdvertiserService.class));
    }

    private void stopAdvertiserService() {
        stopService(new Intent(MainActivity.this, AdvertiserService.class));
    }

    /*********************
     * Bluetooth Scanner *
     *********************/

    private void initBluetoothScanner() {
        bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
    }

    /**
     * Start scanning for BLE Advertisements (& set it up to stop after a set period of time).
     */
    public void startScanning() {
        if (scanCallback == null) {
            appendStatusText("Start Scanning");

            // Will stop the scanning after a set time.
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    stopScanning();
                }
            }, SCAN_PERIOD);
            // Kick off a new scan.
            scanCallback = new SampleScanCallback();
            bluetoothLeScanner.startScan(buildScanFilters(), buildScanSettings(), scanCallback);
            String toastText = getString(R.string.scan_start_toast) + " "
                    + TimeUnit.SECONDS.convert(SCAN_PERIOD, TimeUnit.MILLISECONDS) + " "
                    + getString(R.string.seconds);
            Toast.makeText(MainActivity.this, toastText, Toast.LENGTH_LONG).show();
        } else {
            Toast.makeText(MainActivity.this, R.string.already_scanning, Toast.LENGTH_SHORT).show();
        }
    }
    /**
     * Stop scanning for BLE Advertisements.
     */
    public void stopScanning() {
        appendStatusText("Stop Scanning");

        // Stop the scan, wipe the callback.
        bluetoothLeScanner.stopScan(scanCallback);
        scanCallback = null;
        // Even if no new results, update 'last seen' times.
        //mAdapter.notifyDataSetChanged();
    }


    /**
     * Return a List of {@link ScanFilter} objects to filter by Service UUID.
     */
    private List<ScanFilter> buildScanFilters() {
        List<ScanFilter> scanFilters = new ArrayList<>();
        ScanFilter.Builder builder = new ScanFilter.Builder();
        // Comment out the below line to see all BLE devices around you
        builder.setServiceUuid(Constants.Service_UUID);
        scanFilters.add(builder.build());
        return scanFilters;
    }
    /**
     * Return a {@link ScanSettings} object set to use low power (to preserve battery life).
     */
    private ScanSettings buildScanSettings() {
        ScanSettings.Builder builder = new ScanSettings.Builder();
        builder.setScanMode(ScanSettings.SCAN_MODE_LOW_POWER);
        return builder.build();
    }

    /**
     * Custom ScanCallback object - adds to adapter on success, displays error on failure.
     */
    private class SampleScanCallback extends ScanCallback {
        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            super.onBatchScanResults(results);
            for (ScanResult result : results) {
                byte[] data = result.getScanRecord().getServiceData(Constants.Service_UUID);
                //int value = ByteUtils.byteArrayToInt(data);
                String value = new String(data);
                appendStatusText("***** Found Nearby Device with User ID: " + value);
            }
        }
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            super.onScanResult(callbackType, result);
            byte[] data = result.getScanRecord().getServiceData(Constants.Service_UUID);
            //int value = ByteUtils.byteArrayToInt(data);
            //String value = new String(data);
            String value;
            if (data != null)
                value = new String(data);
            else
                value = result.getDevice().getName();
            appendStatusText("***** Found Nearby Device with User ID: " + value);
        }
        @Override
        public void onScanFailed(int errorCode) {
            super.onScanFailed(errorCode);
            Toast.makeText(MainActivity.this, "Scan failed with error: " + errorCode, Toast.LENGTH_LONG)
                    .show();
        }
    }

    /*****************
     * Status Report *
     *****************/

    private void appendStatusText(CharSequence text) {
        tvStatus.setText(text + "\n" + tvStatus.getText());
    }


    /**
     * Button Click Handling
     */
    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnStartScanning)
            startScanning();
    }

    /**
     * Checkbox Changed Handling
     */
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if (buttonView.getId() == R.id.cbServiceOn) {
            if (isChecked) {
                AdvertiserService.enable(MainActivity.this);
                startAdvertiserService();
            } else {
                AdvertiserService.disable(MainActivity.this);
                stopAdvertiserService();
            }
        }
    }

    /**
     * Permission Request
     */

    private boolean isLocationPermissionGranted() {
        return ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_LOCATION) {
            if (!isLocationPermissionGranted()) {
                exithWithToast(R.string.location_permission_needed);
                return;
            }

            initializeFullSteps();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Keep launching Bluetooth
        if (requestCode == REQUEST_ENABLE_BT) {
            if (!isBluetoothTurnedOn()) {
                exithWithToast(R.string.bluetooth_need_to_be_turned_on);
                return;
            }

            initializeStep2();
            return;
        }
    }

}
