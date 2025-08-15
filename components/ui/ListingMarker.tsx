// components/map/ListingMarker.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  place: any;
  img: string;
  onPress: () => void;
};

const PIN = 44;

export default function ListingMarker({ place, img, onPress }: Props) {
  // keep tracking updates until the image paints (prevents “green only”)
  const [tracks, setTracks] = React.useState(true);
  const [imgOk, setImgOk] = React.useState(true);

  const lat = place.geometry.coordinates[1];
  const lon = place.geometry.coordinates[0];
  const name = place?.properties?.name || "Listing";

  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lon }}
      title={name}
      tracksViewChanges={tracks}
    >
      {/* Green circular pin */}
      <View style={pinStyles.wrap}>
        <View style={pinStyles.circle}>
          {imgOk ? (
            <Image
              source={{ uri: img }}
              style={pinStyles.img}
              resizeMode="cover"
              onLoadEnd={() => setTimeout(() => setTracks(false), 60)}
              onError={() => {
                setImgOk(false);
                setTracks(false);
              }}
            />
          ) : (
            <View style={pinStyles.initialWrap}>
              <Text style={pinStyles.initial}>
                {name?.charAt(0)?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
        </View>
        <View style={pinStyles.pointer} />
      </View>

      {/* Callout */}
      <Callout tooltip onPress={onPress}>
        <View style={styles.calloutWrap}>
          <View style={styles.calloutCard}>
            <View style={styles.calloutThumb} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.calloutTitle}>{name}</Text>
              <Text style={styles.calloutAddress} numberOfLines={1}>
                {place.properties.address_line2}
              </Text>
              <Text style={styles.calloutMeta}>Swap value $200 • 2.5 miles away</Text>
              <View style={styles.calloutActions}>
                <View style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View</Text>
                  <Ionicons name="chevron-forward" size={16} color="#111" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.calloutArrow} />
        </View>
      </Callout>
    </Marker>
  );
}

const pinStyles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  // put the shadow on the **circle** so it isn't a square glow
  circle: {
    width: PIN,
    height: PIN,
    borderRadius: PIN / 2,
    backgroundColor: "#2ecc71",
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden", // clip the image into a perfect circle
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 6 },
    }),
  },
  img: {
    width: "100%",
    height: "100%",
  },
  initialWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  initial: {
    color: "#fff",
    fontWeight: "700",
  },
  pointer: {
    width: 10,
    height: 10,
    marginTop: -3,
    backgroundColor: "#2ecc71",
    transform: [{ rotate: "45deg" }],
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#fff",
  },
});

const styles = StyleSheet.create({
  // Callout
  calloutWrap: { alignItems: "center" },
  calloutCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    width: 290,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  calloutThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E9ECEF",
  },
  calloutTitle: {
    color: "#111",
    fontWeight: "700",
    fontSize: 15,
  },
  calloutAddress: {
    color: "#667085",
    fontSize: 12,
    marginTop: 2,
  },
  calloutMeta: {
    color: "#475467",
    fontSize: 12,
    marginTop: 6,
  },
  calloutActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F2F4F7",
  },
  viewBtnText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 13,
  },
  calloutArrow: {
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
    marginTop: -7,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
