package com.devi3ntlab.model;

public class FruitRequestModel {

	// this is the model that will get written to a json in our web layer.
	
	public FruitRequestModel() {
		// TODO Auto-generated constructor stub
	}
	
	private int id;
	
	private int basketId;
	
	private String species;
	
	private String color;

	public FruitRequestModel(int id, int basketId, String species, String color) {
		super();
		this.id = id;
		this.basketId = basketId;
		this.species = species;
		this.color = color;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getBasketId() {
		return basketId;
	}

	public void setBasketId(int basketId) {
		this.basketId = basketId;
	}

	public String getSpecies() {
		return species;
	}

	public void setSpecies(String species) {
		this.species = species;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + basketId;
		result = prime * result + ((color == null) ? 0 : color.hashCode());
		result = prime * result + id;
		result = prime * result + ((species == null) ? 0 : species.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FruitRequestModel other = (FruitRequestModel) obj;
		if (basketId != other.basketId)
			return false;
		if (color == null) {
			if (other.color != null)
				return false;
		} else if (!color.equals(other.color))
			return false;
		if (id != other.id)
			return false;
		if (species == null) {
			if (other.species != null)
				return false;
		} else if (!species.equals(other.species))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "FruitRequestModel [id=" + id + ", basketId=" + basketId + ", species=" + species + ", color=" + color
				+ "]";
	}
	
	

}
