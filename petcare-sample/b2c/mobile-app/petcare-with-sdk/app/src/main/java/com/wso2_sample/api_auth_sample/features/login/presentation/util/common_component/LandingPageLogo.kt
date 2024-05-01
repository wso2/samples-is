package com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.util.ui.UiUtil

@Composable
fun LandingPageLogo() {
    Image(
        painter = painterResource(R.drawable.landing_page_logo),
        contentDescription = "Landing Page Logo",
        modifier = Modifier.size(UiUtil.getScreenHeight().dp / 4, UiUtil.getScreenHeight().dp / 4)
    )
}
