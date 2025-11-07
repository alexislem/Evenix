package com.evenix;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.services.RoleServiceImpl;
import com.evenix.services.UtilisateurServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvenixApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvenixApplication.class, args);
    }


    @Bean
    CommandLineRunner initData(UtilisateurServiceImpl utilisateurService,
                                      RoleServiceImpl roleService) {
        return args -> {


            createRoleIfMissing(roleService, "ADMIN");
            createRoleIfMissing(roleService, "USER");
            createRoleIfMissing(roleService, "UTILISATEUR");


            createUserIfMissing(utilisateurService, roleService, "admin", "123", "ADMIN");
            createUserIfMissing(utilisateurService, roleService, "example", "123", "USER");
            createUserIfMissing(utilisateurService, roleService, "yassine", "123", "USER");



            utilisateurService.addRoleToUtilisateur("admin",   "ADMIN");
            utilisateurService.addRoleToUtilisateur("example", "USER");
            utilisateurService.addRoleToUtilisateur("yassine", "USER");
        };
    }


    private void createRoleIfMissing(RoleServiceImpl roleService, String roleName) {
        boolean exists = roleService.getAllRoles().stream()
                .anyMatch(r -> r.getNom() != null && r.getNom().equalsIgnoreCase(roleName));
        if (!exists) {
            roleService.createRole(new Role(roleName));
        }
    }

    private void createUserIfMissing(UtilisateurServiceImpl utilisateurService,
            RoleServiceImpl roleService,
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
