// 検索ボックス

import { SITE_URL } from '@/lib/constants';
import { Box, Flex } from '@chakra-ui/layout';
import { Formik } from 'formik';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import FaiconDiv from './faicon-div';

export default function SearchBox() {
  return (
    <>
      <Formik
        onSubmit={(values) => {
          location.href = `https://google.com/search?q=site%3A${SITE_URL}+${values.word}`;
        }}
        initialValues={{ word: '' }}
      >
        {({ handleSubmit, values }) => (
          <Flex w="full" as="form" onSubmit={handleSubmit as any}>
            <Box flexGrow={1} mr={1}>
              <InputControl placeholder="aa" name="word" />
            </Box>
            <SubmitButton colorScheme="gray" aria-label={`${values.word}でGoogleを検索`}>
              <FaiconDiv icon={['fas', 'search']} />
            </SubmitButton>
          </Flex>
        )}
      </Formik>
    </>
  );
}
