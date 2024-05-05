/*
 *  Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 *  WSO2 LLC. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

package com.wso2_sample.api_auth_sample.features.home.presentation.util

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SuggestionChip
import androidx.compose.material3.SuggestionChipDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.util.ui.UiUtil

@Composable
fun VetCard(){
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primary
        ),
    ) {
        Box(
            modifier = Modifier.fillMaxWidth()
        ) {
            Image(
                painter = painterResource(id = R.drawable.person_dog_home),
                contentDescription = "Person with dog",
                modifier = Modifier
                    .height(UiUtil.getScreenHeight().dp / 5)
                    .offset(x = 8.dp, y = 4.dp)
                    .align(Alignment.CenterEnd)
            )
            Column(
                modifier = Modifier
                    .padding(start = 16.dp, top = 24.dp, bottom = 16.dp)
                    .fillMaxWidth()
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        SuggestionChip(
                            colors = SuggestionChipDefaults.suggestionChipColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            ),
                            border = null,
                            modifier = Modifier.height(16.dp),
                            onClick = {},
                            label = {
                                Text(
                                    text = "LIVE",
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.error,
                                )
                            }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Consult with",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.surface
                        )
                    }
                    Column(
                        verticalArrangement = Arrangement.spacedBy(0.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "an ",
                                style = MaterialTheme.typography.titleLarge,
                                color = MaterialTheme.colorScheme.surface
                            )
                            Text(
                                text = "Experienced",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.surface,
                                modifier = Modifier.width(200.dp)
                            )
                        }
                        Text(
                            text = "Veterinarian",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.surface,
                            modifier = Modifier.offset(y = -6.dp)
                        )
                    }

                }
                Spacer(modifier = Modifier.height(8.dp))
                AssistChip(
                    onClick = {},
                    label = {
                        Text(
                            text = "Consult Now",
                            color = MaterialTheme.colorScheme.primary
                        )
                    },
                    leadingIcon = {
                        Icon(
                            painter = painterResource(id = R.drawable.video_call),
                            contentDescription = "Menu",
                            modifier = Modifier
                                .size(24.dp)
                                .offset(x = 4.dp),
                        )
                    },
                    shape = MaterialTheme.shapes.extraSmall,
                    border = null,
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    modifier = Modifier.align(Alignment.Start)
                )
            }
        }
    }
}
