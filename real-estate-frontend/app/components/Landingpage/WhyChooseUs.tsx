/**
 * Why Choose Us Section
 * Explains the benefits of using this platform
 */
const WhyChooseUs = () => {
  const reasons = [
    {
      title: "No Middlemen",
      description: "Connect directly with landlords. Save money and avoid agents’ fees.",
    },
    {
      title: "Safe & Transparent",
      description: "Verified landlords reduce fake listings and fraud.",
    },
    {
      title: "Simple & Fast",
      description: "Easily search, compare, and rent properties from one platform.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 shadow rounded">
              <h3 className="text-xl font-semibold">{reason.title}</h3>
              <p className="mt-2 text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
