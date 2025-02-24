import React from 'react';
import { colord } from "colord";
import { lighten, darken } from "polished";
import { IconPickerItem } from 'react-icons-picker'

function MacroButtonDisplay({ color, text , icon }) {
    const buttonRef = React.useRef(null);

    const getHoverColor = (color) => {
        return colord(color).isDark() ? lighten(0.2, color) : darken(0.2, color);
    };

    const hoverColor = getHoverColor(color);

    return (
        <button ref={buttonRef}
            className={`w-12 h-12 rounded-md text-sm text-slate-900 flex items-center justify-center font-semibold`}
            style={{
                backgroundColor: color,
                transition: "background-color 0.3s",
            }}
            onMouseEnter={() => buttonRef.current.style.backgroundColor = hoverColor}
            onMouseLeave={() => buttonRef.current.style.backgroundColor = color}
        >
            {icon === "" && <div className={`overflow-hidden text-ellipsis flex justify-center items-center line-clamp-2 h-full w-full ${colord(color).isDark() ? "text-white" : "text-black"}`}>
                {text}
            </div>}
            {icon !== "" && <div className={`overflow-hidden text-ellipsis flex justify-center items-center line-clamp-2 h-full w-full ${colord(color).isDark() ? "text-white" : "text-black"}`}>
                {icon !== "" && <IconPickerItem value={icon} size={20} />}
            </div>}
        </button>
    );
}

export default MacroButtonDisplay;