import { ReactElement } from 'react';
import PageLayout from '@components/PageLayout';

export default function Create(): ReactElement {
  return (
    <PageLayout title="New Pokemon Pol">
      <div className="mt-24 bg-white rounded-2xl shadow-md px-12 py-10">
        <div className="flex items-center gap-20">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="name">Pokemon name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Pokemon name or empty for random"
              className="bg-gray-200 rounded-xl px-6 py-5 placeholder-gray-400 focus:outline-none border border-gray-200 hover:border-accent focus:border-indigo-800"
            />
          </div>
          <div className="flex-none">
            <button type="button" className="btn">
              Generate Pol
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
