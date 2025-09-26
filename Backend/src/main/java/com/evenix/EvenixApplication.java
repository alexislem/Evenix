package com.evenix;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.services.RoleService;
import com.evenix.services.UtilisateurService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvenixApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvenixApplication.class, args);
    }

    /**
     * Initialise quelques rôles et utilisateurs au démarrage.
     * Utilise les services injectés dans le runner (pas dans le constructeur) pour éviter
     * tout cycle de dépendances avec d'autres beans (ex: BCryptPasswordEncoder).
     */
    @Bean
    CommandLineRunner initData(UtilisateurService utilisateurService,
                                      RoleService roleService) {
        return args -> {


            createRoleIfMissing(roleService, "ADMIN");
            createRoleIfMissing(roleService, "USER");


            createUserIfMissing(utilisateurService, roleService, "admin", "123", "ADMIN");
            createUserIfMissing(utilisateurService, roleService, "example", "123", "USER");
            createUserIfMissing(utilisateurService, roleService, "yassine", "123", "USER");



            utilisateurService.addRoleToUtilisateur("admin",   "ADMIN");
            utilisateurService.addRoleToUtilisateur("example", "USER");
            utilisateurService.addRoleToUtilisateur("yassine", "USER");
        };
    }

    /* -------- Helpers -------- */

    private void createRoleIfMissing(RoleService roleService, String roleName) {
        boolean exists = roleService.getAllRoles().stream()
                .anyMatch(r -> r.getNom() != null && r.getNom().equalsIgnoreCase(roleName));
        if (!exists) {
            roleService.createRole(new Role(roleName));
        }
    }

    private void createUserIfMissing(UtilisateurService utilisateurService,
            RoleService roleService,
            String nom, String rawPwd, String roleName) {
			if (utilisateurService.findUtilisateurByNom(nom).isEmpty()) {
			Utilisateur u = new Utilisateur();
			u.setNom(nom);
			u.setMotDePasse(rawPwd);
			Role role = roleService.getAllRoles().stream()
			.filter(r -> roleName.equalsIgnoreCase(r.getNom()))
			.findFirst()
			.orElseThrow(() -> new IllegalStateException("Rôle " + roleName + " introuvable"));
			u.setRole(role);                          
			utilisateurService.saveUtilisateur(u);
}
}

}
