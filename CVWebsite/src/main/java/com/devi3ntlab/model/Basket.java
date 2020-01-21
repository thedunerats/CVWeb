package com.devi3ntlab.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import javax.persistence.Table;

@Entity
@Table(name = "baskets")
public class Basket {

	public Basket() {
		// TODO Auto-generated constructor stub
	}
	
	// the fruit will be created in the webapp.
	// we will hard code the first basket and see if we can
	// generate 2 more through the program.
	
	// we will generate messages entirely on the front end. there is no need to persist them.
	// will probably store them in a queue or something.
	// will look into the javascript / TS side for that.
	
	// i.e. write a print utils method.
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="basket_id")
	private int id;
	
	
	@Column(name = "fruits_contained")
	private int fruitsContained;


	public Basket(int basketId, int fruitsContained) {
		super();
		this.id = basketId;
		this.fruitsContained = fruitsContained;
	}
	
	// since ID is serial, we need this to add it to the db. it will generate an id on its own.
	// overloaded constructor, just like other mapped classes with a generated id.
	public Basket(int fruitsContained) {
		this.fruitsContained = fruitsContained;
	}


	public int getBasketId() {
		return id;
	}


	public void setBasketId(int basketId) {
		this.id = basketId;
	}


	public int getFruitsContained() {
		return fruitsContained;
	}


	public void setFruitsContained(int fruitsContained) {
		this.fruitsContained = fruitsContained;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		result = prime * result + fruitsContained;
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
		Basket other = (Basket) obj;
		if (id != other.id)
			return false;
		if (fruitsContained != other.fruitsContained)
			return false;
		return true;
	}


	@Override
	public String toString() {
		return "Basket [basketId=" + id + ", fruitsContained=" + fruitsContained + "]";
	}

	
}
