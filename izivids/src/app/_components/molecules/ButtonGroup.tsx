import {
    HangupButton, MicrophoneButton, SettingsButton, ScreenshotButton,
    CameraButton, EmojiButton, PointButton, VolumeButton
} from "../atoms/_index";

export default function ButtonGroup() {
    return (
        <>
            <VolumeButton />
            <SettingsButton />
            <CameraButton />
            <MicrophoneButton />
            <HangupButton />
            <ScreenshotButton />
            <PointButton />
            <EmojiButton />
        </>
    )
}
