import Link from "next/link";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
const SettingsPage = () => {
  return (
    <div>
      <div className="flex items-center">
        <Link href="/Dashboard">
          <FaArrowLeftLong className="ml-10 text-4xl hover:scale-75 transition" />
        </Link>
        <h1 className="text-center w-full font-bold text-4xl py-3">
          App settings
        </h1>
      </div>
    </div>
  );
};

export default SettingsPage;
