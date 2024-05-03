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

package com.wso2_sample.api_auth_sample.features.home.domain.models.pet

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode
import com.wso2_sample.api_auth_sample.util.Util
import java.io.IOException

class PetDeserializer : JsonDeserializer<Pet>() {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, ctxt: DeserializationContext): Pet {
        val node = jsonParser.codec.readTree<JsonNode>(jsonParser)
        val name = node.get("name")?.asText()
        val breed = node.get("breed")?.asText()

        val randomImageUrl = Util.getPetImageUrls().random()
        val randomDate = Util.generateRandomDate()

        return Pet(
            name = name,
            breed = breed,
            nextAppointment = "Next appointment on $randomDate",
            imageUrl = randomImageUrl
        )
    }
}
