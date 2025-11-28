package com.evenix.entities;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
@JsonIgnoreProperties("paiements")
public class Evenement {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "EVE_Id")
	private int id;
	
	@Column (name = "EVE_Nom")
	private String nom;
	
	@Column (name = "EVE_DateDebut")
	private ZonedDateTime dateDebut;
	
	@Column (name = "EVE_DateFin")
	private ZonedDateTime dateFin;
	
	@Column (name = "EVE_Payant")
	private Boolean payant;
	
	@Column (name = "EVE_Description")
	private String description;
	
	@Column (name = "EVE_Prix")
	private float prix;
	
	private String ville;
	
	@ManyToMany
	@JoinTable(
			name = "EST_DE_TYPE",
			joinColumns = @JoinColumn(name = "EVE_Id" ),
			inverseJoinColumns = @JoinColumn(name = "TYP_EVE_Id")
			)
    private Set<TypeEvenement> typesEvenement = new HashSet<>();
	
	@ManyToMany
	@JoinTable(
	name = "EST_PROCHE",
	joinColumns = @JoinColumn(name = "EVE_Id"),
	inverseJoinColumns = @JoinColumn(name = "LIEU_CULTU_Id")
	)
	private Set<LieuCulturel> lieuxCulturelsProches = new HashSet<>();
	
	@ManyToOne
	@JoinColumn(name = "UTI_Id", nullable = false)
	private Utilisateur utilisateur;
	
	@ManyToOne
	@JoinColumn(name = "LIEU_Id", nullable = false)
	private Lieu lieu;
	
	@OneToMany(mappedBy = "evenement")
	@JsonManagedReference
	private List<Paiement> paiements = new ArrayList<>();


	
	@OneToMany(mappedBy = "evenement")
	@JsonIgnore
	private List<Inscription> inscriptions = new ArrayList<>();

	// Constructors
	
	public Evenement() {}
	
	public Evenement(String nom, ZonedDateTime dateDebut, ZonedDateTime dateFin, Boolean payant,
		String description, float prix, Lieu lieu, Utilisateur utilisateur) {
			this.nom = nom;
			this.dateDebut = dateDebut;
			this.dateFin = dateFin;
			this.payant = payant;
			this.description = description;
			this.prix = prix;
			this.lieu = lieu;
			this.utilisateur = utilisateur;
		}
	
	public Evenement(String nom, ZonedDateTime dateDebut, ZonedDateTime dateFin, Boolean payant,
        String description, float prix, Lieu lieu, Utilisateur utilisateur,
        Set<TypeEvenement> typesEvenement, Set<LieuCulturel> lieuxCulturelsProches) {
			this.nom = nom;
			this.dateDebut = dateDebut;
			this.dateFin = dateFin;
			this.payant = payant;
			this.description = description;
			this.prix = prix;
			this.lieu = lieu;
			this.utilisateur = utilisateur;
			this.typesEvenement = typesEvenement != null ? typesEvenement : new HashSet<>();
			this.lieuxCulturelsProches = lieuxCulturelsProches != null ? lieuxCulturelsProches : new HashSet<>();
	}


	// Getters/Setters
	
	public int getId() {
	    return this.id;
	}

	
	public String getNom() {
		return this.nom;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}

	public ZonedDateTime getDateDebut() {
		return this.dateDebut;
	}

	public void setDateDebut(ZonedDateTime zdtDateDebut) {
		this.dateDebut = zdtDateDebut;
	}

	public ZonedDateTime getDateFin() {
		return this.dateFin;
	}

	public void setDateFin(ZonedDateTime zdtDateFin) {
		this.dateFin = zdtDateFin;
	}

	public Boolean getPayant() {
		return this.payant;
	}

	public void setPayant(Boolean bPayant) {
		this.payant = bPayant;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String sDescription) {
		this.description = sDescription;
	}

	public float getPrix() {
		return this.prix;
	}

	public void setPrix(float fPrix) {
		this.prix = fPrix;
	}
	
	public Utilisateur getUtilisateur() {
		return this.utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
		this.utilisateur = utilisateur;
	}

	public Lieu getLieu() {
		return this.lieu;
	}

	public void setLieu(Lieu lieu) {
		this.lieu = lieu;
	}
	
	public Set<TypeEvenement> getTypesEvenement() {
	    return this.typesEvenement;
	}

	public List<Paiement> getPaiements() {
	    return this.paiements;
	}

	public void setTypesEvenement(Set<TypeEvenement> typesEvenement) {
	    this.typesEvenement = typesEvenement;
	}

	public void setPaiements(List<Paiement> paiements) {
	    this.paiements = paiements;
	}

	public Set<LieuCulturel> getLieuxCulturelsProches() {
	    return this.lieuxCulturelsProches;
	}
	
	public void setLieuxCulturelsProches(Set<LieuCulturel> lieuxCulturels) {
		this.lieuxCulturelsProches = lieuxCulturels;
	}
	
	public List<Inscription> getInscriptions(){
		return this.inscriptions;
	}
	
	// Functions 
	
	public String toString () {
			return " Nom de l'évènement : " + this.nom + "; Date de début : " + this.dateDebut+ 
					"; Date de fin :" + this.dateFin +	"; Payant  : " + this.payant + 
					"; Description :" + this.description + "; Prix :" + this.prix + "]";
	}
	

	
	public void removePaiement(Paiement paiement) {
	    if (this.paiements != null && this.paiements.remove(paiement)) {
	        paiement.setEvenement(null);
	    }
	}

	public void addInscription(Inscription inscription) {
	    if (inscription != null && !inscriptions.contains(inscription)) {
	        inscriptions.add(inscription);
	        inscription.setEvenement(this);
	    }
	}

	public void removeInscription(Inscription inscription) {
	    if (inscriptions.remove(inscription)) {
	        inscription.setEvenement(null);
	    }
	}

	public String getVille() {
		return ville;
	}

	public void setVille(String ville) {
		this.ville = ville;
	}
	
	

	
}
