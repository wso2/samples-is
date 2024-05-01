package com.wso2_sample.api_auth_sample.features.home.presentation.util.profile

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp

@Composable
fun NameSection(firstName: String?, lastName: String?) {
    // If first name is null, set it to "Sarah" and if last name is null, set it to "Jones"
    var first: String? = firstName
    var last: String? = lastName
    if (first == null) {
        first = "Sarah"
    }
    if (last == null) {
        last = "Jones"
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "$firstName $lastName",
            style = MaterialTheme.typography.titleLarge
        )
        Row(
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = Icons.Filled.Star,
                contentDescription = "Email Icon",
                modifier = Modifier
                    .size(16.dp)
                    .graphicsLayer(alpha = 0.99f)
                    .drawWithCache {
                        onDrawWithContent {
                            drawContent()
                            drawRect(
                                Brush.linearGradient(
                                    colors = listOf(
                                        Color(0xFFAE8625),
                                        Color(0xFFF7EF8A),
                                    ),
                                    start = Offset.Zero,
                                    end = Offset.Infinite
                                ),
                                blendMode = BlendMode.SrcAtop
                            )
                        }
                    }
            )
            Text(
                text = "Gold member",
                style = MaterialTheme.typography.bodyMedium.copy(
                    brush = Brush.linearGradient(
                        colors = listOf(
                            Color(0xFFAE8625),
                            Color(0xFFF7EF8A),
                        ),
                        start = Offset.Zero,
                        end = Offset.Infinite
                    )
                )
            )
        }
    }
}
