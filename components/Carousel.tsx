import { Children, useRef } from "react";
import { ScrollView, View } from "react-native";

type CarouselProps = {
  children?: React.ReactNode;
  height: number;
  width: number;
  selected?: number;
};

export function Carousel({ children, height, width, selected }: CarouselProps) {
  const ref = useRef<any>(0);

  if (selected !== undefined) {
    ref.current?.scrollTo({ x: width * selected });
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      style={{ height: height, width: width }}
      ref={ref}
    >
      {Children.map(children, (child) => (
        <View style={{ height: "100%", width: width }}>{child}</View>
      ))}
    </ScrollView>
  );
}
