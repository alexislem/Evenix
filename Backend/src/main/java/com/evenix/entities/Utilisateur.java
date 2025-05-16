package com.evenix.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Utilisateur {

	//Attributes
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private int id;
		private String Nom;
		private String Prenom;
		private Date DateDeNaissance;
		private String MotDePasse;
		private String Email;
		private int ENT_id;
		private int ROL_id;
		
		public Utilisateur(String sNom, String sPrenom, Date dDatedenaissance, String  sMotdepasse, String sEmail, int iENT_id, int iROL_id) {
			this.setNom(sNom);
			this.setPrenom(sPrenom);
			this.setDatedenaissance(dDatedenaissance);
			this.setMotdepasse(sMotdepasse);
			this.setEmail(sEmail);
			this.setENT_id(iENT_id);
			this.setROL_id(iROL_id);
		}

		public String getNom() {
			return Nom;
		}

		public void setNom(String sNom) {
			this.Nom = sNom;
		}

		public String getPrenom() {
			return Prenom;
		}

		public void setPrenom(String sPrenom) {
			this.Prenom = sPrenom;
		}

		public Date getDatedenaissance() {
			return DateDeNaissance;
		}

		public void setDatedenaissance(Date dDatedenaissance) {
			this.DateDeNaissance = dDatedenaissance;
		}

		public String getMotdepasse() {
			return MotDePasse;
		}

		public void setMotdepasse(String sMotdepasse) {
			this.MotDePasse = sMotdepasse;
		}

		public String getEmail() {
			return Email;
		}

		public void setEmail(String sEmail) {
			this.Email = sEmail;
		}

		public int getENT_id() {
			return ENT_id;
		}

		public void setENT_id(int iENT_id) {
			ENT_id = iENT_id;
		}

		public int getROL_id() {
			return ROL_id;
		}

		public void setROL_id(int iROL_id) {
			ROL_id = iROL_id;
		}
		
		public String toString () {
			try {
				return " Nom de la personne : " + this.Nom + "; Prenom : " + this.Prenom + 
						"; Date de naissance :" + this.DateDeNaissance +	"; Mot de passe  : " + this.MotDePasse + 
						"; Adresse Email :" + this.Email + "]";
			}
			catch(Exception e) {
				return "";
			}

		}
}

