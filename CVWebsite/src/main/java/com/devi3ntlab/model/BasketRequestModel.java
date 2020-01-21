package com.devi3ntlab.model;

public class BasketRequestModel {
	
	// this will go to a json.

	public BasketRequestModel() {
		// TODO Auto-generated constructor stub
	}
	
	private int id;
	private int fruitsContained;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getFruitsContained() {
		return fruitsContained;
	}

	public void setFruitsContained(int fruitsContained) {
		this.fruitsContained = fruitsContained;
	}

	public BasketRequestModel(int id, int fruitsContained) {
		super();
		this.id = id;
		this.fruitsContained = fruitsContained;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + fruitsContained;
		result = prime * result + id;
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
		BasketRequestModel other = (BasketRequestModel) obj;
		if (fruitsContained != other.fruitsContained)
			return false;
		if (id != other.id)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "BasketRequestModel [id=" + id + ", fruitsContained=" + fruitsContained + "]";
	}

}
