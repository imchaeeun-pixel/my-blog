@echo off
rem Insert 10 sample blog posts (run AFTER the category migration)
set "PATH=C:\Program Files\nodejs;%PATH%"
node scripts/seed.mjs
