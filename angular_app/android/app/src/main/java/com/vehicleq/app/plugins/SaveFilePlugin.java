package com.vehicleq.app.plugins;

import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "SaveFile")
public class SaveFilePlugin extends Plugin {

    @PluginMethod
    public void createDocument(PluginCall call) {
        String fileName = call.getString("fileName", "export.json");
        String mimeType = call.getString("mimeType", "application/octet-stream");

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, fileName);

        startActivityForResult(call, intent, "createDocumentResult");
    }

    @ActivityCallback
    private void createDocumentResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }

        Intent data = result.getData();
        if (data == null || data.getData() == null) {
            call.reject("CANCELED");
            return;
        }

        Uri uri = data.getData();
        JSObject ret = new JSObject();
        ret.put("uri", uri.toString());
        call.resolve(ret);
    }

    @PluginMethod
    public void writeToUri(PluginCall call) {
        String uriString = call.getString("uri");
        String data = call.getString("data");

        if (uriString == null || uriString.isEmpty()) {
            call.reject("MISSING_URI");
            return;
        }
        if (data == null) {
            call.reject("MISSING_DATA");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            OutputStream out = getContext().getContentResolver().openOutputStream(uri, "wt");
            if (out == null) {
                call.reject("FILE_NOTCREATED");
                return;
            }
            out.write(data.getBytes("UTF-8"));
            out.flush();
            out.close();
            call.resolve();
        } catch (Exception e) {
            call.reject("WRITE_FAILED", e);
        }
    }
}
