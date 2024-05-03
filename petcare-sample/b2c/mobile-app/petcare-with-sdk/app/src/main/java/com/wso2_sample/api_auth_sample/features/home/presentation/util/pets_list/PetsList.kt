package com.wso2_sample.api_auth_sample.features.home.presentation.util.pets_list

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.Pet

@Composable
fun PetsList(pets: List<Pet>) {
    Column(
        modifier = Modifier.padding(horizontal = 32.dp),
    ) {
        Text(
            text = "Your cutie pets",
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.tertiary
        )
        Column(
            modifier = Modifier
                .padding(top = 16.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            pets.forEach { pet ->
                PetCard(pet = pet)
            }
        }
    }
}
