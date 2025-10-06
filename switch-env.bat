@echo off
REM =====================================
REM Asset Management System - Environment Switcher (Windows)
REM =====================================
REM Batch script to easily switch between different environment configurations

setlocal enabledelayedexpansion

REM Colors for output (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output (simplified for Windows)
:print_info
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Function to detect current environment
:detect_current_env
if exist .env (
    findstr "SPRING_PROFILES_ACTIVE=testing" .env >nul 2>&1 && set "CURRENT_ENV=testing" && goto :eof
    findstr "SPRING_PROFILES_ACTIVE=production" .env >nul 2>&1 && set "CURRENT_ENV=production" && goto :eof
    set "CURRENT_ENV=custom"
) else (
    set "CURRENT_ENV=none"
)
goto :eof

REM Function to switch environment
:switch_environment
set "target_env=%~1"

echo Switching to %target_env% environment...

REM Backup current .env if it exists
if exist .env (
    set "timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "timestamp=!timestamp: =0!"
    copy .env ".env.backup.!timestamp!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo Backed up current .env file
    )
)

REM Copy new environment file
if exist ".env.%target_env%" (
    copy ".env.%target_env%" .env >nul 2>&1
    if !errorlevel! equ 0 (
        echo Switched to %target_env% environment
        echo.
        echo Next steps:
        echo 1. Review .env file and update any credentials if needed
        echo 2. Run: docker-compose -f docker-compose.fullstack.yml up -d
        echo 3. Check logs: docker-compose -f docker-compose.fullstack.yml logs -f
    ) else (
        echo ERROR: Failed to copy environment file!
        exit /b 1
    )
) else (
    echo ERROR: Environment file .env.%target_env% not found!
    exit /b 1
)
goto :eof

REM Function to show current environment
:show_current_env
call :detect_current_env
if "%CURRENT_ENV%"=="none" (
    echo [WARNING] No .env file found
) else (
    echo [INFO] Current environment: %CURRENT_ENV%
)
goto :eof

REM Function to show available environments
:show_environments
echo.
echo Available environments:
if exist ".env.testing" (
    echo   [✓] testing
) else (
    echo   [✗] testing (file missing)
)
if exist ".env.production" (
    echo   [✓] production
) else (
    echo   [✗] production (file missing)
)
echo.
goto :eof

REM Function to show environment comparison
:show_env_comparison
echo.
echo Environment comparison:
echo.
echo Service      Testing          Production       Notes
echo --------     --------         ----------       -----
echo Database     Local            Production       PostgreSQL instance
echo Email        Test SMTP        Prod SMTP        Gmail/Brevo
echo Logging      DEBUG            WARN/INFO        Performance
echo CORS         Localhost        Domain only      Security
echo JWT Exp      1 hour           12 hours         Security vs UX
echo.
goto :eof

REM Main menu
:show_menu
echo.
echo ====================================
echo 🚀 Asset Management System
echo     Environment Manager
echo ====================================
echo.

call :detect_current_env
if not "%CURRENT_ENV%"=="none" (
    echo Current environment: %CURRENT_ENV%
)

echo Available options:
echo 1) Switch to testing environment
echo 2) Switch to production environment
echo 3) Show current environment
echo 4) Show available environments
echo 5) Compare environments
echo 6) Exit
echo.
goto :eof

REM Main script logic
:main
call :show_menu

set /p "choice=Enter your choice (1-6): "

if "%choice%"=="1" (
    call :switch_environment "testing"
    pause
    exit /b 0
) else if "%choice%"=="2" (
    call :switch_environment "production"
    pause
    exit /b 0
) else if "%choice%"=="3" (
    call :show_current_env
    pause
    goto :main
) else if "%choice%"=="4" (
    call :show_environments
    pause
    goto :main
) else if "%choice%"=="5" (
    call :show_env_comparison
    pause
    goto :main
) else if "%choice%"=="6" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid option. Please try again.
    timeout /t 2 >nul
    goto :main
)

REM Run main function
:main
