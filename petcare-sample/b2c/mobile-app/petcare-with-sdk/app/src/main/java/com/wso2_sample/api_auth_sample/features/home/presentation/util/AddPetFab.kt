package com.wso2_sample.api_auth_sample.features.home.presentation.util

import androidx.compose.foundation.layout.offset
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun AddPetFab() {
    FloatingActionButton(
        onClick = {},
        elevation = FloatingActionButtonDefaults.elevation(0.dp),
        shape = MaterialTheme.shapes.extraSmall,
        modifier = Modifier.offset(x = (-16).dp)
    ) {
        Icon(
            imageVector = Icons.Outlined.Add,
            contentDescription = "Menu",
            tint = MaterialTheme.colorScheme.surface
        )
    }
}
