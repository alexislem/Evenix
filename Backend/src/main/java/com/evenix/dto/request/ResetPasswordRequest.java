package com.evenix.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String reponseSecurite;
    private String nouveauMotDePasse;
    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getReponseSecurite() {
		return reponseSecurite;
	}
	public void setReponseSecurite(String reponseSecurite) {
		this.reponseSecurite = reponseSecurite;
	}
	public String getNouveauMotDePasse() {
		return nouveauMotDePasse;
	}
	public void setNouveauMotDePasse(String nouveauMotDePasse) {
		this.nouveauMotDePasse = nouveauMotDePasse;
	}
}