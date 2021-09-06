import * as React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';

import { Color } from 'common/enums';
import { IPageNav } from 'common/interfaces';

type Props = {
  title: string;
  childPages: IPageNav[];
  onClick: () => void;
};

export const PageListItem: React.FC<Props> = ({
  title,
  childPages,
  onClick,
}) => {
  const hasChildPages = Boolean(childPages.length);

  return (
    <TouchableNativeFeedback onPress={onClick}>
      <View style={row}>
        <Text style={text}>{title}</Text>
        {hasChildPages && (
          <Icon name="chevron-right" size={28} color={Color.SECONDARY} />
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

const { row, text } = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
  },
});
