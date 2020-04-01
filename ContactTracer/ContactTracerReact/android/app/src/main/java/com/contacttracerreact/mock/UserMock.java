package com.contacttracerreact.mock;

import android.content.Context;
import android.content.SharedPreferences;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

public class UserMock implements User {

    private Context context;

    public UserMock(Context context) {
        this.context = context;
    }

    @Override
    public int getUserId() {
        SharedPreferences prefs = context.getSharedPreferences("User", Context.MODE_PRIVATE);
        int userId = prefs.getInt("user_id", 0);
        if (userId > 0)
            return userId;

        userId = (int) Math.round(Math.random() * 1000000);

        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt("user_id", userId);
        editor.apply();

        return userId;
    }

    @Override
    public String getUserNanoId() {
        SharedPreferences prefs = context.getSharedPreferences("User", Context.MODE_PRIVATE);
        String userId = prefs.getString("user_nano_id", "");
        if (!userId.equals(""))
            return userId;

        userId = NanoIdUtils.randomNanoId().substring(0, 20);

        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("user_nano_id", userId);
        editor.apply();

        return userId;
    }
}
