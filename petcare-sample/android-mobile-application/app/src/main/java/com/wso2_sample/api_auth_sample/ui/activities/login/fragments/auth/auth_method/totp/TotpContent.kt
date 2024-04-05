package com.wso2_sample.api_auth_sample.ui.activities.login.fragments.auth.auth_method.totp

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.auth_method.totp.TotpContentListener

/**
 * Content of the TOTP authenticator
 */
class TotpContent : BottomSheetDialogFragment() {

    private lateinit var layout: View
    private lateinit var totpContinueButton: Button
    private lateinit var totpCancelButton: Button
    private lateinit var totpValue: EditText
    private lateinit var listener: TotpContentListener

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = inflater.inflate(
        R.layout.fragment_login_auth_auth_method_totp_totpcontent,
        container,
        false
    )

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeComponents(view)

        onTotpCancelButtonClicked()
        onTotpContinueButtonClicked()
    }

    companion object {
        const val TAG = "ModalBottomSheet"
    }

    private fun initializeComponents(view: View) {
        layout = view.findViewById(R.id.totpContentView)
        totpContinueButton = view.findViewById(R.id.totpContinueButton)
        totpValue = view.findViewById(R.id.totpValue)
        totpCancelButton = view.findViewById(R.id.totpCancelButton)
    }

    private fun onTotpCancelButtonClicked() {
        totpCancelButton.setOnClickListener {
            this.dismiss()
        }
    }

    private fun onTotpContinueButtonClicked() {
        totpContinueButton.setOnClickListener {
            listener.onTotpButtonClicked()
        }
    }

    fun setListener(listener: TotpContentListener) {
        this.listener = listener
    }

    fun getLayout(): View {
        return layout
    }

    fun getTotpValue(): EditText {
        return totpValue
    }

    fun getTotpContinueButton(): Button {
        return totpContinueButton
    }
}
