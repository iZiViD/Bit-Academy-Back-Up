type WebcamLayoutProps = {
  canvas: React.ReactNode;
  cameraControls: React.ReactNode;
  filterControls: React.ReactNode;
  frameControls: React.ReactNode;
};

const WebcamLayout = ({ 
  canvas, 
  cameraControls, 
  filterControls, 
  frameControls 
}: WebcamLayoutProps) => (
  <div className="flex flex-col items-center gap-4">
    {canvas}
    {cameraControls}
    {filterControls}
    {frameControls}
  </div>
); 

export default WebcamLayout;