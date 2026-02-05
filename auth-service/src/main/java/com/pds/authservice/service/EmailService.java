package com.pds.authservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@pds-health.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Envoyer un email d'inscription avec mot de passe temporaire
     */
    public void sendRegistrationEmail(String to, String firstName, String lastName, String tempPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "Bienvenue sur PDS Health - Activez votre compte";
            String htmlContent = buildRegistrationEmailHtml(firstName, lastName, to, tempPassword);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email d'inscription envoyé à: {}", to);
        } catch (Exception e) {
            log.error("Erreur d'envoi d'email (IGNORÉ POUR DEV): {}", e.getMessage());
        }
    }

    /**
     * Envoyer un email de confirmation d'email
     */
    public void sendEmailVerificationEmail(String to, String firstName, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "Confirmez votre adresse email";
            String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
            String htmlContent = buildVerificationEmailHtml(firstName, verificationLink);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de vérification envoyé à: {}", to);
        } catch (Exception e) {
            log.error("Erreur d'envoi d'email (IGNORÉ POUR DEV): {}", e.getMessage());
        }
    }

    /**
     * Envoyer un email de confirmation de rendez-vous
     */
    public void sendAppointmentConfirmationEmail(String to, String firstName,
            String appointmentDate, String doctorName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "Confirmation de votre rendez-vous";
            String htmlContent = buildAppointmentEmailHtml(firstName, appointmentDate, doctorName);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de confirmation RDV envoyé à: {}", to);
        } catch (Exception e) {
            log.error("Erreur d'envoi d'email (IGNORÉ POUR DEV): {}", e.getMessage());
        }
    }

    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    public void sendPasswordResetEmail(String to, String firstName, String tempPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "Réinitialisation de votre mot de passe";
            String htmlContent = buildPasswordResetEmailHtml(firstName, to, tempPassword);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de réinitialisation envoyé à: {}", to);
        } catch (Exception e) {
            log.error("Erreur d'envoi d'email (IGNORÉ POUR DEV): {}", e.getMessage());
        }
    }

    /**
     * HTML pour l'email d'inscription
     */
    private String buildRegistrationEmailHtml(String firstName, String lastName, String email, String tempPassword) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .credentials { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
                        .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                        .footer { color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bienvenue sur PDS Health! 👋</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s %s</strong>,</p>

                            <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion:</p>

                            <div class="credentials">
                                <p><strong>Email:</strong> %s</p>
                                <p><strong>Mot de passe temporaire:</strong> <code style="background: #e0e0e0; padding: 5px 10px; border-radius: 3px;">%s</code></p>
                            </div>

                            <p>Pour accéder à votre compte, cliquez sur le bouton ci-dessous:</p>
                            <a href="%s/login" class="button">Se connecter</a>

                            <p><strong>Instructions:</strong></p>
                            <ol>
                                <li>Connectez-vous avec vos identifiants</li>
                                <li>Vous recevrez un email de confirmation</li>
                                <li>Confirmez votre email en cliquant sur le lien</li>
                                <li>Vous pourrez alors modifier votre mot de passe</li>
                            </ol>

                            <p>Si vous n'avez pas créé ce compte, veuillez ignorer cet email.</p>

                            <div class="footer">
                                <p>© 2024 PDS Health. Tous droits réservés.</p>
                                <p>Ne partagez jamais votre mot de passe avec quiconque.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(firstName, lastName, email, tempPassword, frontendUrl);
    }

    /**
     * HTML pour l'email de vérification
     */
    private String buildVerificationEmailHtml(String firstName, String verificationLink) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .button { background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                        .footer { color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Confirmez votre email</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s</strong>,</p>

                            <p>Merci de vous être inscrit(e) sur PDS Health!</p>
                            <p>Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous:</p>

                            <a href="%s" class="button">Confirmer mon email</a>

                            <p>Ou copiez ce lien dans votre navigateur:</p>
                            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">%s</p>

                            <p><strong>Ce lien expire dans 24 heures.</strong></p>

                            <p>Si vous n'avez pas créé ce compte, veuillez ignorer cet email.</p>

                            <div class="footer">
                                <p>© 2024 PDS Health. Tous droits réservés.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(firstName, verificationLink, verificationLink);
    }

    /**
     * HTML pour l'email de confirmation de RDV
     */
    private String buildAppointmentEmailHtml(String firstName, String appointmentDate, String doctorName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .appointment-details { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
                        .appointment-details p { margin: 10px 0; }
                        .footer { color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Rendez-vous confirmé ✓</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s</strong>,</p>

                            <p>Votre rendez-vous a été confirmé!</p>

                            <div class="appointment-details">
                                <p><strong>📅 Date et heure:</strong> %s</p>
                                <p><strong>👨‍⚕️ Docteur:</strong> %s</p>
                            </div>

                            <p><strong>Recommandations:</strong></p>
                            <ul>
                                <li>Arrivez 10 minutes avant l'heure prévue</li>
                                <li>Apportez vos documents d'assurance</li>
                                <li>En cas d'empêchement, prévenez-nous au moins 24h avant</li>
                            </ul>

                            <p>Merci d'avoir choisi PDS Health!</p>

                            <div class="footer">
                                <p>© 2024 PDS Health. Tous droits réservés.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(firstName, appointmentDate, doctorName);
    }

    /**
     * HTML pour l'email de réinitialisation de mot de passe
     */
    private String buildPasswordResetEmailHtml(String firstName, String email, String tempPassword) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .credentials { background: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                        .footer { color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Réinitialisation de mot de passe</h1>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>%s</strong>,</p>

                            <p>Une demande de réinitialisation de mot de passe a été reçue pour votre compte.</p>
                            <p>Voici votre nouveau mot de passe temporaire:</p>

                            <div class="credentials">
                                <p><strong>Email:</strong> %s</p>
                                <p><strong>Mot de passe temporaire:</strong> <code style="background: #e0e0e0; padding: 5px 10px; border-radius: 3px;">%s</code></p>
                            </div>

                            <p><strong>Étapes suivantes:</strong></p>
                            <ol>
                                <li>Connectez-vous avec votre email et le mot de passe temporaire</li>
                                <li>Changez immédiatement votre mot de passe dans les paramètres</li>
                                <li>Utilisez votre nouveau mot de passe pour les prochaines connexions</li>
                            </ol>

                            <p style="color: #ef4444;"><strong>⚠️ Important:</strong> Si vous n'avez pas demandé cette réinitialisation, changez votre mot de passe immédiatement!</p>

                            <div class="footer">
                                <p>© 2024 PDS Health. Tous droits réservés.</p>
                                <p>Ce mot de passe expire dans 24 heures.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(firstName, email, tempPassword);
    }
}
