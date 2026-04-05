@echo off
echo =========================================
echo Starting Signature Fast Food
echo =========================================
echo.

:: Since this is a Supabase app, the backend runs in the cloud (Supabase).
:: We just need to start the Vite frontend server.

echo Starting Frontend Server...
cd signature-fastfood-main || echo "Already in correct directory"
npm run dev

pause
