"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [amount, setAmount] = useState("1000"); // default сонголт
  const [qrUrl, setQrUrl] = useState("");

  // төлбөрийн сонголтын утгууд (энэ хэсэгт төлбөрийн холбоос, мэдээлэл байж болно)
  const paymentOptions: { label: string; value: string }[] = [
    { label: "₮500", value: "PAY500_MN" },
    { label: "₮1000", value: "PAY1000_MN" },
    { label: "₮2000", value: "PAY2000_MN" },
  ];

  useEffect(() => {
    QRCode.toDataURL(amount)
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [amount]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>QR Төлбөрийн Сонголт</h1>

      <div style={{ marginBottom: "1rem" }}>
        {paymentOptions.map((option) => (
          <label key={option.value} style={{ marginRight: "1rem" }}>
            <input
              type="radio"
              name="payment"
              value={option.value}
              checked={amount === option.value}
              onChange={(e) => setAmount(e.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        {qrUrl && (
          <>
            <img src={qrUrl} alt="QR Code" />
            <p>QR утга: <code>{amount}</code></p>
          </>
        )}
      </div>
    </main>
  );
}
