plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsKotlinAndroid)
    id("kotlin-android")
    id("kotlin-kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.wso2_sample.api_auth_sample"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.wso2_sample.api_auth_sample"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        manifestPlaceholders.putAll(
            mapOf(
                "appAuthRedirectScheme" to "wso2.apiauth.sample.android://login-callback",
                "callbackUriHost" to "login-callback",
                "callbackUriScheme" to "wso2.apiauth.sample.android"
            )
        )
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.10"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.appcompat)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3.android)
    implementation(libs.androidx.ui.tooling.preview.android)
//    implementation(fileTree(mapOf(
//        "dir" to "/Users/achintha/.m2/repository/io/asgardeo/android.ui.core/0.0.1-SNAPSHOT",
//        "include" to listOf("*.aar", "*.jar", "*.pom"),
//    )))
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom.v20240400))

    // Arrow
    implementation(libs.arrow.core)
    implementation(libs.arrow.fx.coroutines)
    // Coil
    implementation(libs.coil.compose)
    // Dagger hilt
    implementation(libs.hilt.android)
    debugImplementation(libs.androidx.ui.tooling)
    kapt(libs.hilt.android.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    implementation(libs.androidx.lifecycle.runtime.compose)

    // Asgardeo android SDK
    implementation("io.asgardeo:android.ui.core:0.0.1@aar")

    // to remove
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation ("com.fasterxml.jackson.module:jackson-module-kotlin:2.14.2")
    implementation ("net.openid:appauth:0.11.1")
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    implementation("androidx.credentials:credentials:1.3.0-alpha02")
    // optional - needed for credentials support from play services, for devices running
    // Android 13 and below.
    implementation("androidx.credentials:credentials-play-services-auth:1.3.0-alpha02")
    implementation ("com.google.android.libraries.identity.googleid:googleid:1.1.0")

    implementation("com.google.android.gms:play-services-auth:21.0.0")

    implementation ("androidx.browser:browser:1.8.0")
    implementation("androidx.activity:activity-ktx:1.8.2")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}
