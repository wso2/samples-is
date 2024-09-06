package com.wso2_sample.api_auth_sample.ui.activities.home.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.model.data.Pet

class CardAdapter(private val items: List<Any>) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        const val VIEW_TYPE_PETS = 1
    }

    class PetsViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val petName: TextView = itemView.findViewById(R.id.petNameForm)
        val petBreed: TextView = itemView.findViewById(R.id.petBreed)
        val petDob: TextView = itemView.findViewById(R.id.petDob)
        val petOwner: TextView = itemView.findViewById(R.id.petOwner)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_PETS -> {
                val view = LayoutInflater.from(parent.context)
                    .inflate(R.layout.item_home_pet, parent, false)
                PetsViewHolder(view)
            }

            else -> throw IllegalArgumentException("Invalid view type")
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is PetsViewHolder -> {
                val pet = items[position] as Pet
                holder.petName.text = pet.name
                holder.petBreed.text = pet.breed
                holder.petDob.text = pet.dateOfBirth
                holder.petOwner.text = pet.owner
            }
            // No binding needed for SeparatorViewHolder
        }
    }

    override fun getItemCount(): Int {
        return items.size
    }

    override fun getItemViewType(position: Int): Int {
        return when (items[position]) {
            is Pet -> VIEW_TYPE_PETS
            else -> throw IllegalArgumentException("Invalid item type")
        }
    }
}
