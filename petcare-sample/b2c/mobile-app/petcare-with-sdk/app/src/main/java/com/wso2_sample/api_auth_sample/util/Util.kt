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

object Util {
    /**
     * Generates a random date in the format "dd/MM/yyyy".
     */
    fun generateRandomDate(): String {
        val year = (2023..2025).random()
        val month = (1..12).random()
        val day = (1..28).random()
        return "%02d/%02d/%04d".format(day, month, year)
    }

    /**
     * Returns an array of pet image URLs.
     */
    fun getPetImageUrls(): Array<String> = arrayOf(
        "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg",
        "https://cdn.pixabay.com/photo/2023/09/19/12/34/dog-8262506_1280.jpg",
        "https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/03/26/15/50/ai-generated-8657140_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/04/29/04/01/boy-5107099_1280.jpg",
        "https://cdn.pixabay.com/photo/2023/09/24/14/05/dog-8272860_1280.jpg"
    )
}
