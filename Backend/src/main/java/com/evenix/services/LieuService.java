package com.evenix.services;

import com.evenix.dto.LieuDTO;

import java.util.List;
import java.util.Optional;

public interface LieuService {
    List<LieuDTO> getAllLieux();
    Optional<LieuDTO> getLieuById(int id);
    LieuDTO createLieu(LieuDTO dto);
    LieuDTO updateLieu(int id, LieuDTO dto);
    void deleteLieu(int id);
}
