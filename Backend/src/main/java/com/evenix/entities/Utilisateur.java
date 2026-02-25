package com.evenix.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "utilisateur")
@JsonIgnoreProperties({"paiements", "inscriptions"}) // Évite les boucles infinies JSON
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "date_naissance")
    private LocalDate dateDeNaissance;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name ="date_creation")
    private LocalDateTime dateCreation;
    
    @Column(name = "est_confirme")
    private boolean estConfirme;
    
    @Column(name="telephone")
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "utilisateur")
    private List<Inscription> inscriptions = new ArrayList<>();
    
    @Column(name = "question_securite")
    private String questionSecurite; // Ex: "Quel est le nom de votre premier animal ?"

    @Column(name = "reponse_securite")
    private String reponseSecurite; // Haché via BCrypt

    @Column(unique = true)
    private String confirmationToken;
    private LocalDateTime tokenCreationDate;
    
    // Constructeurs

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, LocalDate dateDeNaissance, String motDePasse, String email, Role role, String telephone) {
        this.nom = nom;
        this.prenom = prenom;
        this.dateDeNaissance = dateDeNaissance;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
        this.email = email;
        this.role = role;
        this.estConfirme = false;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters et Setters
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public LocalDate getDateDeNaissance() { return dateDeNaissance; }
    public void setDateDeNaissance(LocalDate dateDeNaissance) { this.dateDeNaissance = dateDeNaissance; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Entreprise getEntreprise() { return entreprise; }
    public void setEntreprise(Entreprise entreprise) { this.entreprise = entreprise; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public boolean getEstConfirme() { return estConfirme; }
    public void setEstConfirme(boolean estConfirme) { this.estConfirme = estConfirme; }
    public List<Inscription> getInscriptions() { return inscriptions; }
    public void setInscriptions(List<Inscription> inscriptions) { this.inscriptions = inscriptions; }

	public void setQuestionSecurite(String questionSecurite) {
		this.questionSecurite = questionSecurite;
	}
	public String getQuestionSecurite() { return questionSecurite; }

	public void setReponseSecurite(String reponseSecurite) {
		this.reponseSecurite = reponseSecurite;
	}
	public String getReponseSecurite() { return reponseSecurite; }

	public LocalDateTime getTokenCreationDate() {
		return tokenCreationDate;
	}

	public void setTokenCreationDate(LocalDateTime tokenCreationDate) {
		this.tokenCreationDate = tokenCreationDate;
	}

	
	public String getConfirmationToken() {
		return this.confirmationToken;
	}
	
	public void setConfirmationToken(String token) {
		this.confirmationToken = token;
	}

}