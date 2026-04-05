import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Store, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderMode, OrderMode } from "@/context/OrderModeContext";
import { contactInfo } from "@/data/menuData";

interface DeliveryPickupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: OrderMode;
}

const DeliveryPickupSelector = ({ isOpen, onClose, initialMode }: DeliveryPickupSelectorProps) => {
  const { setMode, setDeliveryAddress } = useOrderMode();
  const [selectedMode, setSelectedMode] = useState<OrderMode>(initialMode);
  const [address, setAddress] = useState("");

  const handleConfirm = () => {
    setMode(selectedMode);
    if (selectedMode === "delivery") {
      setDeliveryAddress(address);
    } else {
      setDeliveryAddress("");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground">How would you like your order?</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setSelectedMode("delivery")}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                    selectedMode === "delivery"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <MapPin className="w-7 h-7" />
                  <span className="font-heading font-bold text-sm">Delivery</span>
                  <span className="text-xs opacity-70">To your door</span>
                </button>
                <button
                  onClick={() => setSelectedMode("pickup")}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                    selectedMode === "pickup"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Store className="w-7 h-7" />
                  <span className="font-heading font-bold text-sm">Pickup</span>
                  <span className="text-xs opacity-70">From store</span>
                </button>
              </div>

              {/* Delivery: address input */}
              {selectedMode === "delivery" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <label className="text-sm font-medium text-foreground">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    className="w-full bg-muted border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                  />
                </motion.div>
              )}

              {/* Pickup: store info */}
              {selectedMode === "pickup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-muted rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{contactInfo.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{contactInfo.address}</p>
                      <p className="text-xs text-primary font-medium mt-2">📞 {contactInfo.phone}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button
                onClick={handleConfirm}
                disabled={selectedMode === "delivery" && !address.trim()}
                className="w-full mt-5 bg-gradient-brand text-primary-foreground font-heading font-bold py-5 rounded-full"
              >
                {selectedMode === "delivery" ? "Deliver Here" : "Pickup from Store"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryPickupSelector;
