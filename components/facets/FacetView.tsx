import React from "react";
import { View } from "react-native";
import { CATEGORY_FACETS, POKEMON_SETS } from "@/constants/facets";
import { ChipFacet, SectionHeader } from "@/components/FacetPieces";
import SetCheckboxList from "@/components/inputs/SetCheckboxList";

type Props = {
  subItemId: string;                     // e.g. "pokemon:cards" or "pokemon:set:sv09"
  value: Record<string, any>;            // facet state object for this sub-item
  onChange: (next: Record<string, any>) => void;
};

export default function FacetView({ subItemId, value, onChange }: Props) {
  const root = subItemId.split(":")[0] as keyof typeof CATEGORY_FACETS;

  // Pokémon Cards (deep facet UI)
  if (subItemId === "pokemon:cards" || subItemId.startsWith("pokemon:set:")) {
    const rarity = CATEGORY_FACETS.pokemon_cards.find(s => s.title === "Rarity")?.options ?? [];
    const element = CATEGORY_FACETS.pokemon_cards.find(s => s.title === "Element")?.options ?? [];

    return (
      <View>
        <SectionHeader title="Pokémon Filters" />
        <ChipFacet
          title="Rarity"
          options={rarity}
          value={value.rarity ?? []}
          onChange={(ids) => onChange({ ...value, rarity: ids })}
        />
        <ChipFacet
          title="Element"
          options={element}
          value={value.element ?? []}
          onChange={(ids) => onChange({ ...value, element: ids })}
        />
        <SetCheckboxList
          title="Set"
          options={POKEMON_SETS}
          value={value.sets ?? []}
          onChange={(ids) => onChange({ ...value, sets: ids })}
        />
      </View>
    );
  }

  // Generic categories (chips-based)
  const cfg = CATEGORY_FACETS[root];
  if (!cfg) return null;

  return (
    <View>
      {cfg.map((section) => (
        <ChipFacet
          key={section.title}
          title={section.title}
          options={section.options}
          value={value[section.title] ?? []}
          onChange={(ids) => onChange({ ...value, [section.title]: ids })}
        />
      ))}
    </View>
  );
}
