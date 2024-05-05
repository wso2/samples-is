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
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.util.ui.UiUtil

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(
    navigateToHome: () -> Unit,
    navigateToProfile: () -> Unit
) {
    TopAppBar(
        title = {
            Image(
                painter = painterResource(id = R.drawable.home_logo),
                modifier = Modifier
                    .size(UiUtil.getScreenHeight().dp / 6)
                    .offset(x = (-16).dp)
                    .clickable { navigateToHome() },
                contentDescription = "Home Logo",
            )
        },
        actions = {
            Icon(
                imageVector = Icons.Outlined.AccountCircle,
                contentDescription = "Menu",
                modifier = Modifier
                    .size(UiUtil.getScreenHeight().dp / 25)
                    .offset(x = 4.dp)
                    .clickable { navigateToProfile() },
                tint = MaterialTheme.colorScheme.tertiary
            )
        },
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 32.dp),
    )
}
