"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

import { useModal } from "@/context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ModalProps = {
  title?: string;
  icon?: IconDefinition;
  bgColor?: string;
  textColor?: string;
  children: React.ReactNode;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  size?: string;
  closeBackdrop?: boolean;
  onConfirm?: () => void;
};

const ModalComponent: React.FC<ModalProps> = ({
  title = "Modal",
  icon,
  bgColor = "bg-gray-800",
  textColor = "text-white",
  children,
  showFooter = false,
  confirmText = "OK",
  cancelText = "Cancel",
  size = "md",
  onConfirm,
  closeBackdrop = true,
}) => {
  const { open, closeModal } = useModal();
  return (
    <Modal
      dismissible={closeBackdrop}
      show={open}
      onClose={() => {
        closeModal();
        sessionStorage.removeItem("oauth");
      }}
      size={size}
    >
      <ModalHeader className={`${bgColor} ${textColor}`}>
        <div className="flex items-center gap-2">
          {icon && <FontAwesomeIcon icon={icon} className={`text-white`} />}
          <span className="text-white">{title}</span>
        </div>
      </ModalHeader>

      <ModalBody className="bg-white">{children}</ModalBody>

      {showFooter && (
        <ModalFooter className="bg-white">
          <Button onClick={onConfirm || closeModal}>{confirmText}</Button>
          <Button color="gray" onClick={closeModal}>
            {cancelText}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default ModalComponent;
