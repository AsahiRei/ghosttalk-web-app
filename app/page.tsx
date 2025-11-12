"use client";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Stack,
  Box,
  Input,
  InputGroup,
  Button,
  Field,
  Link,
  Switch,
  HStack,
} from "@chakra-ui/react";
import { CiMail, CiLock, CiChat1 } from "react-icons/ci";
import { useColorMode, ColorModeIcon } from "@/components/ui/color-mode";
import { toaster, Toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { Auth } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const authForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (register) {
      try {
        await Auth.signUpWithEmail(email, password);
        toaster.create({
          title: "Sign up success",
          description: "You have successfully signed up.",
        });
        setRegister(false);
      } catch (error) {
        toaster.create({
          title: "Sign up error",
          description: error,
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await Auth.signInWithEmail(email, password);
        toaster.create({
          title: "Sign in success",
          description: "You have successfully signed in.",
        });
        router.replace("/users");
      } catch (error) {
        toaster.create({
          title: "Sign in error",
          description: error,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <Toaster/>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
        height="100vh"
      >
        <GridItem display="flex" flexDirection="column">
          <Box
            p={5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack>
              <Heading color="pink.500">GhostTalk</Heading>
              <CiChat1 size={24} color="pink" />
            </HStack>
            <Switch.Root
              colorPalette="pink"
              checked={colorMode === "dark"}
              onCheckedChange={() => toggleColorMode()}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>
                <ColorModeIcon />
              </Switch.Label>
            </Switch.Root>
          </Box>
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box width={{ base: "90%", md: "80%", lg: "70%" }}>
              <form onSubmit={authForm}>
                <Heading
                  color={{ base: "gray.700", _dark: "white" }}
                  size={{ base: "xl", md: "2xl", lg: "3xl" }}
                >
                  {register ? "Create new account" : "Welcome back!"}
                </Heading>
                <Text color={{ base: "gray.600", _dark: "gray.300" }}>
                  {register
                    ? "Create an account to get started."
                    : "Log in to continue your anonymous conversation."}
                </Text>
                <Stack mt={5}>
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <InputGroup startElement={<CiMail size={20} />}>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        focusRingColor="pink.400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <InputGroup startElement={<CiLock size={20} />}>
                      <PasswordInput
                        placeholder="Enter your password"
                        focusRingColor="pink.400"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Field.Root>
                </Stack>
                {!register && (
                  <Link colorPalette="pink" mt={5}>
                    Forgot password?
                  </Link>
                )}
                <Button
                  mt={5}
                  type="submit"
                  w="full"
                  colorPalette="pink"
                  loading={loading}
                  loadingText={register ? "Signing up..." : "Signing in..."}
                >
                  {register ? "Sign up" : "Sign in"}
                </Button>
                <Text
                  mt={5}
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  textAlign="center"
                >
                  {register
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <Link
                    colorPalette="pink"
                    onClick={() => setRegister(!register)}
                  >
                    {register ? "Sign in" : "Sign up"}
                  </Link>
                </Text>
              </form>
            </Box>
          </Box>
          <Box p={5} textAlign="center">
            <Text color={{ base: "gray.600", _dark: "gray.300" }}>
              &copy; {new Date().getFullYear()} ArnDev. All rights reserved.
            </Text>
          </Box>
        </GridItem>
        <GridItem
          colSpan={{ base: 0, lg: 2 }}
          display={{ base: "none", lg: "block" }}
          bg="url('/assets/images/background.png')"
          bgSize="cover"
          bgPos="center"
        />
      </Grid>
    </>
  );
}
