import { createContext, useContext, useState, ReactNode } from "react";

export type OrderMode = "delivery" | "pickup";

interface OrderModeContextType {
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
}

const OrderModeContext = createContext<OrderModeContextType | undefined>(undefined);

export const OrderModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<OrderMode>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  return (
    <OrderModeContext.Provider value={{ mode, setMode, deliveryAddress, setDeliveryAddress }}>
      {children}
    </OrderModeContext.Provider>
  );
};

export const useOrderMode = () => {
  const ctx = useContext(OrderModeContext);
  if (!ctx) throw new Error("useOrderMode must be used within OrderModeProvider");
  return ctx;
};
