package com.thaialert.app.mock;

import android.content.Context;
import android.content.SharedPreferences;

public class User implements IUser {

    private Context context;

    public User(Context context) {
        this.context = context;
    }

    @Override
    public void setUserId(String userId) {
        SharedPreferences prefs = context.getSharedPreferences("User", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("user_id", userId);
        editor.apply();
    }

    @Override
    public String getUserId() {
        SharedPreferences prefs = context.getSharedPreferences("User", Context.MODE_PRIVATE);
        String userId = prefs.getString("user_id", "");
        if (!userId.equals(""))
            return userId;

        return "NOID";
    }
}
