"use client";
import {
  HStack,
  Text,
  Heading,
  Box,
  Container,
  Center,
  Avatar,
  AvatarGroup,
  Stack,
  Textarea,
  Button,
  Card,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CiChat1 } from "react-icons/ci";
import { ColorModeSwitch } from "../../users/client";
import { createClient } from "@/utils/client";
import { toaster, Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
export function FormMessage({ id }: { id: string }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const sendMessage = async () => {
    setLoading(true);
    if (!notes) {
      toaster.create({
        title: "Error",
        description: "Please enter your message.",
      });
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("anonymous_messages")
      .insert({
        user_id: userData?.id,
        messages: notes,
      })
      .single();
    if (error) {
      console.log(error.message);
      return;
    }
    toaster.create({
      title: "Message sent",
      description: "Your message has been sent.",
    });
    setLoading(false);
    setNotes("");
    console.log(data);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.log(error.message);
        return;
      }
      setUserData(data);
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    if (userData) {
      setShowDialog(true);
    }
  }, [userData])
  return (
    <>
      <Toaster />
      <Dialog.Root open={showDialog} onOpenChange={(e) => setShowDialog(e.open)} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner px={3}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Want to hear from ghost people? 👻
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Join us by pressing the open link.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="pink" size="sm" onClick={() => router.push("/")}>
                  Open Link
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
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
            <Box alignItems="center" gap={10}>
              <ColorModeSwitch />
            </Box>
          </Container>
        </Box>
        <Box mt={10}>
          <Container maxW={{ base: "100%", md: "90%", lg: "50%" }}>
            {userData?.email ? (
              <Center flexDirection="column">
                <Stack justifyContent="center" alignItems="center">
                  <AvatarGroup>
                    <Avatar.Root size="2xl">
                      <Avatar.Fallback
                        name={
                          userData?.email?.split("@gmail.com")[0] || "Anonymous"
                        }
                      />
                    </Avatar.Root>
                  </AvatarGroup>
                  <Heading>
                    {userData?.email?.split("@gmail.com")[0] || "Anonymous"}
                  </Heading>
                  <Text
                    color={{ base: "gray.700", _dark: "gray.300" }}
                    fontSize="2xl"
                    textAlign="center"
                  >
                    Send me anonymouse message.
                  </Text>
                </Stack>
                <Card.Root
                  width="full"
                  bg={{ base: "white", _dark: "gray.900" }}
                  mt={10}
                  rounded="md"
                >
                  <Card.Body>
                    <Textarea
                      name="notes"
                      bg={{ base: "gray.100", _dark: "gray.800" }}
                      placeholder="Enter your message"
                      focusRingColor="pink.400"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      mt={3}
                      colorPalette="pink"
                      loading={loading}
                      loadingText="Sending message..."
                      onClick={sendMessage}
                    >
                      Send Message
                    </Button>
                  </Card.Footer>
                </Card.Root>
              </Center>
            ) : (
              <Center>
                <Heading>User not found.</Heading>
              </Center>
            )}
          </Container>
        </Box>
      </Box>
    </>
  );
}
