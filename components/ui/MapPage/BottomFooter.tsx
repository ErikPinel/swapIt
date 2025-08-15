import React, { useMemo, useRef } from "react";
import { StyleSheet, Dimensions } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

type Props = { children?: React.ReactNode };

export default function BottomFooter({ children }: Props) {
  const ref = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["33%", "45%", "60%"], []);
  const maxHeight = Dimensions.get("window").height * 0.6; // cap at 60% vh

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      maxDynamicContentSize={maxHeight}
      enablePanDownToClose={false}
      enableContentPanningGesture={true}
      detached
      bottomInset={0}
      style={styles.detachedSheet}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  detachedSheet: { marginHorizontal: 0 },
  bg: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D0D5DD",
  },
  content: { flex: 1, padding: 12 },
});
