import { CollectionPreview } from "@/components/CollectionPreview";
import { ScrollView } from "react-native";

const BEST_SELLERS_COLLECTION_ID = "gid://shopify/Collection/260817223773";
const NEW_ARRIVALS_COLLECTION_ID = "gid://shopify/Collection/273118527581";

export default function Index() {
  return (
    <ScrollView>
      <CollectionPreview collectionId={BEST_SELLERS_COLLECTION_ID} />
      <CollectionPreview collectionId={NEW_ARRIVALS_COLLECTION_ID} />
    </ScrollView>
  );
}
