package com.devi3ntlab.model;

public class BasketRequestModel {
	
	// this will go to a json.
	// 2/2/2020: NOTE: this is obsolete. It isn't called in the controller.
	
	public BasketRequestModel() {
		// TODO Auto-generated constructor stub
	}
	
	private int basketId;
	private int fruitsContained;
	
	public int getId() {
		return basketId;
	}

	public void setId(int basketId) {
		this.basketId = basketId;
	}

	public int getFruitsContained() {
		return fruitsContained;
	}

	public void setFruitsContained(int fruitsContained) {
		this.fruitsContained = fruitsContained;
	}

	public BasketRequestModel(int basketId, int fruitsContained) {
		super();
		this.basketId = basketId;
		this.fruitsContained = fruitsContained;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + fruitsContained;
		result = prime * result + basketId;
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
		if (basketId != other.basketId)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "BasketRequestModel [basketId=" + basketId + ", fruitsContained=" + fruitsContained + "]";
	}


}
