"use client";
import {
  Clipboard,
  IconButton,
  Input,
  InputGroup,
  Switch,
  Button,
  GridItem,
  Card,
  HStack,
  Stack,
  Text,
  Drawer,
  Portal,
  CloseButton,
  Dialog,
  Grid,
  Heading,
  Box,
  Center,
} from "@chakra-ui/react";
import { BsList } from "react-icons/bs";
import { CiClock1, CiChat1, CiInboxIn } from "react-icons/ci";
import { toaster, Toaster } from "@/components/ui/toaster";
import { useColorMode, ColorModeIcon } from "@/components/ui/color-mode";
import { useEffect, useState } from "react";
import { Auth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/client";

export function ClipboardLink() {
  const supabase = createClient();
  const [id, setId] = useState("");
  const [link, setLink] = useState("");
  useEffect(() => {
    const fetchId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        setId(user.id);
      }
    };
    fetchId();
  }, [supabase]);
  useEffect(() => {
    if (id) {
      setLink(`${window.location.origin}/letter/${id}`);
    }
  }, [id]);
  const copy = () => {
    toaster.create({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };
  return (
    <>
      <Toaster />
      <Clipboard.Root w="100%" maxW="800px" value={link}>
        <InputGroup
          endElement={
            <Clipboard.Trigger asChild onClick={copy}>
              <IconButton variant="surface" size="xs" me="-2">
                <Clipboard.Indicator />
              </IconButton>
            </Clipboard.Trigger>
          }
        >
          <Clipboard.Input asChild>
            <Input
              focusRingColor="pink.400"
              placeholder="size (lg)"
              size="lg"
              bg={{ base: "gray.200", _dark: "gray.800" }}
            />
          </Clipboard.Input>
        </InputGroup>
      </Clipboard.Root>
    </>
  );
}

export function ColorModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Switch.Root
      colorPalette="pink"
      checked={colorMode === "dark"}
      onCheckedChange={() => toggleColorMode()}
    >
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label display="flex" alignItems="center" gap={3}>
        <ColorModeIcon /> {colorMode === "dark" ? "Dark" : "Light"} Mode
      </Switch.Label>
    </Switch.Root>
  );
}

export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signOut = async () => {
    setLoading(true);
    await Auth.signOutFromAccount();
    router.push("/");
  };
  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirmation</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>Are you sure you want to sign out?</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={signOut}
                  colorPalette="pink"
                  loading={loading}
                  loadingText="Signing Out..."
                >
                  Confirm
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Button colorPalette="pink" size="sm" onClick={() => setOpen(true)}>
        Sign Out
      </Button>
    </>
  );
}

export function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const supabase = createClient();
  const refreshMessage = async () => {
    setLoading(true);
    await fetchMessasge();
    setLoading(false);
  };
  const deleteMessage = async (id: string) => {
    setLoadingId(id);
    await supabase.from("anonymous_messages").delete().eq("id", id);
    fetchMessasge();
  };
  const fetchMessasge = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: messages, error } = await supabase
      .from("anonymous_messages")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      console.log(error.message);
      return;
    }
    setMessages(messages || []);
  };
  useEffect(() => {
    fetchMessasge();
  }, []);
  return (
    <>
      <Stack mt={10}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <HStack>
            <Box p={{ base: 1, md: 2 }} bg="pink.500" rounded="md">
              <CiInboxIn size={24} color="white" />
            </Box>
            <Heading color={{ base: "gray.700", _dark: "gray.300" }}>
              Inbox
            </Heading>
          </HStack>
          <Button
            colorPalette="pink"
            onClick={() => refreshMessage()}
            loading={loading}
            loadingText="Refreshing..."
          >
            Refresh
          </Button>
        </Box>
        <Text color={{ base: "gray.700", _dark: "gray.300" }}>
          You have {messages?.length || 0} messages.
        </Text>
      </Stack>
      {messages.length > 0 ? (
        <Grid
          gap={5}
          mt={5}
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        >
          {messages.map((message: any) => (
            <GridItem key={message.id}>
              <Card.Root size="sm">
                <Card.Header fontWeight="semibold">Anonymous User</Card.Header>
                <Card.Body>
                  <Text>{message.messages}</Text>
                </Card.Body>
                <Card.Footer display="flex" justifyContent="space-between">
                  <Stack>
                    <HStack>
                      <CiClock1 size={20} />
                      <Text color={{ base: "gray.600", _dark: "gray.300" }}>
                        {new Date(message.created_at).toLocaleString()}
                      </Text>
                    </HStack>
                  </Stack>
                  <Button
                    loading={loadingId === message.id}
                    loadingText="Deleting..."
                    size="sm"
                    colorPalette="pink"
                    onClick={() => deleteMessage(message.id)}
                  >
                    Remove
                  </Button>
                </Card.Footer>
              </Card.Root>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Center h="50vh">
          <Heading color={{ base: "gray.700", _dark: "gray.300" }}>
            No messages found.
          </Heading>
        </Center>
      )}
    </>
  );
}

export function MobileToggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <HStack>
                <Drawer.Header>
                  <Drawer.Title color="pink.500">GhostTalk</Drawer.Title>
                  <CiChat1 size={24} color="pink" />
                </Drawer.Header>
              </HStack>
              <Drawer.Body>
                <Stack spaceY={4}>
                  <ColorModeSwitch />
                  <SignOutButton />
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Button
        colorPalette="pink"
        size="sm"
        display={{ base: "flex", lg: "none" }}
        onClick={() => setOpen(true)}
      >
        <BsList />
      </Button>
    </>
  );
}
