import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const configs = {
  place: {
    type: "Place", title: "Add a Destination", icon: "📍", color: "from-emerald-500 to-teal-600",
    fields: [
      { key: "title", label: "Place Name", placeholder: "e.g. Ooty Tea Gardens", type: "text" },
      { key: "location", label: "State / Region", placeholder: "e.g. Tamil Nadu", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Hill Station", "Beach", "Pilgrimage", "Heritage", "Wildlife", "Backwaters"] },
      { key: "price", label: "Avg. Trip Cost (₹ per person)", placeholder: "e.g. 3500", type: "number" },
      { key: "imageUrl", label: "Image URL", placeholder: "https://...", type: "url" },
      { key: "description", label: "Description", placeholder: "Describe the beauty of this place...", type: "textarea" },
      { key: "bestTime", label: "Best time to visit", placeholder: "e.g. Oct – Mar", type: "text" },
    ],
  },
  hotel: {
    type: "Hotel", title: "Add Accommodation", icon: "🏨", color: "from-blue-500 to-indigo-600",
    fields: [
      { key: "title", label: "Hotel / Stay Name", placeholder: "e.g. Savoy Heritage Hotel", type: "text" },
      { key: "location", label: "Place it belongs to", placeholder: "e.g. Ooty", type: "text" },
      { key: "category", label: "Style", type: "select", options: ["Budget", "Mid-range", "Luxury", "Heritage", "Resort", "Boutique", "Homestay"] },
      { key: "price", label: "Price per night (₹)", placeholder: "e.g. 4500", type: "number" },
      { key: "imageUrl", label: "Image URL", placeholder: "https://...", type: "url" },
      { key: "description", label: "Description", placeholder: "What makes your property special?", type: "textarea" },
      { key: "contact", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "text" },
    ],
  },
  restaurant: {
    type: "Restaurant", title: "Add a Restaurant", icon: "🍽️", color: "from-amber-500 to-orange-600",
    fields: [
      { key: "title", label: "Restaurant Name", placeholder: "e.g. Amma Mess", type: "text" },
      { key: "location", label: "Place it belongs to", placeholder: "e.g. Madurai", type: "text" },
      { key: "category", label: "Cuisine Type", type: "select", options: ["South Indian", "Tamil Nadu", "Kerala", "Seafood", "Continental", "French", "Kodava", "North Indian", "Multi-cuisine"] },
      { key: "price", label: "Price for 2 (₹)", placeholder: "e.g. 400", type: "number" },
      { key: "imageUrl", label: "Image URL", placeholder: "https://...", type: "url" },
      { key: "description", label: "Description", placeholder: "Specialty dishes, ambience, highlights...", type: "textarea" },
      { key: "contact", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "text" },
    ],
  },
  reel: {
    type: "Reel", title: "Add a Reel", icon: "🎬", color: "from-purple-500 to-pink-600",
    fields: [
      { key: "title", label: "Reel Title / Location Name", placeholder: "e.g. Shore Temple, Mahabalipuram", type: "text" },
      { key: "location", label: "Place Tag", placeholder: "e.g. Tamil Nadu", type: "text" },
      { key: "imageUrl", label: "Video URL (mp4 link)", placeholder: "/myvideo.mp4 or https://...", type: "url" },
      { key: "price", label: "Starting Price to Visit (₹)", placeholder: "e.g. 1500", type: "number" },
      { key: "description", label: "Caption / Description", placeholder: "Write a short caption for this reel...", type: "textarea" },
    ],
  },
};

export default function SellerAddForm() {
  const { listingType } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, role } = useAuth();
  const config = configs[listingType] || configs.place;

  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isLoggedIn || role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You need to be logged in as a seller.</p>
          <button onClick={() => navigate("/")} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem(`seller_listings_${user.email}`) || "[]");
    const newListing = {
      ...form,
      id: Date.now(),
      type: config.type,
      sellerEmail: user.email,
      sellerName: user.name,
      addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      approved: false,
    };
    localStorage.setItem(`seller_listings_${user.email}`, JSON.stringify([...existing, newListing]));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">{config.icon} Listing Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your {config.type.toLowerCase()} <span className="font-semibold text-gray-700">"{form.title}"</span> has been saved and is pending approval. It will appear on the platform once verified.
          </p>
          <div className="flex gap-3">
            <button onClick={() => { setForm({}); setSubmitted(false); }} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50">Add Another</button>
            <button onClick={() => navigate("/seller/listings")} className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600">View Listings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-br ${config.color} text-white py-10 px-4`}>
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Seller Portal</p>
          <h1 className="text-2xl font-extrabold">{config.icon} {config.title}</h1>
          <p className="text-white/70 text-sm mt-1">This will be reviewed and added to the WanderTamil platform.</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea placeholder={field.placeholder} required value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300 h-28 resize-none"/>
              ) : field.type === "select" ? (
                <select required value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                  <option value="">Select {field.label}</option>
                  {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={field.type} placeholder={field.placeholder} required value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300"/>
              )}
            </div>
          ))}

          {/* Image preview */}
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden h-40 bg-gray-100">
              <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}/>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/seller/listings")}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className={`flex-1 py-3 bg-gradient-to-r ${config.color} text-white font-extrabold rounded-xl text-sm hover:opacity-90 transition-all active:scale-95 shadow-md`}>
              Submit Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
