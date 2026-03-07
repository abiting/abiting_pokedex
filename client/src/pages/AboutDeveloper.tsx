import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function AboutDeveloper() {
  useEffect(() => {
    // Update page title
    document.title = "About Developer | Abiting's Pokédex";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Abiting, a Content Creator and Marketing Professional from Taiwan, actively engaged in the Pokémon communities across Taiwan, China, and Hong Kong."
      );
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "Abiting, Pokémon, Pokédex for Pokémon Champions"
    );
    
    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", "About Developer | Abiting's Pokédex");
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute(
      "content",
      "Abiting, a Content Creator and Marketing Professional from Taiwan, actively engaged in the Pokémon communities across Taiwan, China, and Hong Kong."
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Pokédex</span>
          </a>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Developer
          </h1>

          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Abiting, a Content Creator and Marketing Professional from Taiwan, actively engaged in the Pokémon communities across Taiwan, China, and Hong Kong.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Personal Brand
              </h2>
              <p className="text-gray-700 mb-4">
                Learn more about my work and projects:
              </p>
              <a
                href="https://abiting.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Visit abiting.cc
                <span className="text-lg">→</span>
              </a>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                This Project
              </h2>
              <p className="text-gray-700">
                List of Pokémon is a comprehensive Pokédex database built for Pokémon Champions, featuring complete stats, type information, and abilities for all 1,025 Pokémon species across generations 1-9.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
