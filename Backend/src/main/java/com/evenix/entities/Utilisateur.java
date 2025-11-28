package com.evenix.entities;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"paiements", "inscriptions"})
public class Utilisateur {

    // Attributes

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UTI_Id")
    private int id;

    @Column(name = "UTI_Nom")
    private String nom;

    @Column(name = "UTI_Prenom")
    private String prenom;

    @Column(name = "UTI_DateDeNaissance")
    private Date dateDeNaissance;

    @Column(name = "UTI_Mdp")
    private String motDePasse;

    @Column(name = "UTI_Email", unique = true)
    private String email;
    
    @Column(name ="UTI_DateCreation")
    private LocalDate dateCreation;
    
    @Column(name = "UTI_DateModif")
    private LocalDate dateModif;
    
    @Column(name = "UTI_EstConfirme", nullable = true)
    private boolean estConfirme;
    
    @Column(name="UTI_Telephone")
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "ENT_id", nullable = true)
    private Entreprise entreprise;

    @ManyToOne
    @JoinColumn(name = "ROL_id", nullable = false)
    private Role role;
    

    @OneToMany(mappedBy = "utilisateur")
    private List<Paiement> paiements = new ArrayList<>();

    @OneToMany(mappedBy = "utilisateur")
    private List<Inscription> inscriptions = new ArrayList<>();

    // Constructors

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, Date dateDeNaissance, String motDePasse, String email, Role role, String telephone) {
        this.nom = nom;
        this.prenom = prenom;
        this.dateDeNaissance = dateDeNaissance;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
        this.email = email;
        this.role = role;
        this.estConfirme = false;
    }

    // Getters/Setters
    public void setId(int id) {
    	this.id = id;
    }
    

    public int getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }
    
    public String getTelephone() {
        return this.telephone;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Date getDateDeNaissance() {
        return dateDeNaissance;
    }

    public void setDateDeNaissance(Date dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }
    
    public LocalDate getDateCreation() {
    	return this.dateCreation;
    }
    
    public void setDateCreation(LocalDate dateCreation) {
    	this.dateCreation = dateCreation;
    }
    
    public LocalDate getDateModif() {
    	return this.dateModif;
    }
    
    public void setDateModif(LocalDate dateModif) {
    	this.dateModif = dateModif;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    public void setTelephone(String telephone) {
    	this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
    
    public boolean getEstConfirme() {
    	return this.estConfirme;
    }
    
    public void setEstConfirme(boolean estConfirme) {
    	this.estConfirme = estConfirme;
    }

    public List<Paiement> getPaiements() {
        return paiements;
    }

    public List<Inscription> getInscriptions() {
        return inscriptions;
    }

    // Functions

    @Override
    public String toString() {
        return "Nom : " + nom + "; Prénom : " + prenom +
                "; Date de naissance : " + dateDeNaissance +
                "; Email : " + email + "]";
    }

}
