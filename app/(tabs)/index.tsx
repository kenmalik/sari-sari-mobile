import { CollectionPreview } from "@/components/CollectionPreview";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <ScrollView>
      <CollectionPreview collectionId="gid://shopify/Collection/260817223773" />
      <CollectionPreview collectionId="gid://shopify/Collection/273118527581" />
    </ScrollView>
  );
}
