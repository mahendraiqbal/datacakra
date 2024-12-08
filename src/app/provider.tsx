// app/providers.tsx
"use client"; // Pastikan file ini berjalan di sisi client

import { Provider } from "react-redux";
import { store } from "../redux/store"; // Pastikan store Redux Anda sudah dibuat

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
