@echo off
rem Fill demo data: featured posts, view counts, image/YouTube example
rem (run AFTER applying supabase/migrations/002_views_and_featured.sql)
set "PATH=C:\Program Files\nodejs;%PATH%"
node scripts/demo-extras.mjs
