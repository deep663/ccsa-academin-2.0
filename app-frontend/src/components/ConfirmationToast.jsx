import { useState } from "react";
import PropType from "prop-types";

export default function ConfirmationToast({
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-black/80 w-full">
      <div className="absolute left-0 right-0 mx-auto max-w-xs p-4 text-gray-300 bg-[#192f59] rounded-lg shadow-sm">
        <div className="flex">
          {/* Text Content */}
          <div className="ms-3 text-sm font-normal">
            <span className="mb-1 text-sm font-semibold text-white">
              {title}
            </span>
            <div className="mb-2 text-sm">{message}</div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  setVisible(false);
                }}
                className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {confirmText}
              </button>
              <button
                onClick={() => {
                  if (onCancel) onCancel();
                  setVisible(false);
                }}
                className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                {cancelText}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-300 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100"
            onClick={() => {
              if (onClose) onClose();
              setVisible(false);
            }}
            aria-label="Close"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationToast.propTypes = {
  title: PropType.string,
  message: PropType.string,
  confirmText: PropType.string,
  cancelText: PropType.string,
  onConfirm: PropType.func,
  onCancel: PropType.func,
  onClose: PropType.func,
};
