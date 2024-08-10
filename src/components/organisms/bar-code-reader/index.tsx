import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

type Props = {
  paused?: boolean;
  onScan: (result: IDetectedBarcode[]) => void;
};

const BarcodeScanner = ({ paused, onScan }: Props) => {
  return (
    <div className="!t-0 left-0 !fixed !max-h-[100dvh] !min-h-[100dvh] min-w-[100dvw] max-w-[100dvw] z-[99999999] bg-white overscroll-auto">
      <Scanner
        paused={paused}
        onScan={onScan}
        classNames={{ container: '!min-h-[70dvh] bg-red-500 !border-none !t-0', video: '!h-[100dvh]' }}
        styles={{
          finderBorder: 0,
        }}
      />
    </div>
  );
};

export default BarcodeScanner;
