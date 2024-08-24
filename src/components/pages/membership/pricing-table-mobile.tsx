import { InfoCircleOutlined } from '@ant-design/icons';
import { Select, Tooltip } from 'antd';
import { TABLE_BODY, TABLE_HEADER } from './data-source';
import { createElement, useState } from 'react';

const PricingTableMobile = () => {
  const [selectedPlan, setSelectedPlan] = useState(3);
  return (
    <>
      <table className="min-w-full border-collapse table md:hidden">
        <thead className="bg-white !sticky top-[60px] z-10">
          <tr>
            <th className="w-2/3 px-0 text-left text-sm font-normal" scope="col">
              <span className="flex flex-col px-6 pr-2 pt-2 gap-1.5 max-w-[80%]">
                <span className="flex flex-col xl:flex-row xl:items-end gap-1">
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl leading-5 uppercase  font-medium flex items-center">
                    {TABLE_HEADER[selectedPlan].title}
                  </h3>
                  <p className="text-gray-400 -my-1 xl:m-0">
                    <span className="text-lg font-light mr-1 tracking-tighter">
                      ${TABLE_HEADER[selectedPlan]?.price?.monthly}
                    </span>
                    <span className="text-xs leading-4 mt-1">/ mes</span>
                  </p>
                </span>
                <span className="flex flex-col justify-between h-full pb-2">
                  <a
                    data-size="tiny"
                    type="button"
                    className="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-primary hover:bg-primary/80 text-white hover:text-white border-primary/75 hover:border-primary w-full flex items-center justify-center text-xs px-2.5 py-1 h-[26px]"
                    href="https://supabase.com/dashboard/new?plan=free"
                  >
                    <span className="truncate">Empezar</span>
                  </a>
                </span>
              </span>
            </th>
            <th className="w-1/3 pr-6 text-end text-sm font-normal" scope="col">
              <Select
                options={[
                  { label: 'Básico', value: 1 },
                  { label: 'Esencial', value: 2 },
                  { label: 'Avanzado', value: 3 },
                  { label: 'Premium', value: 4 },
                ]}
                className="w-32 !ml-auto text-start"
                value={selectedPlan}
                onChange={value => setSelectedPlan(value)}
              />
            </th>
          </tr>
        </thead>

        <tbody className="">
          {TABLE_BODY.map(row => {
            if (row?.rowType === 'header') {
              return (
                <tr
                  key={row.id}
                  className="border-b !sticky top-[152px] xl:top-[135px]  z-[100] bg-gray-50"
                  style={{ borderTop: 'none' }}
                  id={row.id}
                >
                  <td className="pl-6 py-2 text-left text-sm font-medium" scope="colgroup">
                    <div className="flex items-center gap-4">
                      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md   bg-brand text-brand-100 ">
                        {createElement((row.cols[0] as any)?.icon, { className: 'text-primary' })}
                      </div>
                      <h4 className="m-0 text-base font-medium">{row.cols[0]?.title}</h4>
                    </div>
                  </td>
                  <td className="bg-background px-6 py-5 basic"></td>
                </tr>
              );
            }

            return (
              <tr key={row.id} className="divide-border border-b border-gray-100" style={{ borderTop: 'none' }}>
                <th className="flex items-center px-6 py-5 last:pb-24 text-left text-xs font-normal " scope="row">
                  <span className="text-gray-400">
                    {row.cols[0].title}{' '}
                    {!!(row.cols[0] as any)?.tooltip && (
                      <Tooltip title={(row.cols[0] as any)?.tooltip} placement="top">
                        <InfoCircleOutlined className="text-gray-800 cursor-help" />
                      </Tooltip>
                    )}
                  </span>
                </th>
                <td className="pl-6 pr-2 tier-pro ">
                  <div className="text-xs flex items-center justify-end pr-5 gap-2">
                    <span className="flex items-center text-end">{row.cols[selectedPlan]?.title}</span>
                    {!!(row.cols[selectedPlan] as any)?.tooltip && (
                      <Tooltip title={(row.cols[selectedPlan] as any)?.tooltip} placement="top">
                        <InfoCircleOutlined className="text-gray-800 cursor-help" />
                      </Tooltip>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PricingTableMobile;
