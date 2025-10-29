package com.example.spring.superhard.superhard_proyect.controllers;

import com.example.spring.superhard.superhard_proyect.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-order-confirmation")
    public ResponseEntity<Map<String, String>> sendOrderConfirmation(@RequestBody Map<String, Object> payload) {
        try {
            String toEmail = (String) payload.get("email");
            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = (Map<String, Object>) payload.get("orderData");

            if (toEmail == null || toEmail.isEmpty() || orderData == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Faltan datos: email o orderData."));
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("cartItems");
            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "No se puede enviar confirmación de una orden vacía."));
            }

            // Delegar al servicio (ahora es asíncrono y con HTML)
            emailService.enviarEmailConfirmacionCompra(toEmail, orderData);

            return ResponseEntity.ok(Map.of(
                "message", "Correo de confirmación enviado con éxito.",
                "email", toEmail
            ));

        } catch (Exception e) {
            System.err.println("Error en EmailController: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("message", "Error al procesar la solicitud de envío de email."));
        }
    }
}