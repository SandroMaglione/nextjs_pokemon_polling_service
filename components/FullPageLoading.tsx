/* eslint-disable @next/next/no-img-element */
import { ReactElement } from 'react';

export default function FullPageLoading(): ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <img
        src="https://t09.deviantart.net/K8sHQU_IxbKZwBmyL_qo9mR7kjY=/fit-in/150x150/filters:no_upscale():origin()/pre13/9902/th/pre/f/2008/004/1/3/pokeball_by_pokemar.png"
        alt="Pokeball loading"
        className="h-[2rem] w-[2rem] animate-bounce"
      />
    </div>
  );
}
