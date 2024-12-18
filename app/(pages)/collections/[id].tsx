import CollectionView from "@/components/CollectionView";
import { useLocalSearchParams } from "expo-router";

export default function CollectionPage() {
  const { id } = useLocalSearchParams();
  return <CollectionView collectionId={id} />;
}
