package com.thaialert.app;

import android.widget.Toast;
import android.content.Context; 
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.huawei.hms.api.HuaweiApiAvailability;
import com.google.android.gms.common.GoogleApiAvailability;

public class RNHmsBase extends ReactContextBaseJavaModule {

    public RNHmsBase(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // ReactContextBaseJavaModule requires derived class implement getName method. This function returns a string.
    // This string is used to tag the native module on the JavaScript side
    @Override
    public String getName() {
        return "HMSBase";
    }

    // Gets the application package name
    // To export a method for JavaScript use, Java methods need to use the @reactmethod annotation
    @ReactMethod
    public void getPackageName() {
        Toast.makeText(getReactApplicationContext(),"RNHMSBase has been called",Toast.LENGTH_LONG).show();
    }
    
    // Check is the device support HMS service 
    // To export a method for JavaScript use, Java methods need to use the @reactmethod annotation
    @ReactMethod
    public boolean isHmsAvailable() { 
        boolean isAvailable = false; 
        Context context = getReactApplicationContext();
        if (null != context) { 
            int result = HuaweiApiAvailability.getInstance().isHuaweiMobileServicesAvailable(context); 
            isAvailable = (com.huawei.hms.api.ConnectionResult.SUCCESS == result); 
        } 
        Log.i("React", "isHmsAvailable: " + isAvailable); 
        return isAvailable; 
    }

    // Check is the device support GMS service 
    // To export a method for JavaScript use, Java methods need to use the @reactmethod annotation
    @ReactMethod
    public boolean isGmsAvailable() {
        boolean isAvailable = false; 
        Context context = getReactApplicationContext();
        if (null != context) {
            int result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context); 
            isAvailable = (com.google.android.gms.common.ConnectionResult.SUCCESS == result);
        } 
        Log.i("React", "isGmsAvailable: " + isAvailable);
        return isAvailable;
    }

}