import React from "react";
import Image from "next/image";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuUrl: string | null;
}

const MenuModal = ({ isOpen, onClose, menuUrl }: MenuModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg ">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mess Menu
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {menuUrl ? (
            <div
              className="relative w-full rounded-xl overflow-hidden"
              style={{ paddingTop: "75%" }}
            >
              <Image
                src={menuUrl}
                alt="Mess Menu"
                fill
                className="object-contain absolute inset-0"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">
                No menu available at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
