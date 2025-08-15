// app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MOCK_PRODUCT_IMAGES } from "@/dbMock/dbMock";

// UI components
import BottomFooter from "@/components/ui/MapPage/BottomFooter";
import ListingMarker from "@/components/ui/ListingMarker";
import CategoryChips from "@/components/ui/MapPage/CategoryChips";
import FilterButton from "@/components/ui/MapPage/FilterButton";
import FiltersModal from "@/components/ui/FiltersModal";
import ListingCard from "@/components/ui/ListingCard";

const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY as string;
const CATEGORIES = ["Electronics", "Furniture", "Books", "Apparel"] as const;

// Optional: bright Google map style
const GOOGLE_LIGHT_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e7f7ea" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe9ff" }] },
];


export default function HomeScreen() {
  const router = useRouter();

  const [filterVisible, setFilterVisible] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("Electronics");

  // live radius from expandable chips (null hides the circle)
  const [previewRadiusKm, setPreviewRadiusKm] = useState<number | null>(null);

  const insets = useSafeAreaInsets();
  const chipsTop = insets.top + 20;

  const openFilters = () => setFilterVisible(true);
  const closeFilters = () => setFilterVisible(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (!coords) return;
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        // map activeCat to your own categories whenever you want
        const categories = "commercial.food_and_drink";
        const radius = 2000; // meters
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${coords.lon},${coords.lat},${radius}&limit=20&apiKey=${GEOAPIFY_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setListings(data.features || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPlaces();
  }, [coords, activeCat]);

  const openListing = (place: any) => {
    const id = place?.properties?.place_id ?? "";
    router.push({ pathname: "/listing/[id]", params: { id } });
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <ListingCard
        title={item.properties.name || "Unnamed"}
        subtitle={item.properties.address_line2}
        value="Swap Value: $200"
        distance="2.5 miles away"
        status="AVAILABLE"
        // imageUri can be wired later when you re-add images:
        // imageUri={MOCK_PRODUCT_IMAGES[index % MOCK_PRODUCT_IMAGES.length]}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {coords && (
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={GOOGLE_LIGHT_STYLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: coords.lat,
              longitude: coords.lon,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* You marker */}
            <Marker coordinate={{ latitude: coords.lat, longitude: coords.lon }} title="You" />

            {/* Live preview radius from quick filters */}
            {previewRadiusKm != null && (
              <Circle
                center={{ latitude: coords.lat, longitude: coords.lon }}
                radius={previewRadiusKm * 1000} // Circle expects meters
                strokeColor="rgba(46,204,113,0.85)"
                fillColor="rgba(46,204,113,0.14)"
                zIndex={1}
              />
            )}

            {/* Listing markers */}
            {listings.map((place, idx) => {
              const img = MOCK_PRODUCT_IMAGES.length
                ? MOCK_PRODUCT_IMAGES[idx % MOCK_PRODUCT_IMAGES.length]
                : "";
              return (
                <ListingMarker
                  key={place.properties.place_id}
                  place={place}
                  img={img}
                  onPress={() => openListing(place)}
                />
              );
            })}
          </MapView>
        )}

        {/* Category chips over the map (expandable with quick filters) */}
        <CategoryChips
          categories={[...CATEGORIES]}
          active={activeCat}
          onSelect={setActiveCat}
          top={chipsTop}
          // hook the live radius preview
          onRadiusPreview={setPreviewRadiusKm}
        />

        {/* Bottom sheet */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <BottomFooter>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Listings Near Me</Text>
              <FilterButton onPress={openFilters} />
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <FlatList
                data={listings}
                keyExtractor={(item) => item.properties.place_id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 12 }}
              />
            )}
          </BottomFooter>
        </View>
      </View>

      {/* Filters Modal (optional, keep if you want advanced filters) */}
      <FiltersModal visible={filterVisible} onClose={closeFilters} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Bottom-sheet header
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetTitle: { fontWeight: "700", fontSize: 16, color: "black" },
});
