import { Button } from "../atoms/_index";

type CameraControlsProps = {
  isCameraOn: boolean;
  onCameraToggle: () => void;
  onMirrorToggle: () => void;
  isMirrored: boolean;
};

const CameraControls = ({
  isCameraOn,
  onCameraToggle,
  onMirrorToggle,
  isMirrored,
}: CameraControlsProps) => (
  <div className="flex gap-2">
    <Button
      onClick={onCameraToggle}
      variant={isCameraOn ? "danger" : "primary"}
    >
      {isCameraOn ? "Stop Camera" : "Open Camera"}
    </Button>

    <Button onClick={onMirrorToggle} disabled={!isCameraOn} variant="secondary">
      {isMirrored ? "Unmirror" : "Mirror"}
    </Button>
  </div>
);

export default CameraControls;
