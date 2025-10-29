package com.example.spring.superhard.superhard_proyect.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.sender:noreply@superhard.com}")
    private String fromEmail;

    @Value("${app.mail.sender-name:SUPERHARD}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarEmailConfirmacionCompra(String destinatario, Map<String, Object> orderData) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(destinatario);
            helper.setSubject("✅ Confirmación de tu compra en SUPERHARD");

            String htmlContent = construirEmailHTML(orderData);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Email de confirmación enviado a: " + destinatario);

        } catch (Exception e) {
            System.err.println("❌ Error enviando email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    private String construirEmailHTML(Map<String, Object> orderData) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("es", "AR"));
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }");
        html.append(".container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }");
        html.append(".header { background-color: #000; color: #EEDA00; padding: 30px; text-align: center; }");
        html.append(".header h1 { margin: 0; font-size: 32px; font-style: italic; }");
        html.append(".content { padding: 30px; }");
        html.append(".order-item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between; }");
        html.append(".total { background-color: #000; color: #EEDA00; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 5px; }");
        html.append(".footer { background-color: #282828; color: #fff; padding: 20px; text-align: center; font-size: 14px; }");
        html.append("table { width: 100%; border-collapse: collapse; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>SUPERHARD</h1>");
        html.append("<p style='color: #fff; margin-top: 10px;'>¡Gracias por tu compra!</p>");
        html.append("</div>");
        
        // Content
        html.append("<div class='content'>");
        
        String customerName = (String) orderData.get("customerName");
        if (customerName != null && !customerName.isEmpty()) {
            html.append("<h2>Hola ").append(customerName).append("! 👋</h2>");
        } else {
            html.append("<h2>¡Hola! 👋</h2>");
        }
        
        html.append("<p>Tu pedido ha sido confirmado y está siendo procesado.</p>");
        html.append("<h3 style='margin-top: 30px;'>Resumen de tu pedido:</h3>");
        
        // Items
        List<Map<String, Object>> cartItems = (List<Map<String, Object>>) orderData.get("cartItems");
        
        if (cartItems != null && !cartItems.isEmpty()) {
            for (Map<String, Object> item : cartItems) {
                html.append("<div class='order-item'>");
                html.append("<div>");
                html.append("<strong>").append(item.get("nombre")).append("</strong><br>");
                html.append("<span style='color: #666;'>Cantidad: ").append(item.get("cantidad")).append("</span>");
                html.append("</div>");
                html.append("<div style='text-align: right;'>");
                
                Number precio = (Number) item.get("precio");
                Number cantidad = (Number) item.get("cantidad");
                double subtotal = precio.doubleValue() * cantidad.intValue();
                
                html.append("<strong>").append(currencyFormat.format(subtotal)).append("</strong>");
                html.append("</div>");
                html.append("</div>");
            }
        }
        
        // Total
        html.append("<div class='total'>");
        Number total = (Number) orderData.get("total");
        html.append("TOTAL: ").append(currencyFormat.format(total.doubleValue()));
        html.append("</div>");
        
        // Payment method
        String paymentMethod = (String) orderData.get("paymentMethod");
        if (paymentMethod != null && !paymentMethod.isEmpty()) {
            html.append("<p><strong>Método de pago:</strong> ").append(paymentMethod).append("</p>");
        }
        
        html.append("<p style='margin-top: 30px; color: #666;'>Recibirás otro correo cuando tu pedido sea enviado.</p>");
        html.append("</div>");
        
        // Footer
        html.append("<div class='footer'>");
        html.append("<p><strong>SUPERHARD</strong> - Tu tienda de hardware</p>");
        html.append("<p>📧 contacto@superhard.com | 📞 +54 261 123-4567</p>");
        html.append("<p style='font-size: 12px; color: #999; margin-top: 10px;'>Este es un correo automático, por favor no respondas.</p>");
        html.append("</div>");
        
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");
        
        return html.toString();
    }
}