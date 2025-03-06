package com.wso2_sample.api_auth_sample.ui.activities.home

import com.wso2_sample.api_auth_sample.ui.activities.home.adapters.CardAdapter
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.databinding.ActivityHomeBinding
import com.wso2_sample.api_auth_sample.model.api.data_source.pet.GetAllPetsCallback
import com.wso2_sample.api_auth_sample.model.data.Pet
import com.wso2_sample.api_auth_sample.model.util.uiUtil.SharedPreferencesKeys
import com.wso2_sample.api_auth_sample.ui.activities.add_pet.AddPet
import com.wso2_sample.api_auth_sample.ui.activities.main.MainActivity
import com.wso2_sample.api_auth_sample.util.UiUtil
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.material.button.MaterialButton
import com.wso2_sample.api_auth_sample.api.data_source.pet.PetAPI

class Home : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var signoutButton: ImageButton
    private lateinit var petsRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyPlacholderLayout: LinearLayout
    private lateinit var errorPlaceholderLayout: LinearLayout
    private lateinit var retryButton: MaterialButton
    private lateinit var retryEmptyButton: MaterialButton
    private lateinit var addPetButton: MaterialButton

    private lateinit var pets: ArrayList<Pet>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initializeComponents()

        // hide action bar and status bar
        UiUtil.hideStatusBar(window, resources, theme, R.color.asgardeo_secondary)

        setPets()

        setSignOutButtonOnClick()
        setRetryButtonOnClick()
        addPetButtonOnClick()
    }

    override fun onRestart() {
        super.onRestart()
        setPets()
    }

    private fun initializeComponents() {
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)
        signoutButton = findViewById(R.id.backButton)
        petsRecyclerView = findViewById(R.id.petsRecyclerView)
        progressBar = findViewById(R.id.activityAddPetProgressBar)
        emptyPlacholderLayout = findViewById(R.id.emptyPlacholderLayout)
        errorPlaceholderLayout = findViewById(R.id.errorPlaceholderLayout)
        retryButton = findViewById(R.id.retryButton)
        retryEmptyButton = findViewById(R.id.retryEmptyButton)
        addPetButton = findViewById(R.id.addPetButtonHome)
    }

    private fun setRetryButtonOnClick() {
        retryButton.setOnClickListener {
            setPets()
        }

        retryEmptyButton.setOnClickListener {
            setPets()
        }
    }

    private fun setPets() {
        PetAPI.getPets(
            applicationContext,
            GetAllPetsCallback(
                onSuccess = { pets ->
                    onGetPetsSuccess(pets)
                },
                onFailure = {
                    onGetPetsError()
                },
                onWaiting = {
                    onGetPetsWaiting()
                },
                onFinally = {
                    onGetPetsFinally()
                }
            )
        )
    }

    private fun onGetPetsSuccess(pets: ArrayList<Pet>) {
        this.pets = pets
        setPetsCardAdapter(pets)

        // Show the pets recycler view and hide the loader
        runOnUiThread {
            if (this.pets.isEmpty()) {
                emptyPlacholderLayout.visibility = View.VISIBLE
            } else {
                petsRecyclerView.visibility = View.VISIBLE
            }
        }
    }

    private fun onGetPetsError() {
        // Show the error message and hide the loader
        runOnUiThread {
            UiUtil.showSnackBar(binding.root, getString(R.string.error_get_pets))
            errorPlaceholderLayout.visibility = View.VISIBLE
        }
    }

    private fun onGetPetsFinally() {
        // Hide the loader
        runOnUiThread {
            progressBar.visibility = View.GONE
        }
    }

    private fun onGetPetsWaiting() {
        // Show the loader
        runOnUiThread {
            progressBar.visibility = View.VISIBLE
            petsRecyclerView.visibility = View.GONE
            emptyPlacholderLayout.visibility = View.GONE
            errorPlaceholderLayout.visibility = View.GONE
        }
    }

    private fun setPetsCardAdapter(pets: List<Pet>) {
        runOnUiThread {
            val cardAdapter = CardAdapter(pets)
            petsRecyclerView.layoutManager = LinearLayoutManager(this)
            petsRecyclerView.adapter = cardAdapter
        }
    }

    private fun setSignOutButtonOnClick() {
        signoutButton.setOnClickListener {
            // Sign out from google if the user is signed in from google
            GoogleSignIn.getClient(
                this,
                GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).build()
            )
                .signOut()

            // Clear the access token from the shared preferences
            UiUtil.writeToSharedPreferences(
                applicationContext.getSharedPreferences(
                    R.string.app_name.toString(),
                    Context.MODE_PRIVATE
                ), SharedPreferencesKeys.ACCESS_TOKEN.key, ""
            )

            // Redirect to the login page
            val intent = Intent(this@Home, MainActivity::class.java)
            startActivity(intent)
        }
    }

    private fun addPetButtonOnClick() {
        addPetButton.setOnClickListener {
            val intent = Intent(this@Home, AddPet::class.java)
            startActivity(intent)
            finish()
        }
    }
}