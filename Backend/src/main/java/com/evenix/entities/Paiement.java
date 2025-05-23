package com.evenix.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Paiement {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	private float Montant;
	private ZonedDateTime Date;
	private String Code;
	private int UTI_Id;
	private int EVE_Id;
	
	//constructor
	public Paiement () {};
	
	public Paiement (float fmontant, ZonedDateTime zdate, String scode) {
		this.setMontant(fmontant);
		this.setDate(zdate);
		this.setCode(scode);
	}
	
	//GETTERS/SETTERS

	public float getMontant() {
		return Montant;
	}

	public void setMontant(float montant) {
		Montant = montant;
	}

	public ZonedDateTime getDate() {
		return Date;
	}

	public void setDate(ZonedDateTime date) {
		Date = date;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getUTI_Id() {
		return UTI_Id;
	}

	public void setUTI_Id(int uTI_Id) {
		UTI_Id = uTI_Id;
	}

	public int getEVE_Id() {
		return EVE_Id;
	}

	public void setEVE_Id(int eVE_Id) {
		EVE_Id = eVE_Id;
	}
	
	//FUNCTION
	public String toString () {
		try {
		return " Montant : " + this.Montant + " Date de paiement : " + this.Date + " Code : " + this.Code + "]";
	}
		catch(Exception e) {
			return "";
		}
	}
	
	

}
