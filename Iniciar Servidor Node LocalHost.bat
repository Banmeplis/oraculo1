@echo off
TITLE Oráculo - Iniciando Servidor Node.js

echo ========================================================================
echo ✅ 1. Navegando a la carpeta del proyecto...
cd "C:\Users\JCZ\Documents\oraculo"
IF ERRORLEVEL 1 (
    echo ❌ ERROR: No se encontró la carpeta. Verifica la ruta.
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo ✅ 2. Instalando dependencias (npm install)...
npm install

IF ERRORLEVEL 1 (
    echo ❌ ERROR: Falló la instalación de dependencias.
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo ✅ 3. Iniciando el servidor (npm start)...
npm start

echo.
echo ========================================================================
echo 🚀 Servidor Oráculo Iniciado. Presiona cualquier tecla para cerrar la ventana.
pause > nul
