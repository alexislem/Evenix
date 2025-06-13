package com.evenix.entities;

import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Utilisateur {

	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "UTI_Id")
	private int id;
	
	@Column (name = "UTI_Nom")
	private String nom;
	
	@Column (name = "UTI_Prenom")
	private String prenom;
	
	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column (name = "UTI_DateDeNaissance")
	private Date dateDeNaissance;
	
	@Column (name = "UTI_Mdp")
	private String motDePasse;
	
	@Column (name = "UTI_Email", unique = true)
	private String email;
	
	@ManyToOne
	@JoinColumn(name = "ENT_id", nullable = true)
	private Entreprise entreprise;
	
	@ManyToOne
	@JoinColumn(name = "ROL_id", nullable = false)
	private Role role;
	
	@OneToMany(mappedBy = "utilisateur")
	private List<Paiement> paiements = new ArrayList <>();
		
	@OneToMany(mappedBy = "utilisateur")
	private List<Inscription> inscriptions = new ArrayList<>();

		
	// Constructors
		
	public Utilisateur() {}
	
	public Utilisateur(String sNom, String sPrenom, Date dDatedenaissance, String  sMotdepasse, String sEmail, Role Role) {
		this.nom = sNom;
		this.prenom = sPrenom;
		this.dateDeNaissance = dDatedenaissance;
		this.motDePasse = sMotdepasse;
		this.email = sEmail;
		this.role = Role;
	}
		
	// Getters/Setters
		
	public String getNom() {
		return this.nom;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}

	public String getPrenom() {
		return this.prenom;
	}

	public void setPrenom(String sPrenom) {
		this.prenom = sPrenom;
	}

	public Date getDatedenaissance() {
		return this.dateDeNaissance;
	}

	public void setDatedenaissance(Date dDatedenaissance) {
		this.dateDeNaissance = dDatedenaissance;
	}

	public String getMotdepasse() {
		return this.motDePasse;
	}

	public void setMotdepasse(String sMotdepasse) {
		this.motDePasse = sMotdepasse;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String sEmail) {
		this.email = sEmail;
	}

	public Entreprise getEntreprise() {
		return this.entreprise;
	}

	public void setEntreprise(Entreprise entreprise) {
		this.entreprise = entreprise;
	}

	public Role getRole() {
		return this.role;
	}

	public void setRole(Role role) {
	    if (this.role != role) {
	        this.role = role;
	        if (role != null && !role.getUtilisateurs().contains(this)) {
	            role.getUtilisateurs().add(this);
	        }
	    }
	}
	
	public List<Paiement> getPaiements() {
		return this.paiements;
	}
	
	public List<Inscription> getInscriptions(){
		return this.inscriptions;
	}
	
	// Functions
		
	@Override
	public String toString () {
			return " Nom de la personne : " + this.nom + "; Prenom : " + this.prenom + 
					"; Date de naissance :" + this.dateDeNaissance + 
					"; Adresse Email :" + this.email + "]";
	}
	
	public void addPaiement(Paiement paiement) {
	    if (!this.paiements.contains(paiement)) {
	        this.paiements.add(paiement);
	        paiement.setUtilisateur(this);
	    }
	}
	
	public void removePaiement(Paiement paiement) {
	    if (this.paiements != null) {
	        this.paiements.remove(paiement);
	    }
	}

	public void addInscription(Inscription inscription) {
	    if (inscription != null && !inscriptions.contains(inscription)) {
	        inscriptions.add(inscription);
	        inscription.setUtilisateur(this);
	    }
	}

	public void removeInscription(Inscription inscription) {
	    if (inscriptions.remove(inscription)) {
	        inscription.setUtilisateur(null);
	    }
	}
}

