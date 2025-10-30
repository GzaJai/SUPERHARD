@echo off
echo ============================================
echo Iniciando aplicacion con 1 solo ngrok
echo ============================================

REM --- 1. Iniciar ngrok primero ---
echo.
echo [1/4] Iniciando ngrok en puerto 5173...
start "ngrok" ngrok http 5173
timeout /t 5 /nobreak > nul

REM --- 2. Obtener URL de ngrok ---
echo.
echo [2/4] Obteniendo URL publica...
FOR /F "tokens=2 delims=," %%i IN ('curl -s -X GET http://127.0.0.1:4040/api/tunnels ^| findstr /R "public_url.*https"') DO (
    FOR /F "tokens=2 delims=:" %%j IN ("%%i") DO (
        SET NGROK_URL=https:%%j
    )
)

SET NGROK_URL=%NGROK_URL:"=%

if "%NGROK_URL%"=="" (
    echo ERROR: No se pudo obtener la URL de ngrok
    pause
    exit /b 1
)

echo URL obtenida: %NGROK_URL%

REM --- 3. Establecer variable de entorno ---
echo.
echo [3/4] Configurando variable de entorno...
SET FRONTEND_URL=%NGROK_URL%
echo FRONTEND_URL=%FRONTEND_URL%

REM --- 4. Iniciar Backend con la variable ---
echo.
echo [4/4] Iniciando servicios...
echo.
start "Spring Boot Backend" cmd /k "SET FRONTEND_URL=%NGROK_URL% && cd /d %~dp0 && call mvnw spring-boot:run"
timeout /t 5 /nobreak > nul

REM --- 5. Iniciar Frontend ---
start "Vite Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo ============================================
echo          APLICACION LISTA!
echo ============================================
echo.
echo  URL Publica:  %NGROK_URL%
echo  Backend:      http://localhost:8080
echo  Frontend:     http://localhost:5173
echo.
echo ============================================
echo  Abre tu navegador en: %NGROK_URL%
echo ============================================
echo.
echo Presiona cualquier tecla para abrir en el navegador...
pause >nul

start %NGROK_URL%

echo.
echo Para detener: Cierra las ventanas de Spring Boot, Vite y ngrok
pause