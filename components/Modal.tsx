"use client";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl animate-bounce-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400" />
        {/* Decorative corner hearts */}
        <div className="absolute top-3 left-4 text-pink-200 text-xs opacity-60">
          &#10084;
        </div>
        <div className="absolute top-3 right-4 text-pink-200 text-xs opacity-60">
          &#10084;
        </div>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}
