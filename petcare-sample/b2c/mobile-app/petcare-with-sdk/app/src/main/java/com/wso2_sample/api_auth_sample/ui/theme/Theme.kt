package com.wso2_sample.api_auth_sample.ui.theme

import android.app.Activity
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.wso2_sample.api_auth_sample.ui.theme.shapes

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF69A2F4),
    onPrimary = Color(0xFF69A2F4),
    primaryContainer = Color(0xFF69A2F4),
    secondary = Color(0xFFFFEC88),
    secondaryContainer = Color(0xFFFFEC88),
    tertiary = Color(0xFF3E4747),
    tertiaryContainer = Color(0xFF939B9B),
    surface = Color(0xFFFEFEFE),
    background = Color(0xFFF4F4F4),
    error = Color(0xFFF4538A),
    outlineVariant = Color(0xFF939B9B),
)

@Composable
fun Api_authenticator_sdkTheme(
    content: @Composable () -> Unit
) {
    CardDefaults.cardColors(
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onSurface
    )

    val colorScheme = LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = shapes,
        content = {
            CompositionLocalProvider(
                content = content
            )
        }
    )
}