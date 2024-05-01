package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.util.ui.UiUtil

@Composable
fun GetStarted() {
    Row(
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(
            modifier = Modifier.weight(1f),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Image(
                    painter = painterResource(id = R.drawable.circle_logo),
                    contentDescription = "Logo",
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.size(8.dp))
                Text(
                    text = "Get Started",
                    style = MaterialTheme.typography.titleLarge
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Best pet care starts here.",
                style = MaterialTheme.typography.labelLarge,
                color = Color(0xFF939B9B)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Schedule appointments & keep your furry friend healthy – all at your fingertips.",
                style = MaterialTheme.typography.labelMedium
            )
        }
        Image(
            painter = painterResource(id = R.drawable.person_dog_login),
            contentDescription = "Artist image",
            modifier = Modifier
                .size(UiUtil.getScreenHeight().dp/4, UiUtil.getScreenHeight().dp/4)
                .weight(0.64f)
        )
    }
}
