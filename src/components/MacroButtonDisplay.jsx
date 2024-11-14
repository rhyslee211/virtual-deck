import React from 'react';

function MacroButtonDisplay({ color, icon }) {
    const buttonRef = React.useRef(null);

    const hoverColors = {
        "#22d3ee": "#1bb7d1",
        "#22ee9d": "#1bbb88",
        "#eede22": "#c5c11c",
        "#ee5e22": "#c54d1b",
        "#d322ee": "#b01bc1",
    };

    const hoverColor = hoverColors[color];

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
            {icon}
        </button>
    );
}

export default MacroButtonDisplay;