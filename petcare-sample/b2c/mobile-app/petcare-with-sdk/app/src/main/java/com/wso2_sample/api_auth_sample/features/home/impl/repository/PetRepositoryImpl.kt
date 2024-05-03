package com.wso2_sample.api_auth_sample.features.home.impl.repository

import android.util.Log
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.Pet
import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.PetModule
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.home.impl.less_secure_client.LessSecureHttpClient
import com.wso2_sample.api_auth_sample.util.Config
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import javax.inject.Inject
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class PetRepositoryImpl @Inject constructor() : PetRepository {
    private val client: OkHttpClient = LessSecureHttpClient.getInstance().getClient()
    private val dataSourcesResourcesUrl: String? = Config.getDataSourceResourceServerUrl()

    override suspend fun getPets(accessToken: String): List<Pet> =
        if (dataSourcesResourcesUrl == null) {
            getPetsFromLocalDataSource()
        } else {
            getPetsFromDataSource(accessToken)
        }

    @Throws(IOException::class)
    override suspend fun addPet(
        accessToken: String,
        name: String,
        breed: String,
        dateOfBirth: String
    ): Unit? = withContext(Dispatchers.IO) {
        suspendCoroutine { continuation ->
            if (dataSourcesResourcesUrl == null) {
                continuation.resumeWithException(Exception("Data source URL is not set"))
                return@suspendCoroutine
            }

            // authorize URL
            val url = "$dataSourcesResourcesUrl/pets"

            // POST form parameters
            val postData = JSONObject()
            postData.put("name", name)
            postData.put("breed", breed)
            postData.put("dateOfBirth", dateOfBirth)
            postData.put("vaccinations", JSONArray())

            val requestBuilder: Request.Builder = Request.Builder().url(url)
            requestBuilder.addHeader("Authorization", "Bearer $accessToken")

            val request: Request = requestBuilder.post(
                postData.toString().toRequestBody("application/json".toMediaTypeOrNull())
            ).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    println(e)
                    continuation.resumeWithException(e)
                }

                @Throws(IOException::class)
                override fun onResponse(call: Call, response: Response) {
                    try {
                        if (response.code == 201) {
                            continuation.resume(Unit)
                        } else {
                            continuation.resumeWithException(Exception("Failed to add pet"))
                        }
                    } catch (e: Exception) {
                        Log.e("PetAPI Add Pet", e.toString())
                        continuation.resumeWithException(e)
                    }
                }
            })
        }
    }

    private fun getPetsFromLocalDataSource(): List<Pet> = listOf(
        Pet.createPetWithRandomData("Bella", "Cat - Persian"),
        Pet.createPetWithRandomData("Charlie", "Rabbit - Holland Lop"),
        Pet.createPetWithRandomData("Luna", "Dog - Golden Retriever"),
        Pet.createPetWithRandomData("Max", "Hamster - Syrian"),
        Pet.createPetWithRandomData("Oliver", "Dog - Poddle"),
        Pet.createPetWithRandomData("Lucy", "Dog - Beagle")
    )

    private suspend fun getPetsFromDataSource(accessToken: String): List<Pet> =
        withContext(Dispatchers.IO) {
            suspendCoroutine { continuation ->
                // authorize URL
                val url = "${dataSourcesResourcesUrl!!}/pets"

                val requestBuilder: Request.Builder = Request.Builder().url(url)
                requestBuilder.addHeader("Authorization", "Bearer $accessToken")

                val request: Request = requestBuilder.get().build()

                client.newCall(request).enqueue(object : Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        println(e)
                        continuation.resumeWithException(e)
                    }

                    @Throws(IOException::class)
                    override fun onResponse(call: Call, response: Response) {
                        try {
                            if (response.code == 200) {
                                val responseBody: String = response.body!!.string()
                                // reading the json
                                val pets: ArrayList<Pet> = jacksonObjectMapper().registerModule(
                                    PetModule()
                                )
                                    .readValue(
                                        responseBody,
                                        jacksonObjectMapper().typeFactory.constructCollectionType(
                                            ArrayList::class.java,
                                            Pet::class.java
                                        )
                                    )
                                continuation.resume(pets)
                            } else {
                                continuation.resumeWithException(Exception("Failed to get pets"))
                            }
                        } catch (e: Exception) {
                            Log.e("PetAPI Get Pets", e.toString())
                            continuation.resumeWithException(e)
                        }
                    }
                })
            }
        }
}
