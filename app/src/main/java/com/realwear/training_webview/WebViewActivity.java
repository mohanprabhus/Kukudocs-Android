package com.realwear.training_webview;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;

public class WebViewActivity extends Activity {

    private final String stringURL = "file:///android_asset/custom_index.html";

    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);

        final WebView webview = findViewById(R.id.webview);
        final WebSettings webSettings = webview.getSettings();

        if (webSettings != null) {
            webSettings.setJavaScriptEnabled(true);
            webSettings.setLoadWithOverviewMode(true);
            webSettings.setUseWideViewPort(true);
        }

        webview.addJavascriptInterface(new WebAppInterface(this), "Android");
        webview.loadData("", "text/html", null);
        webview.loadUrl(stringURL);

    }

    private static class WebAppInterface {
        private static final String TAG = "WebAppInterface";
        private Context mContext;

        WebAppInterface(Context context) {
            mContext = context;
        }

        @JavascriptInterface
        public String readFile(String filename) {
            try {
                final InputStream stream = mContext.getResources().getAssets().open(filename);
                final byte[] data = IOUtils.toByteArray(stream);

                return new String(Base64.encode(data, Base64.DEFAULT), "ASCII");
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }
}
