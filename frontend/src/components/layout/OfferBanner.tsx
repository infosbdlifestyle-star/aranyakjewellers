"use client";

const offers = [
  "শুভ রথ যাত্রা।",
  "অফার চলবে ৬ জুলাই থেকে ১৮জুলাই ২০২৬পর্যন্ত",
  "প্রতি কেনাকাটায় থাকছে নিশ্চিত উপহার",
  "প্রতি গ্রাম সোনার গয়না কেনাকাটায় থাকছে ৬২৫ টাকা ছাড়",
  "হীরের গয়নার মজুরিতে থাকছে 100% ছাড়",
  "যেকোনো দোকানের হলমার্ক যুক্ত পুরোনো গয়নার পরিবর্তে 100 শতাংশ মূল্য"
];

const OfferBanner = () => {
  return (
    <div className="bg-secondary text-primary py-2 overflow-hidden flex items-center relative z-50">
      <div className="w-full flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              {offers.map((offer, index) => (
                <div key={index} className="flex items-center mx-6">
                  <span className="text-xs md:text-sm font-semibold tracking-wide">{offer}</span>
                  <span className="mx-6 text-primary/30">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
