import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Next.js 13 with Clerk",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <section>
        <div>{children}</div>
      </section>
    </ClerkProvider>
  );
}
