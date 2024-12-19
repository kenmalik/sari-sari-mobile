import {
  Pressable,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { Link } from "expo-router";

export type CollectionCardProps = {
  id: string;
  title: string;
  image: { id: string; url: string; altText: string } | null;
  style?: StyleProp<ViewStyle>;
};

export function CollectionCard({
  id,
  title,
  image,
  style,
}: CollectionCardProps) {
  return (
    <Link
      href={{
        pathname: "/(pages)/collections/[id]",
        params: { id: id },
      }}
      asChild
    >
      <Pressable style={style}>
        <View
          style={[
            styles.card,
            image
              ? { justifyContent: "flex-start" }
              : { justifyContent: "center", alignItems: "center", padding: 6 },
          ]}
        >
          {image && <Image source={{ uri: image.url }} style={styles.image} />}
          <View
            style={[
              image
                ? styles.titleBlock
                : { height: "100%", justifyContent: "center" },
            ]}
          >
            <Text
              style={[
                styles.title,
                image
                  ? { marginBottom: 8 }
                  : {
                      textAlign: "center",
                      fontSize: 24,
                    },
              ]}
              numberOfLines={image ? 2 : 4}
            >
              {title}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: "100%",
    aspectRatio: "1 / 1.4",
  },
  image: {
    width: "100%",
    height: "80%",
    objectFit: "cover",
  },
  titleBlock: {
    height: "20%",
    margin: 8,
  },
  title: {
    fontWeight: "bold",
  },
});
