package com.example.airtrkcompanion;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.widget.ImageView;
import com.squareup.picasso.Picasso;
public class MainActivity extends FullscreenActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);


        ImageView imageView = findViewById(R.id.BackgroundImg);
        String imageUrl = "https://example.com/image.jpg";

        Picasso.get()
                .load(imageUrl)
                .placeholder(R.drawable.background)
                .into(imageView);
    }


}
