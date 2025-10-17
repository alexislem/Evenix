package com.evenix.services;

import com.evenix.dto.TypeEvenementDTO;

import java.util.List;
import java.util.Optional;

public interface TypeEvenementService {
    List<TypeEvenementDTO> getAll();
    Optional<TypeEvenementDTO> getById(int id);
    TypeEvenementDTO create(TypeEvenementDTO dto);
    Optional<TypeEvenementDTO> update(int id, TypeEvenementDTO dto);
    void delete(int id);
}
