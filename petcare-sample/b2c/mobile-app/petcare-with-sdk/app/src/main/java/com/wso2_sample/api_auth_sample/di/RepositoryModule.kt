package com.wso2_sample.api_auth_sample.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.home.impl.repository.PetRepositoryImpl
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.features.login.impl.repository.AsgardeoAuthRepositoryImpl
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

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
