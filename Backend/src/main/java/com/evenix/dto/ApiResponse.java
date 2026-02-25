package com.evenix.dto;
import java.time.LocalDateTime;
/**
• Classe générique pour toutes les réponses de l'API
• Elle permet d'avoir un format uniforme pour toutes les réponses

*/ 
public class ApiResponse<T>{
	
private boolean success; // true = succès, false = erreur
private String message; // Message descriptif
private T data; // Les données (peut être null)
private LocalDateTime timestamp; // Date/heure de la réponse

// Constructeur principal
public ApiResponse(boolean success, String message, T data) {
 this.success = success;
 this.message = message;
 this.data = data;
 this.timestamp = LocalDateTime.now();
}

public ApiResponse(boolean success, String message) {
 this(success, message, null);
}

// Getters et Setters
public boolean isSuccess() {
 return success;
}
public void setSuccess(boolean success) {
 this.success = success;
}
public String getMessage() {
 return message;
}
public void setMessage(String message) {
 this.message = message;
}
public T getData() {
 return data;
}
public void setData(T data) {
 this.data = data;
}
public LocalDateTime getTimestamp() {
 return timestamp;
}
public void setTimestamp(LocalDateTime timestamp) {
 this.timestamp = timestamp;
}
}

