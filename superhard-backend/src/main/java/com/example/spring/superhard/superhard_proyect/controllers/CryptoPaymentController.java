package com.example.spring.superhard.superhard_proyect.controllers;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller para pagos con criptomonedas usando NOWPayments
 * https://documenter.getpostman.com/view/7907941/S1a32n38
 */
@RestController
@RequestMapping("/api/crypto-payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class CryptoPaymentController {

    @Value("${nowpayments.api.key}")
    private String nowPaymentsApiKey;

    @Value("${nowpayments.sandbox:false}")
    private boolean sandboxMode;

    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    // NOWPayments URLs
    private static final String NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";
    private static final String NOWPAYMENTS_SANDBOX_URL = "https://api-sandbox.nowpayments.io/v1";

    private String getBaseUrl() {
        return sandboxMode ? NOWPAYMENTS_SANDBOX_URL : NOWPAYMENTS_API_URL;
    }

    /**
     * Obtener lista de criptomonedas disponibles
     */
    @GetMapping("/currencies")
    public ResponseEntity<Map<String, Object>> getAvailableCurrencies() {
        try {
            Request request = new Request.Builder()
                .url(getBaseUrl() + "/currencies")
                .addHeader("x-api-key", nowPaymentsApiKey)
                .get()
                .build();

            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Error al obtener monedas: " + responseBody);
                return ResponseEntity.status(response.code()).body(error);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            JsonArray currencies = jsonResponse.getAsJsonArray("currencies");

            Map<String, Object> result = new HashMap<>();
            result.put("currencies", currencies);
            result.put("total", currencies.size());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Obtener tasa de cambio mínima
     */
    @GetMapping("/min-amount/{currency}")
    public ResponseEntity<Map<String, Object>> getMinAmount(@PathVariable String currency) {
        try {
            Request request = new Request.Builder()
                .url(getBaseUrl() + "/min-amount?currency_from=" + currency + "&currency_to=" + currency)
                .addHeader("x-api-key", nowPaymentsApiKey)
                .get()
                .build();

            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Error al obtener monto mínimo");
                return ResponseEntity.status(response.code()).body(error);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            
            Map<String, Object> result = new HashMap<>();
            result.put("min_amount", jsonResponse.get("min_amount").getAsString());
            result.put("currency", currency);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Crear un pago con criptomonedas
     */
    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, Object>> createCryptoPayment(@RequestBody Map<String, Object> data) {
        try {
            System.out.println("📥 Creando pago crypto: " + data);

            if (!data.containsKey("price_amount") || !data.containsKey("pay_currency")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Se requieren 'price_amount' y 'pay_currency'");
                return ResponseEntity.badRequest().body(error);
            }

            // Preparar payload para NOWPayments
            Map<String, Object> paymentData = new HashMap<>();
            paymentData.put("price_amount", data.get("price_amount"));
            paymentData.put("price_currency", data.getOrDefault("price_currency", "usd"));
            paymentData.put("pay_currency", data.get("pay_currency")); // btc, eth, usdt, etc.
            paymentData.put("order_id", "ORDER-" + System.currentTimeMillis());
            paymentData.put("order_description", data.getOrDefault("description", "Compra e-commerce"));
            
            // Callbacks (opcional)
            if (data.containsKey("ipn_callback_url")) {
                paymentData.put("ipn_callback_url", data.get("ipn_callback_url"));
            }

            String jsonPayload = gson.toJson(paymentData);
            System.out.println("📤 Payload: " + jsonPayload);

            // Crear request
            okhttp3.RequestBody body = okhttp3.RequestBody.create(
                jsonPayload,
                MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                .url(getBaseUrl() + "/payment")
                .addHeader("x-api-key", nowPaymentsApiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            System.out.println("📨 Response status: " + response.code());
            System.out.println("📨 Response body: " + responseBody);

            if (!response.isSuccessful()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Error de NOWPayments: " + responseBody);
                return ResponseEntity.status(response.code()).body(error);
            }

            // Parsear respuesta
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            Map<String, Object> result = new HashMap<>();
            result.put("payment_id", jsonResponse.get("payment_id").getAsString());
            result.put("payment_status", jsonResponse.get("payment_status").getAsString());
            result.put("pay_address", jsonResponse.get("pay_address").getAsString());
            result.put("pay_amount", jsonResponse.get("pay_amount").getAsDouble());
            result.put("pay_currency", jsonResponse.get("pay_currency").getAsString());
            result.put("price_amount", jsonResponse.get("price_amount").getAsDouble());
            result.put("price_currency", jsonResponse.get("price_currency").getAsString());
            result.put("order_id", jsonResponse.get("order_id").getAsString());
            
            // URL de pago (si está disponible)
            if (jsonResponse.has("invoice_url")) {
                result.put("invoice_url", jsonResponse.get("invoice_url").getAsString());
            }

            System.out.println("✅ Pago creado: " + result.get("payment_id"));

            // TODO: Aquí es donde crearías la orden en tu base de datos.
            // String paymentId = jsonResponse.get("payment_id").getAsString();
            // double priceAmount = jsonResponse.get("price_amount").getAsDouble();
            // orderService.createOrder(paymentId, priceAmount, "PENDING_PAYMENT", "CRYPTO");

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            System.err.println("❌ Error de red: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error de conexión: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Verificar estado de un pago
     */
    @GetMapping("/payment-status/{paymentId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable String paymentId) {
        try {
            Request request = new Request.Builder()
                .url(getBaseUrl() + "/payment/" + paymentId)
                .addHeader("x-api-key", nowPaymentsApiKey)
                .get()
                .build();

            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Error al verificar pago");
                return ResponseEntity.status(response.code()).body(error);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            Map<String, Object> result = new HashMap<>();
            result.put("payment_id", jsonResponse.get("payment_id").getAsString());
            result.put("payment_status", jsonResponse.get("payment_status").getAsString());
            result.put("pay_amount", jsonResponse.get("pay_amount").getAsDouble());
            result.put("pay_currency", jsonResponse.get("pay_currency").getAsString());
            
            if (jsonResponse.has("actually_paid")) {
                result.put("actually_paid", jsonResponse.get("actually_paid").getAsDouble());
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("❌ Error al verificar pago: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Webhook para recibir notificaciones de NOWPayments (IPN)
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "x-nowpayments-sig", required = false) String signature) {
        
        try {
            System.out.println("🔔 Webhook recibido: " + payload);
            
            JsonObject event = gson.fromJson(payload, JsonObject.class);
            String paymentStatus = event.get("payment_status").getAsString();
            String paymentId = event.get("payment_id").getAsString();
            
            System.out.println("📌 Payment ID: " + paymentId);
            System.out.println("📌 Status: " + paymentStatus);
            
            // Manejar diferentes estados
            switch (paymentStatus) {
                case "finished":
                    System.out.println("✅ Pago completado!");
                    // Aquí actualizarías el pedido en tu BD
                    break;
                case "partially_paid":
                    System.out.println("⚠️ Pago parcial recibido");
                    break;
                case "failed":
                    System.out.println("❌ Pago fallido");
                    break;
                case "expired":
                    System.out.println("⏰ Pago expirado");
                    break;
                default:
                    System.out.println("📊 Estado: " + paymentStatus);
            }
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            System.err.println("❌ Error en webhook: " + e.getMessage());
            return ResponseEntity.status(500).body("Error");
        }
    }

    /**
     * Obtener estimado de precio
     */
    @GetMapping("/estimate")
    public ResponseEntity<Map<String, Object>> getEstimate(
            @RequestBody Map<String, Object> data) {
        try {
            double amount = ((Number) data.get("amount")).doubleValue();
            String currencyFrom = data.getOrDefault("currency_from", "usd").toString();
            String currencyTo = data.get("currency_to").toString();

            Request request = new Request.Builder()
                .url(getBaseUrl() + "/estimate?amount=" + amount + 
                     "&currency_from=" + currencyFrom + 
                     "&currency_to=" + currencyTo)
                .addHeader("x-api-key", nowPaymentsApiKey)
                .get()
                .build();

            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Error al estimar precio");
                return ResponseEntity.status(response.code()).body(error);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            Map<String, Object> result = new HashMap<>();
            result.put("estimated_amount", jsonResponse.get("estimated_amount").getAsString());
            result.put("currency_from", currencyFrom);
            result.put("currency_to", currencyTo);
            result.put("amount_from", amount);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}