// com.evenix.security.SecParams
package com.evenix.security;

public interface SecParams {

    long EXPIRATION_MS = 10L * 24 * 60 * 60 * 1000;

    String PREFIX = "Bearer ";
    String HEADER = "Authorization";

}
