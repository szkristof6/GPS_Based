package com.example.airtrkcompanion;

import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillOpacity;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillOutlineColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillPattern;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillTranslate;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.lineColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.lineWidth;

import android.app.Activity;
import android.content.pm.ActivityInfo;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.List;

import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.EditText;

import androidx.constraintlayout.widget.ConstraintLayout;
import android.content.SharedPreferences;

import android.os.Handler;

import com.mapbox.geojson.LineString;


import com.mapbox.mapboxsdk.geometry.LatLng;


import com.mapbox.mapboxsdk.Mapbox;

import com.mapbox.mapboxsdk.maps.MapView;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback;
import com.mapbox.mapboxsdk.maps.Style;

import com.mapbox.mapboxsdk.annotations.MarkerOptions;
import com.mapbox.mapboxsdk.annotations.Icon;
import com.mapbox.mapboxsdk.annotations.IconFactory;

import com.mapbox.mapboxsdk.style.layers.FillLayer;
import com.mapbox.mapboxsdk.style.layers.LineLayer;
import com.mapbox.mapboxsdk.style.layers.PropertyFactory;
import com.mapbox.mapboxsdk.style.layers.SymbolLayer;
import com.mapbox.mapboxsdk.style.sources.GeoJsonSource;

import com.mapbox.geojson.Feature;
import com.mapbox.geojson.FeatureCollection;
import com.mapbox.geojson.Geometry;
import com.mapbox.geojson.LineString;
import com.mapbox.geojson.Point;
import com.mapbox.geojson.Polygon;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class MainActivity extends AppCompatActivity {

    public MapView mapView;
    private SharedPreferences sharedPreferences;

    ArrayList<String> emailList = new ArrayList<>();
    ArrayList<String> passwordList = new ArrayList<>();

    private ConstraintLayout authLayout;
    private ConstraintLayout lobbyLayout;

    public TextView authError;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sharedPreferences = getSharedPreferences("Saved", MODE_PRIVATE);

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

        authError = findViewById(R.id.authError);

        // MapView inicializálása
        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);




        // MapView beállítása és térkép betöltése
        mapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(@NonNull MapboxMap mapboxMap) {
                mapboxMap.setStyle(Style.SATELLITE, new Style.OnStyleLoaded() {
                    @Override
                    public void onStyleLoaded(@NonNull Style style) {

                        Bitmap usaFlag = BitmapFactory.decodeResource(getResources(), R.drawable.usa);
                        Bitmap talibanFlag = BitmapFactory.decodeResource(getResources(), R.drawable.taliban);
                        Bitmap adminFlag = BitmapFactory.decodeResource(getResources(), R.drawable.admin);

                        // Create marker icons with desired properties
                        Icon adminIcon = IconFactory.getInstance(MainActivity.this)
                                .fromBitmap(adminFlag);
                        Icon usaIcon = IconFactory.getInstance(MainActivity.this)
                                .fromBitmap(usaFlag);
                        Icon talibanIcon = IconFactory.getInstance(MainActivity.this)
                                .fromBitmap(talibanFlag);

                        // JSON data representing the markers
                        String jsonData = "[\n" +
                                "  {\n" +
                                "    \"name\": \"0hq No. 0\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 0,\n" +
                                "    \"lng\": 17.362051248826333,\n" +
                                "    \"lat\": 46.65121716653675\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"0hq No. 1\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 0,\n" +
                                "    \"lng\": 17.641148554137175,\n" +
                                "    \"lat\": 47.23413564395298\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"0village No. 2\",\n" +
                                "    \"type\": \"village\",\n" +
                                "    \"team\": 0,\n" +
                                "    \"lng\": 17.639172786186123,\n" +
                                "    \"lat\": 47.235700139119245\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"1outpost No. 3\",\n" +
                                "    \"type\": \"outpost\",\n" +
                                "    \"team\": 1,\n" +
                                "    \"lng\": 17.641473510859953,\n" +
                                "    \"lat\": 47.236166311782455\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"1hq No. 4\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 1,\n" +
                                "    \"lng\": 17.644585869528697,\n" +
                                "    \"lat\": 47.23798537786632\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"2hq No. 6\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 2,\n" +
                                "    \"lng\": 17.641622805057153,\n" +
                                "    \"lat\": 47.23835528767495\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"2hq No. 7\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 2,\n" +
                                "    \"lng\": 17.646961602242015,\n" +
                                "    \"lat\": 47.236364176033106\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"2hq No. 8\",\n" +
                                "    \"type\": \"hq\",\n" +
                                "    \"team\": 2,\n" +
                                "    \"lng\": 17.647653390506548,\n" +
                                "    \"lat\": 47.239212974776564\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"2outpost No. 9\",\n" +
                                "    \"type\": \"outpost\",\n" +
                                "    \"team\": 2,\n" +
                                "    \"lng\": 17.648495566772738,\n" +
                                "    \"lat\": 47.239212974739274\n" +
                                "  },\n" +
                                "  {\n" +
                                "    \"name\": \"2outpost No. 10\",\n" +
                                "    \"type\": \"outpost\",\n" +
                                "    \"team\": 2,\n" +
                                "    \"lng\": 17.650214922578584,\n" +
                                "    \"lat\": 47.23585039248525\n" +
                                "  }\n" +
                                "]";

                        try {
                            // Parse the JSON data
                            JSONArray jsonArray = new JSONArray(jsonData);

                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject markerData = jsonArray.getJSONObject(i);
                                String name = markerData.getString("name");
                                String type = markerData.getString("type");
                                int team = markerData.getInt("team");
                                double lng = markerData.getDouble("lng");
                                double lat = markerData.getDouble("lat");

                                // Create the marker options based on type and team
                                MarkerOptions markerOptions = new MarkerOptions()
                                        .position(new LatLng(lat, lng))
                                        .title(name)
                                        .snippet("Type: " + type)
                                        .icon(getMarkerIcon(type, team));

                                // Add the marker to the map
                                mapboxMap.addMarker(markerOptions);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        // Create the polygon feature
                        Feature polygonFeature = Feature.fromGeometry(
                                Polygon.fromOuterInner(
                                        LineString.fromLngLats(
                                                convertCoordinatesToLatLngList(
                                                        "17.640279051764196,47.23375857667381",
                                                        "17.639036973078362,47.23450043567317",
                                                        "17.63599818152545,47.23580329735853",
                                                        "17.63850924227296,47.23881418478442",
                                                        "17.64243352222934,47.24232220130716",
                                                        "17.64922914571764,47.24210336826431",
                                                        "17.650483224903894,47.23795783889963",
                                                        "17.65181439946184,47.23792225590702",
                                                        "17.65186611381148,47.23565610445036",
                                                        "17.650499383895237,47.23478139847467",
                                                        "17.65215006769074,47.23402460731114",
                                                        "17.65148631216647,47.23305989738523",
                                                        "17.64882769583687,47.23268958883392",
                                                        "17.646143662625718,47.23382798637172",
                                                        "17.643282583950082,47.23306621441185",
                                                        "17.640279051764196,47.23375857667381"
                                                )
                                        )
                                )
                        );

                        // Create the feature collection
                        FeatureCollection featureCollection = FeatureCollection.fromFeatures(
                                new Feature[]{polygonFeature}
                        );

                        // Add the GeoJSON data to the map
                        style.addSource(new GeoJsonSource("polygon-source", featureCollection));
                        style.addLayerBelow(new LineLayer("polygon-border-layer", "polygon-source")
                                .withProperties(
                                        lineWidth(2f),
                                        lineColor(Color.RED)
                                ), "waterway-label");


                        // Add the marker image to the style
                        style.addImage("usa", usaFlag);
                        style.addImage("taliban", talibanFlag);
                        style.addImage("admin", adminFlag);

                        // Add the symbol layer to the map
                        style.addLayer(new SymbolLayer("marker-layer", "marker-source")
                                .withProperties(
                                        PropertyFactory.iconImage("custom-marker"),
                                        PropertyFactory.iconAllowOverlap(true),
                                        PropertyFactory.iconIgnorePlacement(true)
                                ));

                        // Add your marker coordinates here
                        LatLng markerLatLng = new LatLng(37.7749, -122.4194);

                        // Add the marker source to the style
                        style.addSource(new GeoJsonSource("marker-source",
                                FeatureCollection.fromFeatures(new Feature[]{
                                        Feature.fromGeometry(Point.fromLngLat(markerLatLng.getLongitude(), markerLatLng.getLatitude()))
                                })));
                    }
                });
            }
        });

        authLayout = findViewById(R.id.Auth);
        lobbyLayout = findViewById(R.id.Lobby);

        // Register button click listener
        Button registerButton = findViewById(R.id.regBtn);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText emailEditText = findViewById(R.id.email);
                EditText passwordEditText = findViewById(R.id.pass);

                String email = emailEditText.getText().toString();
                String password = passwordEditText.getText().toString();

                emailList.add(email);
                passwordList.add(password);

                Toast.makeText(MainActivity.this, "Registration successful!", Toast.LENGTH_SHORT).show();
            }
        });

        // Login button click listener
        Button loginButton = findViewById(R.id.loginBtn);
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText emailEditText = findViewById(R.id.email);
                EditText passwordEditText = findViewById(R.id.pass);

                String email = emailEditText.getText().toString();
                String password = passwordEditText.getText().toString();

                boolean isEmailValid = false;
                boolean isPasswordValid = false;

                for (int i = 0; i < emailList.size(); i++) {
                    if (emailList.get(i).equals(email)) {
                        isEmailValid = true;
                        if (passwordList.get(i).equals(password)) {
                            isPasswordValid = true;
                            break;
                        }
                    }
                }

                if (isEmailValid && isPasswordValid) {
                    // Save email and password in SharedPreferences
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    editor.putString("email", email);
                    editor.putString("password", password);
                    editor.apply();

                    Toast.makeText(MainActivity.this, "Login successful!", Toast.LENGTH_SHORT).show();
                } else {
                    String errorMessage = "";
                    if (!isEmailValid) {
                        errorMessage += "Invalid email. ";
                        authError.setText("Invalid email");
                    }
                    if (!isPasswordValid) {
                        errorMessage += "Invalid password.";
                        authError.setText("Invalid password");
                    }
                    Toast.makeText(MainActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Check SharedPreferences on startup
        checkSharedPreferences();

        // Create a Handler and Runnable for periodic checking
        Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                checkSharedPreferences();
                handler.postDelayed(this, 1000); // Repeat every 1 second
            }
        };

        // Start the periodic check
        handler.post(runnable);
    }

    private Icon getMarkerIcon(String type, int team) {
        int iconResId;
        int borderColor;
        float width = 50f;  // Desired width of the marker icon
        float height;       // Desired height of the marker icon

        // Determine the aspect ratio and icon based on the marker type
        switch (type) {
            case "hq":
                height = width * (9f / 14f); // Adjust the aspect ratio accordingly
                break;
            case "outpost":
                height = width  * (9f / 10f);
                break;
            case "village":
            default:
                height = width  * (10f / 10f);
                break;
        }

        switch (team) {
            case 0:
                iconResId = R.drawable.admin;
                borderColor = Color.RED;
                break;
            case 1:
                iconResId = R.drawable.usa;
                borderColor = Color.BLUE;
                break;
            case 2:
            default:
                iconResId = R.drawable.taliban;
                borderColor = Color.WHITE;
                break;
        }

        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), iconResId);
        Bitmap scaledBitmap = Bitmap.createScaledBitmap(bitmap, Math.round(width), Math.round(height), false);
        Bitmap borderBitmap = addBorderToBitmap(scaledBitmap, borderColor, 2);

        return IconFactory.getInstance(MainActivity.this)
                .fromBitmap(borderBitmap);
    }

    private Bitmap addBorderToBitmap(Bitmap bitmap, int color, int borderWidth) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();

        Bitmap borderBitmap = Bitmap.createBitmap(width + borderWidth * 2, height + borderWidth * 2, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(borderBitmap);

        Paint borderPaint = new Paint();
        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setColor(color);
        borderPaint.setStrokeWidth(borderWidth);
        borderPaint.setAntiAlias(true);

        // Define the border rectangle with sharp edges
        RectF borderRect = new RectF(
                borderWidth,
                borderWidth,
                width + borderWidth,
                height + borderWidth
        );

        canvas.drawBitmap(bitmap, borderWidth, borderWidth, null);
        canvas.drawRect(borderRect, borderPaint); // Draw a rectangular border

        return borderBitmap;
    }



    private void checkSharedPreferences() {
        String email = sharedPreferences.getString("email", null);
        String password = sharedPreferences.getString("password", null);

        if (email != null && password != null) {
            authLayout.setVisibility(View.GONE);
            lobbyLayout.setVisibility(View.VISIBLE);
        } else {
            authLayout.setVisibility(View.VISIBLE);
            lobbyLayout.setVisibility(View.GONE);
        }
    }

    private List<Point> convertCoordinatesToLatLngList(String... coordinates) {
        List<Point> latLngList = new ArrayList<>();
        for (String coordinate : coordinates) {
            String[] latLng = coordinate.split(",");
            double latitude = Double.parseDouble(latLng[1]);
            double longitude = Double.parseDouble(latLng[0]);
            latLngList.add(Point.fromLngLat(longitude, latitude));
        }
        return latLngList;
    }

    @Override
    protected void onResume() {
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
    protected void onPause() {
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
