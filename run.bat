@echo off
echo =========================================
echo Starting Signature Cafe
echo =========================================
echo.

echo Starting Frontend Server...
cd signature-fastfood-main || echo "Already in correct directory"
npm run dev

pause
