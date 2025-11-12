import {
  Box,
  Text,
  Heading,
  Container,
  HStack,
  Center,
  Grid,
  Card,
  Stack,
} from "@chakra-ui/react";
import {
  ClipboardLink,
  ColorModeSwitch,
  SignOutButton,
  Messages,
  MobileToggle,
} from "./client";
import { CiChat1 } from "react-icons/ci";
import { createClient } from "@/utils/server";

export async function generateMetadata() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return {
    title: `GhostTalk - ${user?.email?.split("@gmail.com")[0]}`,
  };
}
export default async function Page() {
  return (
    <Box bg={{ base: "gray.100", _dark: "black" }} h="100vh">
      <Box
        py={4}
        borderWidth={1}
        borderBottom={{ base: "gray.200", _dark: "gray.700" }}
        bg={{ base: "white", _dark: "gray.900" }}
      >
        <Container
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
        >
          <HStack>
            <Heading color="pink.500">GhostTalk</Heading>
            <CiChat1 size={24} color="pink" />
          </HStack>
          <Box alignItems="center" gap={10} display={{ base: "none", lg: "flex" }}>
            <ColorModeSwitch />
            <SignOutButton />
          </Box>
          <MobileToggle />
        </Container>
      </Box>
      <Box py={10}>
        <Container maxW={{ base: "100%", md: "90%", lg: "50%" }}>
          <Center flexDirection="column" gap={5}>
            <Card.Root width="full">
              <Stack textAlign="center">
                <Card.Header
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  fontWeight="semibold"
                  fontSize={{ base: "lg", md: "xl" }}
                >
                  Anonymous Link
                </Card.Header>
                <Card.Description>
                  Share this link with your friends to chat with them!
                </Card.Description>
              </Stack>
              <Card.Body
                width="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <ClipboardLink />
              </Card.Body>
            </Card.Root>
          </Center>
          <Messages/>
        </Container>
      </Box>
    </Box>
  );
}
