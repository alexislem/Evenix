package com.evenix.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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
		
		@ManyToOne
		@JoinColumn(name = "ENT_id", nullable = true)
		private Entreprise entreprise;
		
		
		@ManyToOne
		@JoinColumn(name = "ROL_id", nullable = false)
		private Role role;
		
		public Utilisateur(String sNom, String sPrenom, Date dDatedenaissance, String  sMotdepasse, String sEmail) {
			this.setNom(sNom);
			this.setPrenom(sPrenom);
			this.setDatedenaissance(dDatedenaissance);
			this.setMotdepasse(sMotdepasse);
			this.setEmail(sEmail);
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

		public Entreprise getEntreprise() {
			return entreprise;
		}

		public void setEntreprise(Entreprise entreprise) {
			this.entreprise = entreprise;
		}

		public Role getRole() {
			return role;
		}

		public void setRole(Role role) {
			this.role = role;
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

