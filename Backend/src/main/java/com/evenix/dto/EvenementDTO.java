package com.evenix.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class EvenementDTO {
    private int id;
    private String nom;
    private String description;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private double prix;
    private String ville;
    
    private String imageUrl;
    
    private UtilisateurDTO utilisateur;
    private LieuDTO lieu;
    private Set<TypeEvenementDTO> types = new HashSet<>();
    private List<InscriptionDTO> inscriptions = new ArrayList<>();
    
    public EvenementDTO() {}


    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public UtilisateurDTO getUtilisateur() { return utilisateur; }
    public void setUtilisateur(UtilisateurDTO utilisateur) { this.utilisateur = utilisateur; }
    public LieuDTO getLieu() { return lieu; }
    public void setLieu(LieuDTO lieu) { this.lieu = lieu; }
    public Set<TypeEvenementDTO> getTypes() { return types; }
    public void setTypes(Set<TypeEvenementDTO> types) { this.types = types; }


	public List<InscriptionDTO> getInscriptions() {
		return inscriptions;
	}


	public void setInscriptions(List<InscriptionDTO> inscriptions) {
		this.inscriptions = inscriptions;
	}
}