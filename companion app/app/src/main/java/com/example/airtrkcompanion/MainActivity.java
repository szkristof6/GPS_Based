package com.example.airtrkcompanion;

import android.app.Activity;
import android.content.pm.ActivityInfo;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.mapboxsdk.maps.MapView;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback;
import com.mapbox.mapboxsdk.maps.Style;

import androidx.appcompat.app.AppCompatActivity;
import androidx.annotation.NonNull;

public class MainActivity extends AppCompatActivity {

    public MapView mapView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Teljes képernyő mód beállítása
        requestWindowFeature(Window.FEATURE_NO_TITLE); // Ezt a sort adja hozzá a setContentView() elé.

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        // Navigációs sáv elrejtése
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        decorView.setSystemUiVisibility(uiOptions);

        // Mapbox inicializálása
        Mapbox.getInstance(this, "pk.eyJ1IjoiYnJ5Y2tlciIsImEiOiJjbGNiemR2NGwweTM5M29tcGoxaDI1ZHl4In0.9MSEB41XBJCs7K5CaSSAHw");

        setContentView(R.layout.activity_main);



        // Képernyő orientáció beállítása
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        // MapView inicializálása
        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);

        // MapView beállítása és térkép betöltése
        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(@NonNull MapboxMap mapboxMap) {
                mapboxMap.setStyle(Style.SATELLITE, new Style.OnStyleLoaded() {
                    @Override
                    public void onStyleLoaded(@NonNull Style style) {
                        // A térkép fel van állítva, és a stílus betöltődött. Itt hozzáadhatsz adatokat vagy módosíthatod a térképet.
                    }
                });
            }
        });
    }

    // MapView életciklus metódusok hozzáadása az activity életciklus metódusaihoz
    @Override
    public void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mapView.onStop();
    }

    @Override
    public void onPause() {
        super.onPause();
        mapView.onPause();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
    }
}
