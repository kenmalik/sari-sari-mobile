import { Children, isValidElement, useRef } from "react";
import { ScrollView, View } from "react-native";

type CarouselProps = {
  children?: React.ReactNode;
  height: number;
  width: number;
  selected?: string;
};

export function Carousel({ children, height, width, selected }: CarouselProps) {
  const ref = useRef<any>(0);

  if (selected !== undefined && ref.current) {
    const index = Children.toArray(children).findIndex((element) => {
      if (isValidElement(element)) {
        return element.props?.id === selected;
      }
      return false;
    });
    if (index >= 0) {
      ref.current?.scrollTo({ x: width * index });
    }
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
