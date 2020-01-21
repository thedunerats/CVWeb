package com.devi3ntlab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devi3ntlab.model.Fruit;

@Repository(value = "fruitRepository")
public interface FruitRepository extends JpaRepository<Fruit, Integer> {
	
	// JPA Repository: object mapped to db table, primary key datatype
	// these are the 2 inputs.
	
	// what operations do we need?
	// create fruit
	// remove fruit (done)
	// don't need update. (moving on)
	// need read. we will do count in the basket repository.
	
	/*
	 * the only methods stored in the repository layer are the and by and the select by methods.
	 * all the others are done in the service layer by boilerplate code.
	 * 
	 * We need a better way to remove a fruit from the basket.
	 * Database design is so damn messy. It's the one thing that's really holding me back from making 
	 * more meaningful progress.
	 */
	public Fruit findById(int id);
	public List<Fruit> findAll();
	
	
	@Query(value="select * from fruits where " + 
			"basket_id = :id",
			nativeQuery=true)
	public List<Fruit> findAllByBasketId(@Param("id") int id);
	
	// get fruits by color / species
	//ACTUALLY, might not need this. I'll do this and the service layer and 
	// then I'll do the one for the baskets.
	
	//remove fruit by color
	
	@Query(value="delete from fruits where " + 
			"color = :color",
			nativeQuery=true)
	public void removeFruitByColor(@Param("color") String color);
	
	// remove by species
	
	@Query(value="delete from fruits where " + 
			"species = :species",
			nativeQuery=true)
	public void removeFruitBySpecies(@Param("species") String species);
	
	//we need to add remove fruit by basket it in case we delete a basket.
	
	@Query(value="delete from fruits where " + 
			"basket_id = :basket_id",
			nativeQuery=true)
	public void removeFruitByBasket(@Param("basket_id") int basket_id);
}
