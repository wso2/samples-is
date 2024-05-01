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
