
import React from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Profile | Axio Market",
  description: "Manage your profile, view account settings, and update personal information on Axio Market.",
  icons: { icon: "/img/logo.png" },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-cyan-50 dark:bg-black/70 text-black dark:text-white transition-colors duration-300 pt-6 pb-24">
      {/* pt-6: padding-top for spacing below navbar
          pb-24: padding-bottom to avoid bottom bar overlap */}
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This is where users can manage their profile, update personal information, and view account settings.
      </p>

      {/* Add profile cards, settings, or other info here */}

      <Footer />
    </div>
  );
}