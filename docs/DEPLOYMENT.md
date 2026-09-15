# Deployment

## Goal

Keep deployment boring and cheap.

## Target Setup

Frontend:
- Vercel for Next.js

Backend:
- Supabase hosted project

Hosting configuration has not been verified. Add concrete environment setup and release instructions when deployment is configured.

## Minimal CI

A simple CI pipeline should run:
- install
- lint
- typecheck
- test if present
- build

Do not add complex deployment orchestration for the MVP.

## Environments

Minimum:
- local development
- production

A preview/staging environment is useful if the hosting platform provides it automatically.

## Secrets

Configure environment variables through the hosting provider.

Never:
- commit `.env.local`
- expose `SUPABASE_SERVICE_ROLE_KEY`
- paste production secrets into client code

## Database Changes

Prefer migration-based schema changes.

For production:
- review migrations
- apply in a controlled way
- ensure RLS policies exist before exposing tables

## Observability

MVP minimum:
- browser console kept clean
- host deployment logs
- Supabase logs
- basic error tracking later if needed

Do not add a full observability platform before there is a real need.
