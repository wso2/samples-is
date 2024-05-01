package com.wso2_sample.api_auth_sample.util.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.wso2_sample.api_auth_sample.features.home.presentation.screens.home.HomeScreen
import com.wso2_sample.api_auth_sample.features.home.presentation.screens.home.HomeScreenViewModel
import com.wso2_sample.api_auth_sample.features.home.presentation.screens.profile.ProfileScreen
import com.wso2_sample.api_auth_sample.features.home.presentation.screens.profile.ProfileScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreen
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.landing_screen.LandingScreen
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.landing_screen.LandingScreenViewModel
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlow
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlowNotSuccess
import java.net.URLDecoder

object NavDestination {
    const val LandingScreen: String = LandingScreenViewModel.TAG
    const val AuthScreen: String = AuthScreenViewModel.TAG
    const val HomeScreen: String = HomeScreenViewModel.TAG
    const val ProfileScreen: String = ProfileScreenViewModel.TAG
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = NavDestination.LandingScreen
    ) {
        composable(NavDestination.LandingScreen) {
            LandingScreen()
        }
        composable("${NavDestination.AuthScreen}?authenticationFlow={authenticationFlow}") {
            val authenticationFlowString: String? = it.arguments?.getString("authenticationFlow")
            val authenticationFlow: AuthenticationFlow = AuthenticationFlowNotSuccess.fromJson(
                URLDecoder.decode(authenticationFlowString!!, "utf-8")
            )
            AuthScreen(authenticationFlow = authenticationFlow)
        }
        composable(NavDestination.HomeScreen) {
            HomeScreen()
        }
        composable(NavDestination.ProfileScreen) {
            ProfileScreen()
        }
    }
}
