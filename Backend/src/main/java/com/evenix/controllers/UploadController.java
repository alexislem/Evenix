package com.evenix.controllers;

import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private static final Set<String> ALLOWED_EXT = Set.of("png", "jpg", "jpeg", "webp");
    private static final long MAX_BYTES = 10L * 1024 * 1024; // 10MB

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestPart("file") MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Fichier manquant."));
        }

        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "");
        String filename = StringUtils.cleanPath(original);

        String ext = getExtension(filename).toLowerCase();
        if (!ALLOWED_EXT.contains(ext)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(Map.of("success", false, "message", "Format non supporté. (png, jpg, jpeg, webp)"));
        }

        if (file.getSize() > MAX_BYTES) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("success", false, "message", "Fichier trop volumineux (max 10MB)."));
        }

        // ✅ On écrit exactement dans le dossier que WebConfig expose en /uploads/**
        Path dirPath = Paths.get("src/main/resources/static/uploads")
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(dirPath);

        String safeName = UUID.randomUUID() + "." + ext;
        Path target = dirPath.resolve(safeName).normalize();

        if (!target.startsWith(dirPath)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Nom de fichier invalide."));
        }

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String publicUrl = "/uploads/" + safeName;

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image uploadée.",
                "data", Map.of(
                        "filename", safeName,
                        "url", publicUrl
                )
        ));
    }

    private static String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return (dot >= 0) ? filename.substring(dot + 1) : "";
    }
}
