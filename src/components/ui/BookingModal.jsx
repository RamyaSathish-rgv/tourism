import { useState } from "react";

export default function BookingModal({ item, type = "hotel", onClose, onConfirm, placePrice = 0 }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: "",
    phone: "",
    email: "",
    specialRequest: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.round((new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000))
    : 1;

  const stayTotal = item.isPlace ? (item.price || 0) : (item.price || 2000) * nights;
  const total = item.isPlace ? (item.price || 0) : stayTotal + (placePrice || 0);

  const handleConfirm = () => {
    setConfirmed(true);
    if (onConfirm) onConfirm({ ...formData, item, total, nights });
  };

  if (confirmed) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm mb-1">
            {item.name} · {nights} night{nights > 1 ? "s" : ""}
          </p>
          <p className="text-emerald-600 font-bold text-xl mb-6">₹{total.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mb-6">
            Confirmation will be sent to <span className="font-medium">{formData.email}</span>
          </p>
          <button onClick={onClose}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors">
            Done
          </button>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
        )}
        <div>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-0.5">
            {type === "hotel" ? "Hotel Booking" : "Destination Booking"}
          </p>
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-400">{item.placeName || item.location}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-emerald-500" : "bg-gray-200"}`}/>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Select Dates & Guests</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Check-in</label>
              <input type="date" value={formData.checkIn} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Check-out</label>
              <input type="date" value={formData.checkOut} min={formData.checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Guests</label>
            <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>

          {/* Price preview */}
          <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
            {item.isPlace ? (
              <>
                {item.price > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry + guide</span>
                    <span className="font-bold text-gray-700">₹{item.price.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry</span>
                    <span className="font-bold text-emerald-600">FREE 🎉</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stay: ₹{(item.price||2000).toLocaleString()} × {nights} night{nights>1?"s":""}</span>
                  <span className="font-bold text-gray-700">₹{stayTotal.toLocaleString()}</span>
                </div>
                {placePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry fee</span>
                    <span className="font-bold text-gray-700">₹{placePrice.toLocaleString()}</span>
                  </div>
                )}
                {placePrice === 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry</span>
                    <span className="font-bold text-emerald-600">FREE 🎉</span>
                  </div>
                )}
              </>
            )}
            <div className="border-t border-emerald-200 pt-2 flex justify-between">
              <span className="text-xs text-gray-400">Total (taxes included)</span>
              <span className="text-lg font-black text-emerald-700">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!formData.checkIn || !formData.checkOut}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Continue →
          </button>
          <button onClick={onClose}
            className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors">
            Not interested — maybe later
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your Details</p>
          <input type="text" placeholder="Full Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <input type="email" placeholder="Email Address" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <input type="tel" placeholder="Phone Number" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <textarea placeholder="Special requests (optional)" value={formData.specialRequest}
            onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 h-20 resize-none"/>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Check-in</span><span className="font-medium text-gray-700">{formData.checkIn}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Check-out</span><span className="font-medium text-gray-700">{formData.checkOut}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Guests</span><span className="font-medium text-gray-700">{formData.guests}</span>
            </div>
            <hr className="border-gray-200 my-2"/>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span><span className="text-emerald-600">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors text-sm">
              ← Back
            </button>
            <button onClick={handleConfirm} disabled={!formData.name || !formData.email || !formData.phone}
              className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
