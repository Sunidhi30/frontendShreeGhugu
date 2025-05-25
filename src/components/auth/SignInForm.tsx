

"use client";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function SignInForm() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  const fireConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000,
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        ...defaults,
        particleCount: 50,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/vendor-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setModalMessage(
          `${data.message}\n We're waiting for you!\n Redirecting to your dashboard...`
        );
        
        setModalVisible(true);

        // Trigger confetti animation
        fireConfetti();

        localStorage.setItem("vendorId", data.vendor._id);
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          setModalVisible(false);
          router.push("/");
        }, 3000);
      } else {
        setModalMessage(data.message);
        setModalVisible(true);
      }
    } catch (err) {
      console.error("Vendor login error:", err);
      setModalMessage("Something went wrong.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Vendor Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your Email or Username and Password.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email or Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com or username"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? "Logging In..." : "Sign In"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Popup */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div
            className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-lg animate-popup"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4">
              <span className="text-6xl animate-bounce">🎉</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{modalMessage}</h2>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
