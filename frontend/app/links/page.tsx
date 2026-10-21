import Section from "@/components/section";
import LinksBoard from "./links-board";

// http://localhost:3000/links
export default function LinksRoute() {
  return (
    <main className="flex-1">
      <Section>
        <h1 className="text-headline">My links</h1>
        {/* LinksBoard renders the form too, so it can add the new card straight to its own state */}
        <LinksBoard />
      </Section>
    </main>
  );
}
