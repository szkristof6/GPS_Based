package com.example.airtrkcompanion;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import com.mapbox.maps.MapView;
import com.mapbox.maps.Style;
import android.os.Bundle;


import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends FullscreenActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

    }




}
