import { BarcodeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React from 'react';

const PricingTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-background sticky z-10">
          <tr>
            <th className="text-foreground w-1/3 px-6 pt-2 pb-2 text-left text-sm font-normal" scope="col">
              <span className="sr-only">Feature by</span>
              <span className="h-0.25 absolute bottom-0 left-0 w-full"></span>
            </th>
            <th className="text-foreground w-1/4 px-0 text-left text-sm font-normal" scope="col">
              <span className="flex flex-col px-6 pr-2 pt-2 gap-1.5">
                <span className="flex flex-col xl:flex-row xl:items-end gap-1">
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl leading-5 uppercase  font-normal flex items-center">Básico</h3>
                  <p className="text-foreground-lighter -my-1 xl:m-0">
                    <span className="text-foreground-lighter  text-xl mr-1 tracking-tighter">$149</span>
                    <span className="text-[13px] leading-4 mt-1">/ mes</span>
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
            <th className="text-foreground w-1/4 px-0 text-left text-sm font-normal" scope="col">
              <span className="flex flex-col px-6 pr-2 pt-2 gap-1.5">
                <span className="flex flex-col xl:flex-row xl:items-end gap-1">
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl leading-5 uppercase  font-normal flex items-center">Básico</h3>
                  <p className="text-foreground-lighter -my-1 xl:m-0">
                    <span className="text-foreground-lighter  text-xl mr-1 tracking-tighter">$149</span>
                    <span className="text-[13px] leading-4 mt-1">/ mes</span>
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
            <th className="text-foreground w-1/4 px-0 text-left text-sm font-normal" scope="col">
              <span className="flex flex-col px-6 pr-2 pt-2 gap-1.5">
                <span className="flex flex-col xl:flex-row xl:items-end gap-1">
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl leading-5 uppercase  font-normal flex items-center">Básico</h3>
                  <p className="text-foreground-lighter -my-1 xl:m-0">
                    <span className="text-foreground-lighter  text-xl mr-1 tracking-tighter">$149</span>
                    <span className="text-[13px] leading-4 mt-1">/ mes</span>
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
            <th className="text-foreground w-1/4 px-0 text-left text-sm font-normal" scope="col">
              <span className="flex flex-col px-6 pr-2 pt-2 gap-1.5">
                <span className="flex flex-col xl:flex-row xl:items-end gap-1">
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl leading-5 uppercase  font-normal flex items-center">
                    Enterprise
                  </h3>
                  <p className="text-foreground-lighter -my-1 xl:m-0 xl:opacity-0">
                    <span className="text-foreground-lighter  text-xl mr-1 tracking-tighter">Custom</span>
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
          </tr>
        </thead>
        <tbody>
          <tr className="divide-border -scroll-mt-5" style={{ borderTop: 'none' }} id="database-desktop">
            <th
              className="bg-background text-foreground sticky top-[108px] xl:top-[84px] z-10 py-3 pl-6 text-left text-sm font-medium"
              scope="colgroup"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md   bg-brand text-brand-100 ">
                  <BarcodeOutlined className="text-lg" />
                </div>
                <h4 className="m-0 text-base font-normal">Database</h4>
              </div>
            </th>
            <td className="bg-background px-6 py-5 free"></td>
            <td className="bg-background px-6 py-5 pro"></td>
            <td className="bg-background px-6 py-5 team"></td>
            <td className="bg-background px-6 py-5 enterprise"></td>
          </tr>
          <tr className="divide-border">
            <th className="text-foreground flex items-center px-6 py-5 last:pb-24 text-left text-xs font-normal " scope="row">
              <Tooltip title="Número de usuarios que usaran la paltaforma">
                <span>
                  Usuarios <InfoCircleOutlined />
                </span>
              </Tooltip>
            </th>
            <td className="pl-6 pr-2 tier-free ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">1</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-pro ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">2</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-team ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">3</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-enterprise ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">Ilimitados</span>
              </div>
            </td>
          </tr>
          <tr className="divide-border">
            <th className="text-foreground flex items-center px-6 py-5 last:pb-24 text-left text-xs font-normal " scope="row">
              <span>Sucursales</span>
            </th>
            <td className="pl-6 pr-2 tier-free ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">1</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-pro ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">1</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-team ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">2</span>
              </div>
            </td>
            <td className="pl-6 pr-2 tier-enterprise ">
              <div className="text-foreground text-xs flex flex-col justify-center">
                <span className="flex items-center gap-2">3</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
