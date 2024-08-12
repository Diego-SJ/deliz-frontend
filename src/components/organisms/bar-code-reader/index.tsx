import useMediaQuery from '@/hooks/useMediaQueries';
import { CloseOutlined } from '@ant-design/icons';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Button, Typography } from 'antd';

type Props = {
  paused?: boolean;
  onScan: (result: IDetectedBarcode[]) => void;
  onCancel: () => void;
  allowMultiple?: boolean;
};

const BarcodeScanner = ({ paused, onScan, onCancel, allowMultiple = false }: Props) => {
  const { isTablet } = useMediaQuery();
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0 }}
      className="flex justify-center items-center flex-col w-full !max-h-[100dvh] !min-h-[100dvh] z-[3] bg-transparent backdrop-blur-lg"
    >
      <div className="max-w-[90%] md:max-w-[550px]">
        <div className="flex justify-between items-center pl-4 pr-1 top-0 w-full py-2 bg-white">
          <Typography.Title level={isTablet ? 5 : 4} className="!m-0">
            Escanear código de barras
          </Typography.Title>

          <Button type="text" onClick={onCancel} icon={<CloseOutlined />} size="large">
            {isTablet ? '' : 'Cancelar'}
          </Button>
        </div>
        <Scanner
          formats={[
            'aztec',
            'upc_a',
            'upc_e',
            'ean_8',
            'ean_13',
            'code_128',
            'code_39',
            'code_93',
            'itf',
            'codabar',
            'data_matrix',
            'pdf417',
            'qr_code',
            'databar',
            'databar_expanded',
            'dx_film_edge',
            'linear_codes',
            'micro_qr_code',
            'pdf417',
            'rm_qr_code',
          ]}
          scanDelay={500}
          allowMultiple={allowMultiple}
          paused={paused}
          onScan={onScan}
          classNames={{ container: 'min-h-[70dvh] max-h-[70dvh]' }}
        />
      </div>
    </div>
  );
};

export default BarcodeScanner;
