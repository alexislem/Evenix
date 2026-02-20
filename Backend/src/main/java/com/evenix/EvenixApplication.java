package com.evenix;

import com.evenix.entities.Evenement;

import com.evenix.entities.Lieu;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.entities.Entreprise;
import com.evenix.services.EvenementServiceImpl;
import com.evenix.services.LieuServiceImpl;
import com.evenix.services.RoleServiceImpl;
import com.evenix.services.UtilisateurServiceImpl;
import com.evenix.services.EntrepriseServiceImpl;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvenixApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvenixApplication.class, args);
    }

}
