package com.nuuneoi.contacttracer.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

import com.nuuneoi.contacttracer.service.TracerService;

public class BootCompletedReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        boolean serviceEnabled = TracerService.isEnabled(context);
        if (serviceEnabled) {
            startAdvertiserService(context);
        } else {
            stopAdvertiserService(context);
        }
    }

    private void startAdvertiserService(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            context.startForegroundService(new Intent(context, TracerService.class));
        else
            context.startService(new Intent(context, TracerService.class));
    }

    private void stopAdvertiserService(Context context) {
        context.stopService(new Intent(context, TracerService.class));
    }

}
