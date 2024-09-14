@echo off
setlocal

:check_bun
where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo 'bun' command not found. Installing 'bun'...
    powershell -c "irm bun.sh/install.ps1 | iex"    
    echo 'bun' installation completed.
) else (
    echo 'bun' is already installed.
)

echo Creating build folder structure...
if exist build (
    rmdir /s /q build
)

echo Building project...
bun install
bun run index.ts
if exist temp (
    mkdir build
    tar -xvf temp\client.zip -C build\client
    tar -xvf temp\server.zip -C build\server
    rmdir /s /q temp
    echo Install dependencies...
    cd build\server
    bun install
    cd ..\client
    bun install
    cd ..\..\
    copy client\.env build\client\.env
    copy server\.env build\server\.env
    echo Starting project...
    bun --filter "build/*" preview
) else (
    echo Starting project...
    bun --filter "*" preview
)

