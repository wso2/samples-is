package com.wso2_sample.api_auth_sample.util.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.wso2_sample.api_auth_sample.features.add_pet.presentation.screens.add_pet.AddPetScreen
import com.wso2_sample.api_auth_sample.features.add_pet.presentation.screens.add_pet.AddPetScreenViewModel
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
    const val LANDING_SCREEN: String = LandingScreenViewModel.TAG
    const val AUTH_SCREEN: String = AuthScreenViewModel.TAG
    const val HOME_SCREEN: String = HomeScreenViewModel.TAG
    const val PROFILE_SCREEN: String = ProfileScreenViewModel.TAG
    const val ADD_PET_SCREEN: String = AddPetScreenViewModel.TAG
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = NavDestination.LANDING_SCREEN
    ) {
        composable(NavDestination.LANDING_SCREEN) {
            LandingScreen()
        }
        composable("${NavDestination.AUTH_SCREEN}?authenticationFlow={authenticationFlow}") {
            val authenticationFlowString: String? = it.arguments?.getString("authenticationFlow")
            val authenticationFlow: AuthenticationFlow = AuthenticationFlowNotSuccess.fromJson(
                URLDecoder.decode(authenticationFlowString!!, "utf-8")
            )
            AuthScreen(authenticationFlow = authenticationFlow)
        }
        composable(NavDestination.HOME_SCREEN) {
            HomeScreen()
        }
        composable(NavDestination.PROFILE_SCREEN) {
            ProfileScreen()
        }

        composable(NavDestination.ADD_PET_SCREEN) {
            AddPetScreen()
        }
    }
}
