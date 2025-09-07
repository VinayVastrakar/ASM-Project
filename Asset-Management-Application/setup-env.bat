@echo off
REM Asset Management Application - Environment Setup Script for Windows
REM This script helps you set up your environment variables

echo 🚀 Asset Management Application - Environment Setup
echo ==================================================

REM Check if .env file already exists
if exist ".env" (
    echo ⚠️  .env file already exists!
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        pause
        exit /b 1
    )
)

REM Copy env.example to .env
if exist "env.example" (
    copy env.example .env >nul
    echo ✅ Created .env file from env.example
) else (
    echo ❌ env.example file not found!
    pause
    exit /b 1
)

echo.
echo 📝 Please edit the .env file with your actual values:
echo    - Database credentials
echo    - Email settings
echo    - JWT secret
echo    - Google OAuth client ID
echo.

REM Ask if user wants to open the file
set /p openfile="Do you want to open the .env file for editing? (y/N): "
if /i "%openfile%"=="y" (
    if exist "%ProgramFiles%\Microsoft VS Code\Code.exe" (
        "%ProgramFiles%\Microsoft VS Code\Code.exe" .env
    ) else if exist "%ProgramFiles(x86)%\Microsoft VS Code\Code.exe" (
        "%ProgramFiles(x86)%\Microsoft VS Code\Code.exe" .env
    ) else if exist "%USERPROFILE%\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
        "%USERPROFILE%\AppData\Local\Programs\Microsoft VS Code\Code.exe" .env
    ) else (
        notepad .env
    )
)

echo.
echo ✅ Environment setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your actual values
echo 2. Run: mvn spring-boot:run
echo 3. Or run with specific profile: mvn spring-boot:run -Dspring.profiles.active=dev
echo.
echo 📚 For more information, see ENVIRONMENT_SETUP.md
pause
