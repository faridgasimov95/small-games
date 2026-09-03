import { useEffect, useRef, type ReactElement } from "react";

type ModalProps = {
  children: ReactElement;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto rounded-2xl border bg-surface border-accent text-text shadow-sm p-8 w-lg gap-6 max-h-[70vh] backdrop:bg-black/40"
    >
      {children}
    </dialog>
  );
}
