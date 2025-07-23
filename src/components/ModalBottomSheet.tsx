// BottomSheet.tsx
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ModalBottomSheet({ isOpen, onClose, children }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="w-full h-100 max-w-md bg-white rounded-t-2xl p-4 transition-transform duration-300 transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-12 bg-gray-300 rounded-full mx-auto mb-4" />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>

        {children}
      </div>
      <div className="absolute inset-0" onClick={onClose} />
    </div>
  );
}
