package com.devi3ntlab.exception;

public class FruitBasketException extends Exception {
	private static final long serialVersionUID = 1L; // need this, I guess.

	public FruitBasketException() {
		// TODO Auto-generated constructor stub
	}
	
	// 1 arg constructor, pass in the error message
	public FruitBasketException(String message) {
		super(message);
	}

}
