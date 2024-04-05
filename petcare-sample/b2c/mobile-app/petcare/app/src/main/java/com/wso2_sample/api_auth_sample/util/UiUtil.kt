package com.wso2_sample.api_auth_sample.util

import android.content.SharedPreferences
import android.content.res.Resources
import android.content.res.Resources.Theme
import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowManager
import androidx.appcompat.app.ActionBar
import com.google.android.material.snackbar.Snackbar

class UiUtil {

    companion object {
        fun showSnackBar(layout: View, message: String) {
            val snackBar: Snackbar = Snackbar.make(layout, message, Snackbar.LENGTH_LONG)
            snackBar.show()
        }

        fun hideActionBar(supportActionBar: ActionBar) {
            try {
                supportActionBar.hide()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        fun writeToSharedPreferences(
            sharedPreferences: SharedPreferences,
            key: String,
            value: String
        ) {
            with(sharedPreferences.edit()) {
                putString(key, value)
                apply()
            }
        }

        fun readFromSharedPreferences(sharedPreferences: SharedPreferences, key: String): String? {
            return sharedPreferences.getString(key, null)
        }

        fun hideStatusBar(window: Window, resources: Resources, theme: Theme, color: Int) {
            // Fullscreen mode
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                window.statusBarColor = resources.getColor(color, theme)
            } else {
                window.setFlags(
                    WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN
                )
            }
        }
    }

}