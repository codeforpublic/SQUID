package com.contacttracerreact;

import android.os.Bundle;
import android.widget.Toast;

import com.contacttracerreact.utils.BluetoothUtils;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ContactTracerReact";
  }
}
