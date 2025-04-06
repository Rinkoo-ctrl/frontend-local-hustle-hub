import { useEffect, useState } from "react";

const TypingText = ({ text = "", speed = 150, pause = 1500 }) => {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let timeout;

        if (!deleting && index < text.length) {
            timeout = setTimeout(() => {
                setDisplayText(text.slice(0, index + 1));
                setIndex(index + 1);
            }, speed);
        } else if (!deleting && index === text.length) {
            timeout = setTimeout(() => {
                setDeleting(true);
            }, pause);
        } else if (deleting && index > 0) {
            timeout = setTimeout(() => {
                setDisplayText(text.slice(0, index - 1));
                setIndex(index - 1);
            }, speed);
        } else if (deleting && index === 0) {
            timeout = setTimeout(() => {
                setDeleting(false);
            }, pause);
        }

        return () => clearTimeout(timeout);
    }, [text, index, deleting, speed, pause]); // ✅ All deps included

    return (
        <span className="text-blue-700">{displayText}<span className="animate-pulse">|</span></span>
    );
};

export default TypingText;
