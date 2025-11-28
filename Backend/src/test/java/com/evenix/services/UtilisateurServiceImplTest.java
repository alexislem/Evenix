package com.evenix.services;

import com.evenix.dto.UtilisateurDTO;
import com.evenix.entities.Entreprise;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Date;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UtilisateurServiceImplTest {

    private static final Logger logger = LoggerFactory.getLogger(UtilisateurServiceImplTest.class);

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private UtilisateurServiceImpl utilisateurService;

    private Utilisateur utilisateur;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        utilisateur = new Utilisateur();
        utilisateur.setId(1);
        utilisateur.setNom("Dupont");
        utilisateur.setPrenom("Jean");
        utilisateur.setEmail("jean.dupont@example.com");
        utilisateur.setDateDeNaissance(Date.valueOf("1990-01-01"));
        utilisateur.setMotDePasse("password");
        utilisateur.setEntreprise(new Entreprise());
        utilisateur.setRole(new Role());

        logger.info("Initialisation d'un utilisateur de test : {}", utilisateur);
    }

    @Test
    void testGetUtilisateurById() {
        logger.info("DÉBUT - testGetUtilisateurById");
        when(utilisateurRepository.findById(1)).thenReturn(Optional.of(utilisateur));

        Optional<Utilisateur> found = utilisateurService.getUtilisateurById(1);

        assertTrue(found.isPresent());
        assertEquals("Dupont", found.get().getNom());
        verify(utilisateurRepository, times(1)).findById(1);
        logger.info("Utilisateur récupéré avec succès : {}", found.get());
    }

    @Test
    void testCreateUtilisateur() {
        logger.info("DÉBUT - testCreateUtilisateur");
        when(utilisateurRepository.save(utilisateur)).thenReturn(utilisateur);

        Utilisateur created = utilisateurService.createUtilisateur(utilisateur);

        assertNotNull(created);
        assertEquals("Jean", created.getPrenom());
        assertEquals("Dupont", created.getNom());
        assertEquals("jean.dupont@example.com", created.getEmail());
        verify(utilisateurRepository, times(1)).save(utilisateur);

        logger.info("Utilisateur créé avec succès : {}", created);
    }

    @Test
    void testGetAllUtilisateurs() {
        logger.info("DÉBUT - testGetAllUtilisateurs");
        when(utilisateurRepository.findAll()).thenReturn(Arrays.asList(utilisateur));

        List<UtilisateurDTO> utilisateurs = utilisateurService.getAllUtilisateurs();

        assertEquals(1, utilisateurs.size());
        assertEquals("Jean", utilisateurs.get(0).getPrenom());
        verify(utilisateurRepository, times(1)).findAll();

        logger.info("Nombre d'utilisateurs récupérés : {}", utilisateurs.size());
    }

    @Test
    void testDeleteUtilisateur() {
        logger.info("DÉBUT - testDeleteUtilisateur");
        doNothing().when(utilisateurRepository).deleteById(1);

        utilisateurService.deleteUtilisateur(1);

        verify(utilisateurRepository, times(1)).deleteById(1);
        logger.info("Utilisateur avec ID 1 supprimé avec succès");
    }

    @Test
    void testUpdateUtilisateur() {
        logger.info("DÉBUT - testUpdateUtilisateur");

        Utilisateur updated = new Utilisateur();
        updated.setNom("Durand");
        updated.setPrenom("Michel");
        updated.setEmail("michel.durand@example.com");
        updated.setDateDeNaissance(Date.valueOf("1985-05-10"));
        updated.setMotDePasse("newpass");
        updated.setEntreprise(new Entreprise());
        updated.setRole(new Role());

        when(utilisateurRepository.findById(1)).thenReturn(Optional.of(utilisateur));
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(updated);

        Utilisateur result = utilisateurService.updateUtilisateur(1, updated);

        assertNotNull(result);
        assertEquals("Durand", result.getNom());
        assertEquals("Michel", result.getPrenom());
        assertEquals("michel.durand@example.com", result.getEmail());

        verify(utilisateurRepository, times(1)).findById(1);
        verify(utilisateurRepository, times(1)).save(utilisateur);

        logger.info("Utilisateur mis à jour avec succès : {}", result);
    }
}
