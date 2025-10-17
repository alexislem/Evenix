package com.evenix.security;

public interface SecParams {
  long   EXP_TIME = 10L * 24 * 60 * 60 * 1000;      
  String SECRET   = "exampleb@yahoo.com";           
  String PREFIX   = "Bearer ";
  String HEADER   = "Authorization";
}
