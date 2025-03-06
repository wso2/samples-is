package com.wso2_sample.api_auth_sample.ui.activities.add_pet

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.databinding.ActivityAddPetBinding
import com.wso2_sample.api_auth_sample.model.api.data_source.pet.AddPetCallback
import com.wso2_sample.api_auth_sample.model.data.Pet
import com.wso2_sample.api_auth_sample.ui.activities.home.Home
import com.wso2_sample.api_auth_sample.util.UiUtil
import com.google.android.material.button.MaterialButton
import com.wso2_sample.api_auth_sample.api.data_source.pet.PetAPI

class AddPet : AppCompatActivity() {

    private lateinit var binding: ActivityAddPetBinding
    private lateinit var backButton: ImageButton
    private lateinit var addPetButton: MaterialButton
    private lateinit var progressBar: ProgressBar
    private lateinit var addPetFormLayout: LinearLayout
    private lateinit var petNameEditText: EditText
    private lateinit var breedEditText: EditText
    private lateinit var dobEditText: EditText
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initializeComponents()
        supportActionBar?.hide()
        UiUtil.hideStatusBar(window, resources, theme, R.color.asgardeo_secondary)

        setBackButtonOnClick()
        setAddPetButtonOnClick()
    }

    private fun initializeComponents() {
        binding = ActivityAddPetBinding.inflate(layoutInflater)
        setContentView(binding.root)

        backButton = binding.backButton
        addPetButton = findViewById(R.id.addPetButtonForm)
        progressBar = findViewById(R.id.activityAddPetProgressBar)
        petNameEditText = findViewById(R.id.petNameForm)
        breedEditText = findViewById(R.id.petBreedForm)
        dobEditText = findViewById(R.id.dobPetForm)
        addPetFormLayout = findViewById(R.id.addPetForm)
    }

    private fun setAddPetButtonOnClick() {
        addPetButton.setOnClickListener {
            addPet()
        }
    }


    private fun addPet() {
        PetAPI.addPet(
            applicationContext,
            Pet(
                null,
                null,
                petNameEditText.text.toString(),
                breedEditText.text.toString(),
                dobEditText.text.toString(),
                emptyList()
            ),
            AddPetCallback(
                onSuccess = {
                    onAddPetSuccess()
                },
                onFailure = {
                    onAddPetFailure()
                },
                onWaiting = {
                    onAddPetWaiting()
                },
                onFinally = {
                    onAddPetFinally()
                }
            )
        )
    }

    private fun onAddPetSuccess() {

        UiUtil.showSnackBar(binding.root, "Pet added successfully")
        moveToHome()
    }

    private fun onAddPetFailure() {
        UiUtil.showSnackBar(binding.root, "Failed to add pet")
    }

    private fun onAddPetWaiting() {
        runOnUiThread {
            addPetFormLayout.visibility = View.GONE
            progressBar.visibility = View.VISIBLE
        }
    }

    private fun onAddPetFinally() {
        runOnUiThread {
            addPetFormLayout.visibility = View.VISIBLE
            progressBar.visibility = View.GONE
        }
    }

    private fun setBackButtonOnClick() {
        backButton.setOnClickListener {
            moveToHome()
        }
    }

    private fun moveToHome() {
        val intent = Intent(this, Home::class.java)
        startActivity(intent)
        finish()
    }
}
