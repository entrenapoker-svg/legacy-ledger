@echo off
rem Starts the live demo on Windows: local Solana validator (in WSL) + web app.
rem Then open http://localhost:3000 and pick "Localnet".
cd /d "%~dp0"
start "LegacyLedger validator" wsl -d Ubuntu --cd "%~dp0" -- bash -lc "./scripts/demo-local.sh"
cd app
if not exist node_modules call npm ci --legacy-peer-deps
start "" http://localhost:3000
call npx next dev -p 3000
