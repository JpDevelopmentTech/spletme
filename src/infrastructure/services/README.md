# infrastructure/services

Esta carpeta es el destino final de los servicios que actualmente están en `src/services/`.

## Plan de migración

Mover progresivamente cada servicio aquí e implementar las interfaces de `src/domain/interfaces/`:

- [ ] `auth.ts` → `AuthService.ts` (implementa `IAuthService`)
- [ ] `albums.ts` → `AlbumsService.ts`
- [ ] `songs.ts` → `SongsService.ts`
- [ ] `labels.ts` → `LabelsService.ts`
- [ ] `splits.ts` → `SplitsService.ts`
- [ ] `wallet.ts` → `WalletService.ts`
- [ ] `payments.ts` → `PaymentsService.ts`
- [ ] `payoneer.ts` → `PayoneerService.ts`
- [ ] `onboarding.ts` → `OnboardingService.ts`
- [ ] `stripe.ts` → `StripeService.ts`
- [ ] `spotify.ts` → `SpotifyService.ts`
- [ ] `musicbrainz.ts` → `MusicBrainzService.ts`
