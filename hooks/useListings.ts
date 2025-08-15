import { useMemo } from 'react';

export type Listing = {
  id: string;
  title: string;
  lat: number; lng: number;
  category: string;
  verified?: boolean;
  condition?: 'new' | 'like_new' | 'used' | 'for_parts';
  attrs?: Record<string, any>;
};

export function useListings(): Listing[] {
  // For now, mock a few TCG + furniture
  return useMemo(() => [
    {
      id: 'pika-001',
      title: 'Pikachu VMAX (Secret Rare)',
      lat: 32.0809, lng: 34.7806,
      category: 'cards_pokemon',
      verified: true,
      condition: 'like_new',
      attrs: {
        cardType: 'pokemon',
        rarity: 'secret_rare',
        series: 'sword_shield',
        number: 44,
        holo: true,
        graded: 'psa',
        releaseYear: 2021,
      }
    },
    {
      id: 'sofa-1',
      title: 'IKEA 3-Seater Sofa',
      lat: 32.089, lng: 34.78,
      category: 'furniture',
      condition: 'used',
      attrs: { color: 'gray', material: 'fabric', widthCm: 210, depthCm: 90, heightCm: 85 }
    },
  ], []);
}
