package com.realwear.training_webview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

public class WebViewActivity extends Activity {

    private final String stringURL = "file:///android_asset/custom_index.html";

    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);

        final WebView webview = findViewById(R.id.webview);
        final WebSettings webSettings = webview.getSettings();

        if (webSettings != null) {
            webSettings.setJavaScriptEnabled(true);
        }
        webview.addJavascriptInterface(new WebAppInterface(this), "Android");

        webview.loadData("", "text/html", null);
        webview.loadUrl(stringURL);

        String testingInput = "Passing this into javascript...";
        webview.loadUrl("javascript:setJavaArgument('testingInput')");
    }

    public String getFromAndroid() {
        return "Passing from java method into javascript";
    }

    private static class WebAppInterface {
        private static final String TAG = "WebAppInterface";
        private Context mContext;

        WebAppInterface(Context context) {
            mContext = context;
        }

        @JavascriptInterface
        public void foo() {

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
