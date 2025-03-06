package com.wso2_sample.api_auth_sample.util

import android.util.Base64
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.nio.charset.Charset

class Util {
    companion object {
        private val mapper: ObjectMapper = jacksonObjectMapper()

        fun getJsonString(dataObject: Any): String {
            return mapper.writeValueAsString(dataObject)
        }

        fun getJsonObject(jsonString: String): JsonNode {
            return mapper.readTree(jsonString);
        }

        fun <T> jsonNodeToObject(jsonNode: JsonNode, typeReference: TypeReference<T>): T {
            return mapper.readValue(jsonNode.toString(), typeReference)
        }

        fun getJsonObject(jsonMap: Map<String, Any>): JsonNode {
            return mapper.valueToTree(jsonMap);
        }

        fun base64UrlDecode(input: String): String {
            val base64Encoded = input.replace('-', '+').replace('_', '/')
            val paddedLength = (4 - base64Encoded.length % 4) % 4
            val paddedString = base64Encoded + "=".repeat(paddedLength)

            val decodedBytes = Base64.decode(paddedString, Base64.URL_SAFE)
            return String(decodedBytes, Charset.defaultCharset())
        }

        fun base64UrlEncode(dataObject: Any): String {
            val dataObjectString: String = getJsonString(dataObject)
            return Base64.encodeToString(
                dataObjectString.toByteArray(Charsets.UTF_8),
                Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING
            )
        }

    }
}