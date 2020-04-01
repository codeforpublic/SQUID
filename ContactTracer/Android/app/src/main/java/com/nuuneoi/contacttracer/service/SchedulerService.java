package com.nuuneoi.contacttracer.service;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

public class SchedulerService extends JobService {
    @Override
    public boolean onStartJob(JobParameters params) {
        Toast.makeText(this, "Job", Toast.LENGTH_LONG).show();

        boolean serviceEnabled = TracerService.isEnabled(this);
        if (serviceEnabled) {
            startAdvertiserService(this);
        } else {
            stopAdvertiserService(this);
        }

        return false;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
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
