import React from 'react';
import { colord } from "colord";
import { lighten, darken } from "polished";

function MacroButtonDisplay({ color, icon }) {
    const buttonRef = React.useRef(null);

    const getHoverColor = (color) => {
        return colord(color).isDark() ? lighten(0.2, color) : darken(0.2, color);
    };

    const hoverColor = getHoverColor(color);

    return (
        <button ref={buttonRef}
            className={`w-12 h-12 rounded-md text-sm text-slate-900 flex items-center justify-center font-semibold ${colord(color).isDark() ? "text-white" : "text-black"}`}
            style={{
                backgroundColor: color,
                transition: "background-color 0.3s",
            }}
            onMouseEnter={() => buttonRef.current.style.backgroundColor = hoverColor}
            onMouseLeave={() => buttonRef.current.style.backgroundColor = color}
        >
            <div className="overflow-hidden text-ellipsis flex justify-center items-center line-clamp-2 h-full w-full">
                {icon}
            </div>
        </button>
    );
}

export default MacroButtonDisplay;