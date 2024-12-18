import React, { useState } from 'react';

const VolumeController = () => {
    const [defaultValue, setDefaultValue] = useState(25);

    return (
        // Volume Controller: Slider+Icon
        <input type="range" min={0} max="100" className="range range-xs rotate-270" value={defaultValue}
        onChange={e => setDefaultValue(Number(e.target.value))} />
    )
}

export default VolumeController;