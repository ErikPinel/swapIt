import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#2ecc71";   // brand green
const INACTIVE = "#667085"; // neutral gray
const LABEL = "#111827";    // near-black label
const BAR_BG = "#FFFFFF";   // white pill bg

const BAR_HEIGHT = 56;
const BAR_BOTTOM_OFFSET = 0; // how far from the very bottom
const FAB_SIZE = 52;

const ICONS: Record<string, string> = {
  index: "map-outline",
  search: "search-outline",
  chat: "chatbubble-ellipses-outline",
  profile: "person-outline",
};

const LABELS: Record<string, string> = {
  index: "Map",
  search: "Explore",
  chat: "Chat",
  profile: "Profile",
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const inset = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;

  // Use real routes so right-side items (chat/profile) are proper tabs
  const leftRoutes = state.routes.slice(0, 2);   // index, search
  const rightRoutes = state.routes.slice(2, 4);     // chat, profile

  const onPressRoute = (routeName: string, isFocused: boolean) => {
    if (!isFocused) navigation.navigate(routeName as never);
  };

  // Center “+” sits half above the bar
  const fabBottom = inset.bottom + BAR_BOTTOM_OFFSET + (BAR_HEIGHT - FAB_SIZE / 2);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* Floating white pill (not full width) */}
      <View style={[styles.wrap, { bottom: inset.bottom + BAR_BOTTOM_OFFSET }]}>
        {/* Left (Map, Explore) */}
        <View style={styles.sideGroup}>
          {leftRoutes.map((route) => {
            const isFocused = current === route.name;
            return (
              <TabItem
                key={route.key}
                label={LABELS[route.name] ?? route.name}
                icon={ICONS[route.name] || "ellipse-outline"}
                focused={isFocused}
                onPress={() => onPressRoute(route.name, isFocused)}
              />
            );
          })}
        </View>

        {/* Right (Chat, Profile) — now also real TabItems with labels */}
        <View style={styles.sideGroup}>
          {rightRoutes.map((route) => {
            const isFocused = current === route.name;
            return (
              <TabItem
                key={route.key}
                label={LABELS[route.name] ?? route.name}
                icon={ICONS[route.name] || "ellipse-outline"}
                focused={isFocused}
                onPress={() => onPressRoute(route.name, isFocused)}
                small     // slightly tighter spacing for the right side
              />
            );
          })}
        </View>
      </View>

      {/* Center FAB */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Create listing"
        activeOpacity={0.9}
        style={[
          styles.fab,
          shadowLg,
          { bottom: fabBottom, left: "50%", transform: [{ translateX: -(FAB_SIZE / 2) }] },
        ]}
        onPress={() => {
          // navigation.navigate("(create)" as never);
        }}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function TabItem({
  label,
  icon,
  focused,
  onPress,
  small,
}: {
  label: string;
  icon: string;
  focused: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, small && styles.tabSmall]}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon as any} size={22} color={focused ? ACTIVE : INACTIVE} />
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignSelf: "center",
    width: "86%",                 // not full width
    height: BAR_HEIGHT,
    backgroundColor: BAR_BG,
    borderRadius: 28,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    ...Platform.select({
      android: { elevation: 10 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  sideGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  tabSmall: {
    minWidth: 52,
  },
  label: {
    color: LABEL,
    fontSize: 11,
    marginTop: 2,
  },
  labelActive: {
    color: ACTIVE,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: ACTIVE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 6,
    borderWidth: 3,             // white ring so it stands off the bar
    borderColor: "#fff",
  },
});

const shadowLg = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 8 },
});
