package com.evenix.services;

import com.evenix.dto.TypeEvenementDTO;
import java.util.List;

public interface TypeEvenementService {
    List<TypeEvenementDTO> getAllTypes();
    TypeEvenementDTO getTypeById(int id);
    TypeEvenementDTO createType(TypeEvenementDTO typeDTO);
    void deleteType(int id);
}