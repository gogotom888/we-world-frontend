@echo off
setlocal enabledelayedexpansion
:: Set UTF-8 encoding
chcp 65001 >nul
:: Set Qoder's directory and executable file path
set "QODER_DIR=C:\Users\%USERNAME%\AppData\Local\Programs\Qoder\resources\app\resources"
set "QODER_EXE=Qoder.exe"
set "QODER_CACHE_DIR=C:\Users\%USERNAME%\AppData\Roaming\Qoder\SharedClientCache"
set "BIN_DIR=!QODER_DIR!\bin"
set "LOG_DIR=!QODER_CACHE_DIR!\logs"

:: Find the subdirectory with the highest version number in the bin directory
echo !BIN_DIR!

:foundVersion
set "QODER_EXE_DIR=!BIN_DIR!\x86_64_windows"
echo Latest directory: !QODER_EXE_DIR!

:: Set log file path
set "LOG_FILE=%~dp0Qoder_Log_%DATE:/=-%_%TIME::=-%.txt"

:: Write information introduction
(
    echo "Qoder Log"
    echo ========================
    echo.
) > "%LOG_FILE%"

:: Get proxy settings and write to log
(
    echo "[Network Settings - 0x0 means no proxy enabled]"
    reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings" | find "ProxyEnable"
    echo.
) >> "%LOG_FILE%"

:: Check if Qoder.exe exists
if not exist "!QODER_EXE_DIR!\!QODER_EXE!" (
    echo "Error: Qoder.exe does not exist or is not executable!"
)

:: Record curl requests to log
(
    echo "[curl requests]"
    echo "Request 1: GET https://api2.qoder.sh/algo/api/v1/ping"
    curl -s "https://api2.qoder.sh/algo/api/v1/ping"
    echo.
    echo "Request 2: GET https://qoder.com/"
    curl -s -o nul -w "%%{http_code}" "https://qoder.com"
    echo.
) >> "%LOG_FILE%"

:: Get directory structure and write to log
(
    echo "[Directory Structure]"
    tree /F /A "%QODER_DIR%"
    echo.
) >> "%LOG_FILE%"

:: Check configuration files
(
    echo "[Configuration File Check]"
    if exist "!BIN_DIR!\config.json" (
        echo "config.json: Exists"
    ) else (
        echo "config.json: Does not exist"
    )
    if exist "!BIN_DIR!\env.json" (
        echo "env.json: Exists"
    ) else (
        echo "env.json: Does not exist"
    )
    echo.
) >> "%LOG_FILE%"

:: Get OS and hardware information and write to log
(
    echo "[Operating System Information]"
    echo "OS Version:"
    ver
    echo.
    echo "Chip Model:"
    wmic cpu get name
    echo.
) >> "%LOG_FILE%"

:: Record version parameter results to log
(
    echo "[version parameter]"
    cmd /c "!QODER_EXE_DIR!\!QODER_EXE!" version 2>&1
    echo.
) >> "%LOG_FILE%"

:: Start Qoder and record results
(
    echo "[Start Qoder]"
    cmd /c "!QODER_EXE_DIR!\!QODER_EXE!" version 2>&1
    echo.
) >> "%LOG_FILE%"

:: Check .info file
(
    echo "[.info File Check]"
    if exist "!QODER_DIR!\.info" (
        echo ".info file: Exists"
        for %%A in ("!QODER_DIR!\.info") do (
            if %%~zA gtr 0 (
                echo "File content: Not empty"
                type "!QODER_DIR!\.info"
            ) else (
                echo "File content: Empty"
            )
        )
    ) else (
        echo ".info file: Does not exist"
    )
    echo.
) >> "%LOG_FILE%"

(
    echo.
    echo "If you have any questions, please contact us at contact@qoder.com."
) >> "%LOG_FILE%"

echo Log has been saved to: %LOG_FILE%

:: Create diagnosis package
set "CACHE_DIR=!QODER_CACHE_DIR!\cache"
:: Create simple timestamp format following project specification
set "ZIP_FILE=%~dp0qoder-diagnosis_%DATE:/=-%_%TIME::=-%.zip"
set "TEMP_DIR=%~dp0temp_diagnosis"

echo.
echo Creating diagnosis package...

:: Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% equ 0 (
    echo PowerShell detected, creating full diagnosis package...
    
    :: Create temporary directory for collecting files
    if exist "!TEMP_DIR!" rmdir /s /q "!TEMP_DIR!"
    mkdir "!TEMP_DIR!"

    :: Copy cache files if they exist
    echo Collecting cache files...
    if exist "!CACHE_DIR!\app-config.json" (
        copy "!CACHE_DIR!\app-config.json" "!TEMP_DIR!\" >nul
        echo - app-config.json collected
    ) else (
        echo - app-config.json not found
    )

    if exist "!CACHE_DIR!\cache.json" (
        copy "!CACHE_DIR!\cache.json" "!TEMP_DIR!\" >nul
        echo - cache.json collected
    ) else (
        echo - cache.json not found
    )

    if exist "!CACHE_DIR!\client.json" (
        copy "!CACHE_DIR!\client.json" "!TEMP_DIR!\" >nul
        echo - client.json collected
    ) else (
        echo - client.json not found
    )

    if exist "!CACHE_DIR!\credit" (
        copy "!CACHE_DIR!\credit" "!TEMP_DIR!\" >nul
        echo - credit collected
    ) else (
        echo - credit not found
    )

    if exist "!CACHE_DIR!\diagnosis.bin" (
        copy "!CACHE_DIR!\diagnosis.bin" "!TEMP_DIR!\" >nul
        echo - diagnosis.bin collected
    ) else (
        echo - diagnosis.bin not found
    )

    :: Copy log file
    if exist "%LOG_FILE%" (
        copy "%LOG_FILE%" "!TEMP_DIR!\" >nul
        echo - Log file collected
    )

    :: Create zip file using PowerShell
    echo Creating zip archive...
    powershell -Command "Compress-Archive -Path '!TEMP_DIR!\*' -DestinationPath '!ZIP_FILE!' -Force"

    :: Clean up temporary directory
    rmdir /s /q "!TEMP_DIR!"

    :: Clean up log file from current directory
    if exist "%LOG_FILE%" (
        del "%LOG_FILE%"
    )

    :: Check if zip was created successfully
    if exist "!ZIP_FILE!" (
        echo.
        echo ========================
        echo Diagnosis package created successfully!
        echo ZIP file path: !ZIP_FILE!
        echo ========================
        echo.
        echo Zip Created: !ZIP_FILE!
    ) else (
        echo.
        echo Error: Failed to create diagnosis package!
        echo.
    )
) else (
    echo PowerShell not available, diagnosis package cannot be created.
    echo.
    echo ========================
    echo Log file available at: %LOG_FILE%
    echo ========================
    echo.
)

:: Open zip file location in Explorer if PowerShell was available
if exist "!ZIP_FILE!" (
    explorer /select,"!ZIP_FILE!"
) else (
    :: If no zip file, open log file with Notepad
    if exist "%LOG_FILE%" (
        notepad "%LOG_FILE%"
    )
)
