#!/bin/bash

# This script seeds the database with test process data

# Make the script exit on any error
set -e

echo "Seeding test processes data..."

# Run the SQL file against the Supabase database
npx supabase db push --db-url postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed_processes.sql

echo "Test processes data seeded successfully!" 