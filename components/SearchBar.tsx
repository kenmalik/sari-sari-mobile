import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, View, StyleSheet, Pressable, Platform } from "react-native";
import Animated, {
  ReduceMotion,
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ANIMATION_SPEED = 100;

export function FakeSearchBar() {
  const offset = 24 + styles.bar.padding - styles.barItems.gap;
  const slideAnimation = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const searchPressed = useRef<boolean>(false);
  useFocusEffect(
    useCallback(() => {
      if (searchPressed.current === true) {
        slideAnimation.value = offset;
        slideAnimation.value = withTiming(0, {
          duration: ANIMATION_SPEED,
          easing: Easing.inOut(Easing.ease),
          reduceMotion: ReduceMotion.System,
        });
        searchPressed.current = false;
      }
    }, [searchPressed.current]),
  );

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <Animated.View style={[styles.barItems, { left: slideAnimation }]}>
        <Link href={"/search/IntermediateSearch"} asChild>
          {Platform.OS === "ios" ? (
            <TextInput
              style={styles.input}
              placeholder="Search Shop Sari Sari"
              placeholderTextColor="grey"
              editable={false}
              onPress={() => (searchPressed.current = true)}
            />
          ) : (
            <Pressable
              style={styles.input}
              onPress={() => (searchPressed.current = true)}
            >
              <TextInput
                placeholder="Search Shop Sari Sari"
                placeholderTextColor="grey"
                editable={false}
              />
            </Pressable>
          )}
        </Link>
      </Animated.View>
    </View>
  );
}

type SearchBarProps = {
  onChangeText?: (text: string) => void;
};

export function SearchBar({ onChangeText }: SearchBarProps) {
  const offset = 24 + styles.bar.padding - styles.barItems.gap;
  const slideAnimation = useSharedValue(offset);
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState<string>("");

  function onSearch(text: string) {
    setSearchText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  }

  useEffect(() => {
    slideAnimation.value = withTiming(0, {
      duration: ANIMATION_SPEED,
      easing: Easing.inOut(Easing.ease),
      reduceMotion: ReduceMotion.System,
    });
  });

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <Animated.View style={[styles.barItems, { right: slideAnimation }]}>
        <Pressable onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color={Colors.text} />
        </Pressable>
        <TextInput
          autoFocus
          clearButtonMode="always"
          style={styles.input}
          placeholder="Search Shop Sari Sari"
          placeholderTextColor="grey"
          enterKeyHint="search"
          onSubmitEditing={() => {
            if (searchText !== "") {
              router.replace({
                pathname: "/(pages)/search/[searchTerm]",
                params: { searchTerm: searchText },
              });
              setSearchText("");
            }
          }}
          value={searchText}
          onChangeText={onSearch}
        />
        {Platform.OS === "android" && (
          <Pressable disabled={searchText === ""} onPress={() => onSearch("")}>
            <AntDesign
              name="close"
              size={20}
              color={searchText === "" ? Colors.tintDimmed : "white"}
            />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    backgroundColor: Colors.tint,
  },
  barItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    height: 32,
    backgroundColor: "white",
    borderRadius: 8,
    flex: 1,
    padding: 8,
  },
  results: {
    backgroundColor: "white",
    padding: 8,
    position: "absolute",
    width: "100%",
    gap: 8,
  },
});
