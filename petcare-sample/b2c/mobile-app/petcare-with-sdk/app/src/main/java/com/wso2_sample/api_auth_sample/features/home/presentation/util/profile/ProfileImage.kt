package com.wso2_sample.api_auth_sample.features.home.presentation.util.profile

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter

@Composable
fun ProfileImage(imageUrl: String) {
    Image(
        modifier = Modifier
            .size(104.dp)
            .clip(CircleShape)
            .border(1.dp, MaterialTheme.colorScheme.primary, CircleShape),
        painter = rememberAsyncImagePainter(imageUrl),
        contentDescription = "Profile Picture",
        contentScale = ContentScale.FillBounds
    )
}
