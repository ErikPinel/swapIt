import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CATEGORY_FACETS, POKEMON_SETS } from '@/constants/facets';
import { ChipFacet } from '@/components/FacetPieces';
import FacetAccordion from '@/components/ui/FacetAccordion';
import SearchableMultiList from '@/components/inputs/SearchableMultiList';

type Props = {
  categoryOrSubLabel: string;
  value: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
};

export default function CategoryFacetPanel({ categoryOrSubLabel, value, onChange }: Props) {
  // Resolve config
  const cfg = CATEGORY_FACETS as any;
  const root = (categoryOrSubLabel.toLowerCase().includes('pok') ? 'pokemon_cards' : categoryOrSubLabel) as keyof typeof cfg;
  const sections = cfg[root] ?? [];

  const activeCountByTitle = useMemo(() => {
    const out: Record<string, number> = {};
    for (const s of sections) {
      const v = value[s.title];
      if (Array.isArray(v)) out[s.title] = v.length;
      else if (v && typeof v === 'object') out[s.title] = Object.values(v).filter(Boolean).length;
      else if (typeof v === 'boolean') out[s.title] = v ? 1 : 0;
      else out[s.title] = 0;
    }
    // Pokémon “Set” is usually stored under value.sets
    if (root === 'pokemon_cards' && value.sets) out['Set'] = value.sets.length;
    return out;
  }, [sections, value, root]);

  const setArray = (key: string, arr: string[]) => onChange({ ...value, [key]: arr });

  return (
    <View>
      {sections.map((section: any) => {
        const active = activeCountByTitle[section.title] ?? 0;

        // Pokémon: special “Set” UI
        const isPokemonSet = root === 'pokemon_cards' && section.title.toLowerCase() === 'set';
        if (isPokemonSet) {
          return (
            <FacetAccordion key={section.title} title={section.title} activeCount={value.sets?.length ?? 0}>
              <SearchableMultiList
                options={POKEMON_SETS}
                value={value.sets ?? []}
                onChange={(ids) => onChange({ ...value, sets: ids })}
                placeholder="Search sets…"
              />
            </FacetAccordion>
          );
        }

        // Default multi-select (chip style)
        return (
          <FacetAccordion key={section.title} title={section.title} activeCount={active}>
            <ChipFacet
              title=""
              options={section.options}
              value={value[section.title] ?? []}
              onChange={(ids) => setArray(section.title, ids)}
            />
          </FacetAccordion>
        );
      })}
    </View>
  );
}
