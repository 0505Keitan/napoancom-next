import LinkChakra from '@/components/common/link-chakra';
import { Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';

const CopyBody = ({ title, md }: { title: string; md: string }) => {
  const [copied, setCopied] = useState(false);

  // Docsaurus用にタイトルと最後の改行をつける
  const mdForMatter = `---\ntitle: ${title}\n---\n\n${md}\n`;
  const handlecopy = () => {
    navigator.clipboard.writeText(mdForMatter);
    setCopied(true);
  };
  return (
    <Flex gridGap={3}>
      <Button area-label="(ASOBINON移行作業用ボタン)" onClick={handlecopy}>
        {copied ? 'コピーしました' : '本文のMarkdownをコピー'}
      </Button>
      <Button
        as={LinkChakra}
        isExternal
        href="https://github.com/aelyone/asobinon/issues/35#issuecomment-845836852"
      >
        👈 このボタンは何?
      </Button>
    </Flex>
  );
};

export default CopyBody;
