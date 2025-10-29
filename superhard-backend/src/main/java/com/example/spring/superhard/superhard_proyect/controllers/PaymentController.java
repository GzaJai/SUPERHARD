package com.example.spring.superhard.superhard_proyect.controllers;

import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.model.Venta;
import com.example.spring.superhard.superhard_proyect.repository.VentaRepository;
import com.example.spring.superhard.superhard_proyect.service.EmailService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference; // Importar la clase correcta para v2.1.7
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.core.env.Environment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${mercadopago.access.token}")
    private String mercadoPagoAccessToken;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    private Environment environment;

    // Tipo de cambio ARS → USD (actualiza según necesites)
    // Ejemplo: Si 1 USD = 1000 ARS, entonces ARS_TO_USD_RATE = 0.001
    private static final double ARS_TO_USD_RATE = 0.00067;

    @PostConstruct
    public void init() {
        // Inicializa Stripe
        Stripe.apiKey = stripeSecretKey;
        // Inicializa Mercado Pago
        System.out.println("----------------------------------------------------");
        System.out.println("INICIALIZANDO CONFIGURACIÓN DE PAGOS");
        System.out.println("URL del Frontend cargada: " + frontendUrl);
        System.out.println("----------------------------------------------------");
        MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
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

    @PostMapping("/create-mercadopago-preference")
    public ResponseEntity<?> createMercadoPagoPreference(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("📦 Creando preferencia de Mercado Pago (SDK v2.1.7) con payload: " + payload);

            List<Map<String, Object>> itemsPayload = (List<Map<String, Object>>) payload.get("items");
            if (itemsPayload == null || itemsPayload.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La lista de items no puede estar vacía."));
            }

            // --- LÓGICA PARA SDK v2.1.7 ---

            // 1. Crear la lista de ítems
            List<PreferenceItemRequest> preferenceItems = new ArrayList<>();
            for (Map<String, Object> itemData : itemsPayload) {
                preferenceItems.add(PreferenceItemRequest.builder()
                        .title((String) itemData.get("title"))
                        .quantity((Integer) itemData.get("quantity"))
                        .unitPrice(new BigDecimal(itemData.get("unit_price").toString()))
                        .currencyId((String) itemData.get("currency_id"))
                        .build());
            }

            // 2. Obtener la URL del frontend
            String currentFrontendUrl = environment.getProperty("app.frontend.url", "http://127.0.0.1:5173"); // Con valor por defecto
            System.out.println("--- DEBUG: Usando URL para MP: " + currentFrontendUrl + " ---");

            // 3. Crear las URLs de redirección
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(currentFrontendUrl + "/order-summary")
                    .failure(currentFrontendUrl + "/buy")
                    .pending(currentFrontendUrl + "/buy")
                    .build();

            // 4. Construir la preferencia
            com.mercadopago.client.preference.PreferenceRequest preferenceRequest = com.mercadopago.client.preference.PreferenceRequest.builder()
                    .items(preferenceItems)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .build();

            // 5. Crear el cliente y la preferencia (forma para v2.1.7)
            com.mercadopago.client.preference.PreferenceClient client = new com.mercadopago.client.preference.PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            System.out.println("✅ Preferencia de Mercado Pago creada: " + preference.getId());

            Map<String, String> response = new HashMap<>();
            response.put("preferenceId", preference.getId());

            return ResponseEntity.ok(response);

        } catch (MPApiException e) {
            System.err.println("❌ Error de API de Mercado Pago: " + e.getApiResponse().getContent());
            return ResponseEntity.status(e.getStatusCode()).body(e.getApiResponse().getContent());
        } catch (MPException e) {
            System.err.println("❌ Error de Mercado Pago: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        return ResponseEntity.ok("Webhook received");
    }

    // ✅ AGREGAR ESTE MÉTODO AL FINAL DE TU PaymentController.java

@Autowired
private VentaRepository ventaRepository;

@Autowired
private EmailService emailService;

@PostMapping("/confirm")
public ResponseEntity<?> confirmarPago(@RequestBody Map<String, Object> payload) {
    try {
        System.out.println("📥 Confirmando pago con payload: " + payload);

        // Validar datos obligatorios
        if (!payload.containsKey("usuarioId") || !payload.containsKey("total")) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Faltan datos obligatorios: usuarioId o total"
            ));
        }

        // Extraer datos del payload
        Long usuarioId = ((Number) payload.get("usuarioId")).longValue();
        String productos = (String) payload.get("productos");
        Double total = ((Number) payload.get("total")).doubleValue();
        String metodoPago = (String) payload.get("metodoPago");
        String pagoId = (String) payload.get("pagoId");
        String email = (String) payload.get("email");

        // Crear la venta
        Venta venta = new Venta();
        UsuarioModel usuario = new UsuarioModel();
        usuario.setId(usuarioId);
        venta.setUsuario(usuario);
        venta.setProductos(productos);
        venta.setTotal(total);
        venta.setMetodoPago(metodoPago);
        venta.setPagoId(pagoId);
        venta.setEstadoPago("Pagado"); // ✅ Establecer estado

        // Guardar en BD
        Venta ventaGuardada = ventaRepository.save(venta);

        System.out.println("✅ Venta guardada exitosamente - ID: " + ventaGuardada.getId() + 
                          " | Total: $" + total + " | Método: " + metodoPago);

        // Enviar email de confirmación (asíncrono)
        if (email != null && !email.isEmpty()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("cartItems", payload.get("cartItems"));
            orderData.put("total", total);
            orderData.put("paymentMethod", metodoPago);
            orderData.put("customerName", payload.getOrDefault("customerName", "Cliente"));
            
            emailService.enviarEmailConfirmacionCompra(email, orderData);
            System.out.println("📧 Email de confirmación enviado a: " + email);
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Venta registrada exitosamente",
            "ventaId", ventaGuardada.getId()
        ));

    } catch (Exception e) {
        System.err.println("❌ Error al confirmar pago: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of(
            "success", false,
            "message", "Error al registrar la venta: " + e.getMessage()
        ));
    }
}

}