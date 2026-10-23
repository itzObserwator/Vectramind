import { clientLogos } from "@/content/site";

const stripLogos = ["SAP", "HSBC", "Citibank", "Standard Chartered"].map(
  (name) => clientLogos.find((client) => client.name === name)!,
);

export function ClientStrip() {
  return (
    <section
      className="post-hero-client-strip"
      aria-label="Trusted by organizations worldwide"
    >
      <p>In good company.</p>
      <ul
        className="post-hero-static-logos"
        aria-label="Selected Vectramind clients"
      >
        {stripLogos.map((client) => (
          <li key={client.name}>
            <img
              src={`/images/${client.image}`}
              alt={client.name}
              width="150"
              height="52"
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
