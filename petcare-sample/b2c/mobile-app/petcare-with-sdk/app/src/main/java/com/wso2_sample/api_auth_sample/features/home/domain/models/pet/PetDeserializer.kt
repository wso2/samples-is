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
