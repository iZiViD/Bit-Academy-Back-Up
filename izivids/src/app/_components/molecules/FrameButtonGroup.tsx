import { Button } from "../atoms/_index";

type FrameButtonGroupProps = {
  onFrameChange: (framePath: string | null) => void;
  disabled: boolean;
};

const FrameButtonGroup = ({ onFrameChange, disabled }: FrameButtonGroupProps) => (
  <div className="flex gap-2">
    {[
      { id: 'none', label: 'No Frame', path: null },
      { id: 'gold', label: 'Golden Frame', path: '/assets/frames/golden-frame.svg' },
      { id: 'birthday', label: 'Birthday Frame', path: '/assets/frames/birthday-frame.png' }
    ].map((frameOption) => (
      <Button
        key={frameOption.id}
        onClick={() => onFrameChange(frameOption.path)}
        disabled={disabled}
        variant={frameOption.id === 'none' ? 'secondary' : 'warning'}
      >
        {frameOption.label}
      </Button>
    ))}
  </div>
);

export default FrameButtonGroup;