// FontAwesomeはwidthがないと表示されないので、このコンポーネントで確実に幅を与える

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from '@chakra-ui/react';

interface Props {
  w?: string | number;
  icon: IconProp;
  color?: string;
}
const FaiconDiv = ({ w, icon, color }: Props) => (
  <Box w={w ?? 4} color={color ?? ''}>
    <FontAwesomeIcon icon={icon} />
  </Box>
);

export default FaiconDiv;
