package com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import com.wso2_sample.api_auth_sample.R

@Composable
fun FooterImage() {
    Box(
        contentAlignment = Alignment.BottomCenter
    ) {
        Image(
            painter = painterResource(R.drawable.animals_landing),
            contentDescription = "Landing Page Logo",
            modifier = Modifier.fillMaxWidth()
        )
    }
}
