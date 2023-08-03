"use client";

import Modal from "@/app/components/modals/Modal";
import Image from "next/image";

interface ImageModal {
  open?: boolean;
  onClose: () => void;
  src?: string | null;
}

export const ImageModal: React.FC<ImageModal> = (props) => {
  const { onClose, open, src } = props || {};
  if (!src) {
    return null;
  }
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-80 h-80">
        <Image className="object-cover" fill alt="Image" src={src} />
      </div>
    </Modal>
  );
};
