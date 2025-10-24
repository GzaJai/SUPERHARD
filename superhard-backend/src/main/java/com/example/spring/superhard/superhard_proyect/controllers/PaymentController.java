package com.example.spring.superhard.superhard_proyect.controllers;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    // Tipo de cambio ARS → USD (actualiza según necesites)
    // Ejemplo: Si 1 USD = 1000 ARS, entonces ARS_TO_USD_RATE = 0.001
    private static final double ARS_TO_USD_RATE = 0.00067;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
            Stripe.apiKey = stripeSecretKey;

            // Debug
            System.out.println("📥 Request recibido: " + data);

            if (!data.containsKey("amount")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "El campo 'amount' es requerido");
                return ResponseEntity.badRequest().body(error);
            }

            Long amountInCents = ((Number) data.get("amount")).longValue();
            String requestedCurrency = data.getOrDefault("currency", "ars").toString().toLowerCase();
            
            // Variables finales
            Long finalAmount;
            String finalCurrency;
            double originalAmountInARS = 0;

            // Convertir ARS a USD automáticamente
            if ("ars".equals(requestedCurrency)) {
                
                double amountInARS = amountInCents / 100.0;
                double amountInUSD = amountInARS * ARS_TO_USD_RATE;
                
                // Convertir a centavos de USD
                finalAmount = Math.round(amountInUSD * 100);
                finalCurrency = "usd";
                
                System.out.println("💱 Conversión: $" + originalAmountInARS + " ARS → $" + amountInUSD + " USD");
                System.out.println("💰 Cobrando en Stripe: " + finalAmount + " centavos USD");
                
                // Validar monto mínimo (50 centavos USD = $50 ARS)
                if (finalAmount < 50) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "El monto mínimo es $50 ARS");
                    return ResponseEntity.badRequest().body(error);
                }
            } else {
                // USD directo
                finalAmount = amountInCents;
                finalCurrency = requestedCurrency;
                System.out.println("💰 Monto directo: $" + (finalAmount / 100.0) + " USD");
            }

            // Crear PaymentIntent en USD
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(finalAmount)
                .setCurrency(finalCurrency)
                .addPaymentMethodType("card")
                .setDescription("Compra e-commerce" + 
                    (originalAmountInARS > 0 ? " ($" + originalAmountInARS + " ARS)" : ""))
                .build();

            System.out.println("🔄 Creando PaymentIntent...");
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            System.out.println("✅ PaymentIntent creado: " + paymentIntent.getId());

            // Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("amount", finalAmount);
            response.put("currency", finalCurrency);
            
            // Info adicional para el frontend
            if (originalAmountInARS > 0) {
                response.put("originalAmount", amountInCents);
                response.put("originalCurrency", "ars");
                response.put("exchangeRate", ARS_TO_USD_RATE);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        return ResponseEntity.ok("Webhook received");
    }
}