@echo off
rem Dev-server wrapper: guarantees Node on PATH regardless of parent env
rem (needed because shells that predate the Node install lack it)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
npm run dev
