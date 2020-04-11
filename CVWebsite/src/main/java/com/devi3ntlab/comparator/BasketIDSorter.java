package com.devi3ntlab.comparator;

import java.util.Comparator;

import com.devi3ntlab.model.Basket;

public class BasketIDSorter implements Comparator<Basket>{ 

	@Override
	public int compare(Basket o1, Basket o2) {
		// TODO Auto-generated method stub
		Integer IdOne = o1.getBasketId();
		Integer IdTwo = o2.getBasketId();
		return IdTwo.compareTo(IdOne);
	}
}
