package com.wso2_sample.api_auth_sample.features.home.presentation.util.pets_list

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DateRange
import androidx.compose.material.icons.outlined.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.wso2_sample.api_auth_sample.features.home.domain.models.Pet

@Composable
fun PetCard(pet: Pet) {
    Row(
        modifier = Modifier
            .fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Image(
            //painter = painterResource(id = pet.imageId),
            painter = rememberAsyncImagePainter(pet.imageUrl),
            contentDescription = pet.name,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxHeight()
                .weight(1f)
                .height(56.dp)
                .width(56.dp)
                .clip(MaterialTheme.shapes.extraLarge)
        )
        Column(
            modifier = Modifier.weight(4f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                Text(
                    text = pet.name,
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    text = pet.type,
                    style = MaterialTheme.typography.bodyMedium,
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Outlined.DateRange,
                    contentDescription = "Menu",
                    tint = MaterialTheme.colorScheme.tertiaryContainer,
                    modifier = Modifier
                        .size(16.dp)
                )

                Text(
                    text = pet.nextAppointment,
                    style = MaterialTheme.typography.labelSmall
                )
            }
        }
        Icon(
            imageVector = Icons.Outlined.KeyboardArrowRight,
            contentDescription = "Menu",
            tint = MaterialTheme.colorScheme.tertiaryContainer,
            modifier = Modifier
                .size(20.dp)
                .padding(end = 8.dp)
        )
    }
}
