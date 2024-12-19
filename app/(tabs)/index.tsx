import { StatusBar } from "expo-status-bar";
import CollectionView from "@/components/CollectionView";

export default function Index() {
  return (
    <>
      <StatusBar style="light" />
      <CollectionView
        collectionId={"gid://shopify/Collection/260817223773"}
        maxItems={10}
      />
    </>
  );
}
