import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Brands() {
  const brands = [
    {
      name: "A. Lange & Söhne",
      founded: "1845",
      origin: "Glashütte, Germany",
      story: "Founded by Ferdinand Adolph Lange in the Saxon town of Glashütte, A. Lange & Söhne represents the pinnacle of German watchmaking excellence. After being nationalized during the Cold War era, the brand was remarkably resurrected in 1990 by Walter Lange, great-grandson of the founder. The relaunch in 1994 with four groundbreaking models marked one of the most celebrated comebacks in horological history. Each timepiece showcases meticulous hand-finishing, the iconic three-quarter plate, and complications of extraordinary complexity.",
      auction: "A. Lange & Söhne watches command extraordinary prices at auction houses like Phillips and Sotheby's. The brand's limited production and uncompromising commitment to traditional Saxon watchmaking techniques have made early post-reunification pieces highly sought-after. Notable sales include unique steel references and commemorative editions that have achieved record-breaking results, cementing the brand's status among collectors as the German equivalent to Swiss haute horlogerie.",
    },
    {
      name: "Patek Philippe",
      founded: "1839",
      origin: "Geneva, Switzerland",
      story: "Patek Philippe stands as the undisputed king of Swiss watchmaking, founded in Geneva by Antoni Patek and Adrien Philippe. For over 180 years, the manufacture has remained family-owned, preserving traditions while pioneering innovations. The brand created the world's first wristwatch in 1868 and continues to hold over 100 patents. Patek Philippe's motto 'You never actually own a Patek Philippe. You merely look after it for the next generation' encapsulates the brand's philosophy of creating timeless heirlooms.",
      auction: "Patek Philippe dominates the auction world with unparalleled results. The Henry Graves Jr. Supercomplication sold for $24 million in 2014, while a steel Reference 1518 perpetual calendar chronograph achieved $17.6 million in 2025. The brand consistently holds multiple positions among the world's most expensive watches ever sold at auction. Rare complications, limited editions, and vintage references from the 1940s-1970s are particularly coveted by collectors worldwide.",
    },
    {
      name: "Vacheron Constantin",
      founded: "1755",
      origin: "Geneva, Switzerland",
      story: "As the world's oldest continuously operating watch manufacturer, Vacheron Constantin has been crafting exceptional timepieces since 1755. Founded by Jean-Marc Vacheron in Geneva, the maison has never ceased production through wars, revolutions, and economic crises. The brand's Maltese cross emblem symbolizes precision and excellence. Vacheron Constantin is renowned for its artistic métiers d'art collections and ultra-complicated grand complications, including the Reference 57260—the most complicated mechanical watch ever created with 57 complications.",
      auction: "Vacheron Constantin's heritage pieces achieve remarkable results at prestigious auctions. Vintage references from the 1940s-1960s, particularly complicated models and rare dial variations, are highly prized. The brand's limited edition collaborations and unique pieces commissioned for royalty and collectors regularly exceed estimates at Phillips, Christie's, and Sotheby's. The combination of unbroken heritage and exceptional craftsmanship makes Vacheron Constantin a cornerstone of serious watch collections.",
    },
    {
      name: "Rolex",
      founded: "1905",
      origin: "Geneva, Switzerland",
      story: "Founded by Hans Wilsdorf in London and later relocated to Geneva, Rolex revolutionized wristwatch design and functionality. The brand pioneered the first waterproof wristwatch (Oyster, 1926) and the first self-winding mechanism with a perpetual rotor (1931). Rolex has accompanied explorers to Mount Everest's summit, the deepest ocean trenches, and countless achievements in between. The brand's commitment to precision, durability, and timeless design has made it the most recognized luxury watch brand globally.",
      auction: "Rolex dominates vintage watch auctions with legendary references commanding astronomical prices. Paul Newman's personal Daytona sold for $17.8 million in 2017, setting records. Vintage sports models—particularly early Submariners, GMT-Masters, and Daytonas—are among the most liquid and sought-after timepieces at auction. Rare dial variations, military-issued pieces, and celebrity-owned examples regularly achieve multiples of their estimates at major auction houses, making Rolex both a passion and an investment.",
    },
    {
      name: "Parmigiani Fleurier",
      founded: "1996",
      origin: "Fleurier, Switzerland",
      story: "Founded by master watchmaker and restorer Michel Parmigiani, Parmigiani Fleurier represents contemporary haute horlogerie at its finest. Before establishing his eponymous brand, Michel Parmigiani spent decades restoring the world's most important historical timepieces for museums and collectors, including pieces by Breguet and Patek Philippe. This deep understanding of classical watchmaking informs every Parmigiani creation. The brand is one of the few true manufactures, producing virtually every component in-house, from hairsprings to dials.",
      auction: "While younger than its peers, Parmigiani Fleurier has quickly established itself in the collector market. The brand's limited production numbers, exceptional finishing, and complex movements appeal to connoisseurs seeking alternatives to mainstream luxury brands. Unique pieces and limited editions featuring the brand's signature Kalpa case or complicated movements like the Toric Hemispheres achieve strong results at auction. As collectors increasingly appreciate independent watchmaking excellence, Parmigiani's auction presence continues to grow.",
    },
  ];

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      
      <div className="portfolio-container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white-2 mb-4">
              Elite Watchmaking Houses
            </h1>
            <p className="text-lg text-light-gray-70 max-w-3xl mx-auto">
              Discover the legendary manufacturers behind our curated collection. Each brand represents centuries of horological excellence, commanding record prices at the world's most prestigious auction houses.
            </p>
          </div>

          {/* Brand Cards */}
          <div className="space-y-12">
            {brands.map((brand, index) => (
              <Card key={index} className="bg-eerie-black-1 border-jet overflow-hidden">
                <CardHeader className="border-b border-jet">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-3xl text-white-2 mb-2">
                        {brand.name}
                      </CardTitle>
                      <CardDescription className="text-luxury-gold text-lg">
                        Founded {brand.founded} • {brand.origin}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Heritage Story */}
                    <div>
                      <h3 className="text-xl font-semibold text-white-2 mb-3 flex items-center gap-2">
                        <span className="text-luxury-gold">◆</span> Heritage & Legacy
                      </h3>
                      <p className="text-light-gray leading-relaxed">
                        {brand.story}
                      </p>
                    </div>

                    {/* Auction Significance */}
                    <div>
                      <h3 className="text-xl font-semibold text-white-2 mb-3 flex items-center gap-2">
                        <span className="text-luxury-gold">◆</span> Auction House Prestige
                      </h3>
                      <p className="text-light-gray leading-relaxed">
                        {brand.auction}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-eerie-black-1 border border-jet rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-white-2 mb-4">
                Experience Horological Excellence
              </h3>
              <p className="text-light-gray mb-6">
                Our collection features timepieces from these legendary manufacturers, offering you the opportunity to experience watches that have shaped horological history and continue to set records at the world's most prestigious auctions.
              </p>
              <div className="text-sm text-light-gray-70 italic">
                "These are not just watches—they are wearable works of art, mechanical marvels, and tangible pieces of history."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
