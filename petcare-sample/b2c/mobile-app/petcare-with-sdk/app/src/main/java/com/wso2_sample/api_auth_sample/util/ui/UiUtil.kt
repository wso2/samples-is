package com.wso2_sample.api_auth_sample.util.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalConfiguration

object UiUtil {
    @Composable
    fun getScreenHeight(): Int {
        val configuration = LocalConfiguration.current
        return configuration.screenHeightDp
    }
    @Composable
    fun getScreenWidth(): Int {
        val configuration = LocalConfiguration.current
        return configuration.screenWidthDp
    }
}