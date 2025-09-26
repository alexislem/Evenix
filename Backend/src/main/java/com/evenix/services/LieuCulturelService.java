package com.evenix.services;

import com.evenix.dto.LieuCulturelDTO;

import java.util.List;
import java.util.Optional;

public interface LieuCulturelService {
    List<LieuCulturelDTO> getAll();
    Optional<LieuCulturelDTO> getById(int id);
    LieuCulturelDTO create(LieuCulturelDTO dto);
    Optional<LieuCulturelDTO> update(int id, LieuCulturelDTO dto);
    void delete(int id);
}
