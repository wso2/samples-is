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

package com.wso2_sample.api_auth_sample.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.home.impl.repository.PetRepositoryImpl
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AttestationRepository
import com.wso2_sample.api_auth_sample.features.login.impl.repository.AsgardeoAuthRepositoryImpl
import com.wso2_sample.api_auth_sample.features.login.impl.repository.AttestationRepositoryImpl
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAttestationRepository(
        attestationRepositoryImpl: AttestationRepositoryImpl
    ): AttestationRepository

    @Binds
    @Singleton
    abstract fun bindAsgardeoAuthRepository(
        asgardeoAuthRepositoryImpl: AsgardeoAuthRepositoryImpl
    ): AsgardeoAuthRepository

    @Binds
    @Singleton
    abstract fun petRepository(
        petRepositoryImpl: PetRepositoryImpl
    ): PetRepository
}
