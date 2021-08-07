import { ReactElement } from 'react';

export default function InfoText({
  label,
  text,
}: {
  label: string;
  text: string;
}): ReactElement {
  return (
    <p className="text-sm text-gray-800 mt-1s">
      <span className="font-medium">{`${label}: `}</span>
      <span className="font-light">{text}</span>
    </p>
  );
}
