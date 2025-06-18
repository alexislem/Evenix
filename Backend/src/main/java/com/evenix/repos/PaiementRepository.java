package com.evenix.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.evenix.entities.Paiement;

public interface PaiementRepository extends JpaRepository<Paiement, Integer> {

}
