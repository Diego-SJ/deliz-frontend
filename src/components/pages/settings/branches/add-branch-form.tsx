import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const AddBranchForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { branch_id } = useParams();

  const confirmDeleteBranch = () => {};

  const onSubmit = async () => {
    form.validateFields().then(values => {
      console.log(values);
    });
  };

  return (
    <>
      <div className={`flex flex-col gap-2 p-4 min-h-[calc(100%-82px)] max-h-[calc(100%-82px)] overflow-auto`}>
        <div className="flex gap-4 max-w-[700px] mx-auto w-full">
          <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={() => navigate(-1)} />
          <Typography.Title level={4}>{branch_id ? 'Actualizar sucursal' : 'Agregar nueva sucursal'}</Typography.Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-4 max-w-[700px] mx-auto w-full"
          validateMessages={{
            required: '${label} es obligatorio.',
          }}
        >
          <Card title="Sucursal" className="shadow-md rounded-xl">
            <Form.Item className="mb-0 w-full" name="name" label="Nombre" rules={[{ required: true }]}>
              <Input placeholder="Nombre de la sucursal" />
            </Form.Item>
          </Card>

          <Card title="Dirección" className="shadow-md rounded-xl">
            <Form.Item className="w-full" name="street" label="Dirección">
              <Input placeholder="Dirección de la sucursal" />
            </Form.Item>
            <div className="flex md:gap-8 flex-col md:flex-row">
              <Form.Item className="w-full" name="ext_num" label="No. Exterior">
                <Input placeholder="No. Exterior" className="w-full" />
              </Form.Item>
              <Form.Item className="w-full" name="int_num" label="No. Interior">
                <Input placeholder="No. Interior" className="w-full" />
              </Form.Item>
            </div>
            <div className="flex md:gap-8 flex-col md:flex-row">
              <Form.Item className="w-full" name="city" label="Ciudad">
                <Input placeholder="Ciudad de la sucursal" className="w-full" />
              </Form.Item>
              <Form.Item className="w-full" name="state" label="Estado">
                <Input placeholder="Estado de la sucursal" className="w-full" />
              </Form.Item>
            </div>
            <Form.Item className="mb-0 w-full" name="zip_code" label="Código postal">
              <Input placeholder="Código postal de la sucursal" />
            </Form.Item>
          </Card>

          <Card title="Contacto" className="shadow-md rounded-xl">
            <div className="flex md:gap-8 flex-col md:flex-row">
              <Form.Item className="mb-0 w-full" name="phone" label="Teléfono">
                <Input placeholder="Teléfono de la sucursal" className="w-full" />
              </Form.Item>
              <Form.Item className="mb-0 w-full" name="email" label="Correo electrónico">
                <Input placeholder="Correo electrónico de la sucursal" className="w-full" />
              </Form.Item>
            </div>
          </Card>
        </Form>

        {branch_id && (
          <Card title="Eliminar sucursal" className="my-2 shadow-md rounded-xl">
            <div className="flex gap-8 justify-between items-center">
              <Typography.Text type="danger">
                Una vez eliminada la sucursal, no se podrá recuperar la información.
              </Typography.Text>
              <Button
                ghost
                danger
                className="min-w-40"
                onClick={() => {
                  Modal.confirm({
                    title: 'Eliminar sucursal',
                    type: 'error',
                    okText: 'Eliminar',
                    onOk: confirmDeleteBranch,
                    cancelText: 'Cancelar',
                    content: '¿Estás seguro de que deseas eliminar esta sucursal?',
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  });
                }}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        )}
      </div>
      <Card
        className="rounded-none box-border"
        classNames={{ body: 'w-full flex items-center' }}
        styles={{ body: { padding: '0px', height: '80px' } }}
      >
        <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full">
          <Button className="w-full md:w-40" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="primary" className="w-full md:w-40" onClick={onSubmit}>
            Guardar
          </Button>
        </div>
      </Card>
    </>
  );
};

export default AddBranchForm;
