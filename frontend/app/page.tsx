import NewLinkForm from "@/components/new-link-form";
import Section from "@/components/section";

// Home: http://localhost:3000/ (landing page for now).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* The diagonal band: used only here, once, to open the page */}
      <Section band>
        <h1 className="text-headline">Mini Roads</h1>
        <p className="mt-4 max-w-[66ch] text-body text-muted">Shorten the way.</p>
        <div className="mt-10">
          <NewLinkForm />
        </div>
      </Section>
    </main>
  );
}
