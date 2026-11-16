import Image from "next/image";

export function BrandMark({
  className,
}: {
  className?: string;
}) {
  return (
    <Image
      src="/savewise-mark.svg"
      alt=""
      aria-hidden="true"
      width={40}
      height={40}
      className={className}
    />
  );
}
