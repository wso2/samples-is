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

package com.wso2_sample.api_auth_sample.features.home.presentation.util.add_pet

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.util.ui.UiUtil

@Composable
fun AddPetCard() {
    val fullText =
        "Add details of your cutie pet from here. So that we have the full details of " +
                "your pet to help them get better quickly"
    val partToBold = "Add details of your cutie pet from here."

    val annotatedString: AnnotatedString = AnnotatedString.Builder().apply {
        fullText.split(partToBold).forEachIndexed { index, part ->
            append(part)
            if (index != fullText.split(partToBold).lastIndex) {
                pushStyle(
                    SpanStyle(fontWeight = FontWeight.Bold)
                )
                append(partToBold)
                pop()
            }
        }
    }.toAnnotatedString()

    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = Alignment.CenterStart
    ) {
        Image(
            painter = painterResource(id = R.drawable.add_pet_banner),
            contentDescription = "Person with dog",
            modifier = Modifier
                .height(UiUtil.getScreenHeight().dp / 5)
                .offset(x = 8.dp, y = 4.dp)
                .align(Alignment.Center)
        )
        Row {
            Text(
                text = annotatedString,
                color = MaterialTheme.colorScheme.tertiaryContainer,
                style = MaterialTheme.typography.labelSmall,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .padding(start = 32.dp)
                    .width(200.dp)
            )
        }
    }
}
