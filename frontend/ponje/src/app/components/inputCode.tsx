'use client';

import { Toast } from "@chakra-ui/react";
import { useState } from "react";

interface InputCodeProps {
    onSubmit: (code: string) => void;
    isCodeValid: boolean;
}

import { useRef } from "react";

const InputCode = ({ onSubmit, isCodeValid, }: InputCodeProps) => {
    const [code, setCode] = useState<string>("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        const index = parseInt(name);

        if (value.length > 1) {
            return;
        }

        const newCode = code.split("");
        newCode[index] = value;
        setCode(newCode.join(""));

        if (/^\d$/.test(value)) {
            const nextIndex = index + 1;
            if (nextIndex < inputRefs.current.length) {
                inputRefs.current[nextIndex]?.focus();
            } else if (nextIndex === inputRefs.current.length) {
                onSubmit(newCode.join(""));
            }
        } else if (value === "" && index > 0) {
            const prevIndex = index - 1;
            inputRefs.current[prevIndex]?.focus();
        } else {
            inputRefs.current[index]?.focus();
        }
    };

    const handleArrowKey = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < 5) {
            event.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
        else if (event.key === "Backspace" && index > 0) {
            const newCode = code.split("");
            newCode[index - 1] = "";
            setCode(newCode.join(""));
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData("text/plain");
        const newCode = pastedText.replace(/[^\d]/g, "").slice(0, 6);
        setCode(newCode.padEnd(6, " "));
        inputRefs.current[0]?.focus();
    };

    const handleSubmit = (event: React.BaseSyntheticEvent) => {
        event.preventDefault();
        setSubmissionAttempted(true);

        const trimmedCode = code.replace(/\s/g, "");
        console.log("code validation", isCodeValid);
        if (trimmedCode.length !== 6 || !/^\d+$/.test(trimmedCode)) {
            console.log("error");
            Toast({
                title: 'Should be 6 digits',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
            });
        } else if (isCodeValid) {

            onSubmit(trimmedCode);
        }
    };

    return (
        <div>
            <div className="flex">
                {Array.from({ length: 6 }, (_, index) => (
                    <input
                        key={index}
                        type="text"
                        name={index.toString()}
                        maxLength={1}
                        value={code[index] || ""}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        onKeyDown={(event) => handleArrowKey(event, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        style={{
                            marginRight: "0.5rem",
                            width: "3.5rem",
                            height: "5.5rem",
                            textAlign: "center",
                            background: "#1B1A2D",
                            border: "1px solid #3B3A4D",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                        }}
                    />
                ))}
            </div>
            <button
                className="mt-10 w bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                type="button" 
                disabled={code.trim().length === 0 || code.trim().length < 6 || !isCodeValid}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleSubmit(event)}            >
                Submit
            </button>
            {submissionAttempted && code.trim().length === 0 && (
                <p className="text-red-500 text-xs mt-2">Please enter a 6-digit code before submitting.</p>
            )}
        </div>
    );
};

export default InputCode;
