package com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ContinueText() {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp)
    ) {
        HorizontalDivider(
            modifier = Modifier.weight(0.9f),
            thickness = 0.5.dp
        )
        Spacer(modifier = Modifier.padding(end = 8.dp))
        Text(
            text = "or continue with",
            style = MaterialTheme.typography.labelSmall
        )
        Spacer(modifier = Modifier.padding(start = 8.dp))
        HorizontalDivider(
            modifier = Modifier.weight(0.9f),
            thickness = 0.5.dp
        )
    }
}
