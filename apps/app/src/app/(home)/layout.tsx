import { Box, Container } from "@radix-ui/themes";
import { Header } from "./_components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container
      size="2"
      style={{
        background: "var(--black-a10)",
      }}
      minHeight="100vh"
      pt="3"
    >
      <Header />

      <Box
        className="bg-white"
        p="4"
        my="4"
        style={{
          borderRadius: "var(--radius-4)",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
