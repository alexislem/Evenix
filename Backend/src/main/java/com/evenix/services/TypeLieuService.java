package com.evenix.services;

import com.evenix.entities.TypeLieu;
import com.evenix.repos.TypeLieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TypeLieuService {

    @Autowired
    private TypeLieuRepository typeLieuRepository;

    public List<TypeLieu> getAllTypes() {
        return typeLieuRepository.findAll();
    }

    public Optional<TypeLieu> getTypeById(int id) {
        return typeLieuRepository.findById(id);
    }

    public Optional<TypeLieu> getTypeByLibelle(String libelle) {
        return typeLieuRepository.findByLibelle(libelle);
    }

    public TypeLieu createType(TypeLieu typeLieu) {
        return typeLieuRepository.save(typeLieu);
    }

    public TypeLieu updateType(int id, TypeLieu updatedType) {
        return typeLieuRepository.findById(id)
            .map(existing -> {
                existing.setLibelle(updatedType.getLibelle());
                return typeLieuRepository.save(existing);
            }).orElseThrow(() -> new RuntimeException("TypeLieu non trouvé avec l'id : " + id));
    }


    public void deleteType(int id) {
        typeLieuRepository.deleteById(id);
    }
}
