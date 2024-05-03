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

package com.wso2_sample.api_auth_sample.util

import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.receiveAsFlow

/**
 * A simple event bus to send events between different parts of the application
 */
object EventBus {
    private val _events = Channel<Any>()
    val events = _events.receiveAsFlow()
    /**
     * Send an event to the event bus
     */
    suspend fun sendEvent(event: Event) {
        _events.send(event)
    }
}

sealed interface Event {
    /**
     * Event to show a toast message
     */
    data class Toast(val message: String): Event
}
