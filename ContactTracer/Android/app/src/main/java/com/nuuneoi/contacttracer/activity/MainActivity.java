package com.nuuneoi.contacttracer.activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import com.nuuneoi.contacttracer.R;
import com.nuuneoi.contacttracer.mock.User;
import com.nuuneoi.contacttracer.mock.UserMock;
import com.nuuneoi.contacttracer.service.TracerService;
import com.nuuneoi.contacttracer.utils.BluetoothUtils;

public class MainActivity extends AppCompatActivity implements CompoundButton.OnCheckedChangeListener {

    private static final String TAG = "MainActivity";

    private static final int PERMISSIONS_REQUEST_LOCATION = 1001;

    // Bluetooth General
    private BluetoothAdapter bluetoothAdapter;

    // Bluetooth Tracer Service Receiver
    private BroadcastReceiver advertiserMessageReceiver;
    private BroadcastReceiver nearbyDeviceFoundReceiver;

    // for bluetooth turning on request
    private static int REQUEST_ENABLE_BT = 1001;

    // Instances
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
        initScannerReceiver();

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

        IntentFilter advertiserMessageFilter = new IntentFilter(TracerService.ADVERTISING_MESSAGE);
        registerReceiver(advertiserMessageReceiver, advertiserMessageFilter);

        IntentFilter nearbyDeviceFoundFilter = new IntentFilter(TracerService.NEARBY_DEVICE_FOUND_MESSAGE);
        registerReceiver(nearbyDeviceFoundReceiver, nearbyDeviceFoundFilter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(nearbyDeviceFoundReceiver);
        unregisterReceiver(advertiserMessageReceiver);
    }

    private void initInstances() {
        tvStatus = (TextView) findViewById(R.id.tvStatus);

        cbServiceOn = (CheckBox) findViewById(R.id.cbServiceOn);
        cbServiceOn.setOnCheckedChangeListener(this);
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
        if (TracerService.isRunning(MainActivity.this))
            appendStatusText("Service is already running");

        boolean serviceEnabled = TracerService.isEnabled(MainActivity.this);
        cbServiceOn.setChecked(serviceEnabled);
        if (serviceEnabled) {
            startTracerService();
        } else {
            stopTracerService();
        }
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
                String message = intent.getStringExtra(TracerService.ADVERTISING_MESSAGE_EXTRA_MESSAGE);
                appendStatusText(message);
            }
        };
    }

    /*********************
     * Bluetooth Scanner *
     *********************/

    private void initScannerReceiver() {
        nearbyDeviceFoundReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String name = intent.getStringExtra(TracerService.NEARBY_DEVICE_FOUND_EXTRA_NAME);
                int rssi = intent.getIntExtra(TracerService.NEARBY_DEVICE_FOUND_EXTRA_RSSI, 0);

                appendStatusText("");
                appendStatusText("***** RSSI: " + rssi);
                appendStatusText("***** Found Nearby Device: " + name);
                appendStatusText("");
            }
        };
    }

    /**********************
     * Background Service *
     **********************/

    private void startTracerService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            startForegroundService(new Intent(MainActivity.this, TracerService.class));
        else
            startService(new Intent(MainActivity.this, TracerService.class));
    }

    private void stopTracerService() {
        stopService(new Intent(MainActivity.this, TracerService.class));
    }

    /*****************
     * Status Report *
     *****************/

    private void appendStatusText(CharSequence text) {
        tvStatus.setText(text + "\n" + tvStatus.getText());
    }

    /**
     * Checkbox Changed Handling
     */
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if (buttonView.getId() == R.id.cbServiceOn) {
            if (isChecked) {
                TracerService.enable(MainActivity.this);
                startTracerService();
            } else {
                TracerService.disable(MainActivity.this);
                stopTracerService();
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
