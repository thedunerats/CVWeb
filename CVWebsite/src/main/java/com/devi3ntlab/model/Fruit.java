package com.devi3ntlab.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


//wont work without jpa dependency
@Entity

@Table(name = "fruits")
public class Fruit {

	public Fruit() {
		// TODO Auto-generated constructor stub
	}
	
	//decide on properties of a fruit 
	// we want to print the properties of a fruit on to a string.
	// we dont need a separate object for that.
	// we will do it in the web layer.
	// either that or add a util package for it.
	// naw, we have the getters and setters. that alone is enough.
	
	// we need a basket class as well.
	// so we can map it with ORM.
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="fruit_id")
	private int id;
	
	// one basket id, many fruits
	// many to one (many fruits, one basket.)
	// always with respect to the current object.
	@ManyToOne(fetch=FetchType.EAGER)
	//This JoinColumn annotation specifies that this property is a 
	//foreign key.
	// need other object? (in the one to many, that is)
	@JoinColumn(name="basket_id")
	private Basket basket;
	
	@Column(name = "species")
	private String species;
	
	@Column(name = "color")
	private String color;

	public Fruit(int id, Basket basket, String species, String color) {
		super();
		this.id = id;
		this.basket = basket;
		this.species = species;
		this.color = color;
	}
	
	// constructor without id, since its serial in the DB
	public Fruit(Basket basket, String species, String color) {
		super();
		this.basket = basket;
		this.species = species;
		this.color = color;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Basket getBasket() {
		return basket;
	}

	public void setBasket(Basket basket) {
		this.basket = basket;
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
		result = prime * result + ((basket == null) ? 0 : basket.hashCode());
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
		Fruit other = (Fruit) obj;
		if (basket == null) {
			if (other.basket != null)
				return false;
		} else if (!basket.equals(other.basket))
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
		return "Fruit [id=" + id + ", basket=" + basket + ", species=" + species + ", color=" + color + "]";
	}

	
}
