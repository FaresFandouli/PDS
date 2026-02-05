package com.pds.authservice.service;

import com.pds.authservice.dto.*;
import com.pds.authservice.entity.User;
import com.pds.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Enregistrer un nouvel utilisateur
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si le username existe déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Ce nom d'utilisateur est déjà utilisé");
        }

        // Valider le mot de passe
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Le mot de passe doit avoir au minimum 6 caractères");
        }

        // Hasher le mot de passe
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Créer l'utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(hashedPassword);
        user.setRole(request.getRole());
        user.setActive(true);

        User savedUser = userRepository.save(user);
        log.info("Utilisateur inscrit avec succès: {}", savedUser.getUsername());

        // Générer les tokens JWT
        String jwtToken = jwtService.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(savedUser.getId(), savedUser.getUsername());

        return buildAuthResponse(savedUser, jwtToken, refreshToken);
    }

    /**
     * Connexion utilisateur
     */
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe invalide");
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe invalide");
        }

        // Vérifier si l'utilisateur est actif
        if (!user.getActive()) {
            throw new RuntimeException("Ce compte est désactivé");
        }

        // Mettre à jour la date de dernière connexion
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Générer les tokens
        String jwtToken = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getUsername());

        log.info("Utilisateur connecté: {}", user.getUsername());

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    /**
     * Récupérer le profil utilisateur
     */
    public AuthResponse getProfile(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        User user = userOpt.get();
        String jwtToken = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getUsername());

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    /**
     * Construire la réponse d'authentification
     */
    private AuthResponse buildAuthResponse(User user, String jwtToken, String refreshToken) {
        return AuthResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .role(user.getRole())
            .token(jwtToken)
            .refreshToken(refreshToken)
            .build();
    }
}
